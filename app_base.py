from flask import Flask, request, jsonify
import vertexai
from vertexai.preview.generative_models import GenerativeModel, SafetySetting, Tool
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import VertexAIEmbeddings
from langchain.memory import ConversationBufferMemory
from langchain.chains import RetrievalQA, LLMChain
from langchain.prompts import PromptTemplate
import psycopg2
import json
import os
import logging
import time

app = Flask(__name__)

# Configuration
config = {}

def load_config():
    """Loads configuration from config.json or environment variables."""
    global config
    try:
        with open('config.json', 'r') as f:
            config = json.load(f)
    except FileNotFoundError:
        print("config.json not found. Using environment variables.")
        config = {}

    config = {
        "DB_HOST": config.get("DB_HOST") or os.environ.get("DB_HOST") or "127.0.0.1",
        "DB_NAME": config.get("DB_NAME") or os.environ.get("DB_NAME"),
        "DB_USER": config.get("DB_USER") or os.environ.get("DB_USER"),
        "DB_PASSWORD": config.get("DB_PASSWORD") or os.environ.get("DB_PASSWORD"),
        "PROJECT_ID": config.get("PROJECT_ID") or os.environ.get("PROJECT_ID") or "your-project-id",
        "LOCATION": config.get("LOCATION") or os.environ.get("LOCATION") or "us-central1",
        "GENERATION_CONFIG": config.get("GENERATION_CONFIG") or {},
        "SAFETY_SETTINGS": config.get("SAFETY_SETTINGS") or [],
        "LOGGING": config.get("LOGGING") or {},
        "LANGCHAIN": config.get("LANGCHAIN") or {},
    }

load_config()

# Logging Setup
logging.basicConfig(
    filename=config["LOGGING"].get("filename", "app.log"),
    level=getattr(logging, config["LOGGING"].get("level", "INFO")),
    format=config["LOGGING"].get("format", "%(asctime)s - %(levelname)s - %(message)s")
)


# LangChain setup
memory = ConversationBufferMemory(k=config["LANGCHAIN"].get("memory_size", 5))
embeddings = VertexAIEmbeddings(location=config["LOCATION"]) # Initialize here


# Safety Settings
SAFETY_SETTINGS = []
for setting in config["SAFETY_SETTINGS"]:
    safety_setting = SafetySetting(
        category=getattr(SafetySetting.HarmCategory, setting["category"]),
        threshold=getattr(SafetySetting.HarmBlockThreshold, setting["threshold"])
    )
    SAFETY_SETTINGS.append(safety_setting)




def execute_db_command(command, params=None):
    try:
        conn = psycopg2.connect(host=config["DB_HOST"], database=config["DB_NAME"], user=config["DB_USER"], password=config["DB_PASSWORD"])
        cur = conn.cursor()
        cur.execute(command, params)
        conn.commit()
        try:
            result = cur.fetchall()
        except psycopg2.ProgrammingError:  # Handle commands that don't return rows
            result = None
        cur.close()
        conn.close()
        return result
    except psycopg2.Error as e:
        app.logger.error(f"Database error: {e}") # Log the error
        return f"Database error: {e}"



def save_interaction(interaction):
    try:
        with open('gemini_interactions.json', 'r') as f:
            interaction_history = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        interaction_history = []

    interaction_history.append(interaction)

    with open('gemini_interactions.json', 'w') as f:
        json.dump(interaction_history, f, indent=4)



@app.route('/health')
def health_check():
    try:
        conn = psycopg2.connect(host=config["DB_HOST"], database=config["DB_NAME"], user=config["DB_USER"], password=config["DB_PASSWORD"])
        conn.close() #Close connection immediately after test
        return jsonify({"status": "ok"}), 200

    except Exception as e:
        app.logger.error(f"Health check failed: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500



@app.route('/api/db_interact', methods=['POST'])
def db_interact():

    try:
        user_message = request.get_json().get("message") # Use .get to avoid errors if message not included

    except AttributeError:  #  Handle if request is not JSON
        return jsonify({"error": "Invalid request format. JSON expected."}), 400


    try:
        vertexai.init(project=config["PROJECT_ID"], location=config["LOCATION"])

        selected_model_name = config["MODELS"][config["LANGCHAIN"]["llm_default"]]


        if selected_model_name.startswith("gpt"):
            llm = ChatOpenAI(temperature=config["GENERATION_CONFIG"].get("temperature", 0.0), openai_api_key=config["API_KEYS"]["openai"], model_name=selected_model_name)
        else:  # Vertex AI Model
            tools = [Tool.from_function(function=execute_db_command, description="Executes SQL")]
            llm = GenerativeModel(selected_model_name, tools=tools, safety_settings=SAFETY_SETTINGS)

        if config["LANGCHAIN"].get("embeddings_model"):


            from langchain.vectorstores import FAISS
            db = FAISS.load_local("your_faiss_index_path", embeddings) # Load database - MAKE SURE THIS EXISTS
            retriever = db.as_retriever()
            langchain_chain = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever) # Correct chain type



        else: # Default LangChain setup
            template = """You are a helpful AI assistant. The user's query is: {query}"""
            prompt = PromptTemplate(template=template, input_variables=["query"])
            langchain_chain = LLMChain(llm=llm, memory=memory, prompt=prompt)  # Use memory


        response = langchain_chain.run(user_message)


        interaction = {
            "timestamp": time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()),
            "prompt": user_message,
            "response": response
        }
        save_interaction(interaction)

        return jsonify({"response": response})

    except Exception as e: #Broad exception handling, log and return error
        app.logger.error(f"Error in db_interact: {e}")
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True, port=5001)