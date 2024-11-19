import os
import threading
import time
from typing import Dict, List

from langchain.agents import AgentType, initialize_agent, load_tools
from langchain.llms import Ollama
from langchain.schema import SystemMessage
from sqlalchemy import create_engine, text
import yaml


# Load configuration from YAML
with open("config_ollama.yaml", "r") as config_file:
    CONFIG = yaml.safe_load(config_file)

# Get global settings
GLOBAL_CONFIG = CONFIG.get("global", {})
OLLAMA_BASE_URL = GLOBAL_CONFIG.get("ollama_base_url", "http://localhost:11434")
DEFAULT_MODEL = GLOBAL_CONFIG.get("default_model", "llama2")

DATABASE_URL = os.environ.get("DATABASE_URL")  # Or load from a dedicated secrets file

DB_ENGINE = create_engine(DATABASE_URL)


def create_agent(agent_config: Dict) -> AgentType:
    model_name = agent_config.get("model", DEFAULT_MODEL)
    print(f"Initializing agent with model: {model_name} at {OLLAMA_BASE_URL}") # Log model initialization
    llm = Ollama(base_url=OLLAMA_BASE_URL, model=model_name)
    tools = load_tools(agent_config["tools"])
    system_message = SystemMessage(content=agent_config["objective"])


    agent = initialize_agent(
        tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True, system_message=system_message
    )


    return agent



def agent_loop(agent: AgentType, agent_id: str):

    while True:


        try:
            with DB_ENGINE.connect() as conn:
                task_result = conn.execute(
                    text(f"SELECT task FROM tasks WHERE agent_id = '{agent_id}' AND status = 'pending' LIMIT 1")
                ).first()



                if task_result:


                    task = task_result[0]

                    # ... (Rest of the task processing logic is the same)

                    # Update task status, execute, save results (as in the previous example)

                    print(f"Agent {agent_id}: Task '{task}' complete. Result saved to database.")

                else:
                    time.sleep(5)  # Check for new tasks every 5 seconds



        except Exception as e:

            print(f"Agent {agent_id} encountered an error: {e}") # Log errors for debugging

            with DB_ENGINE.connect() as conn: # Make sure you have a valid connection in the except block

                conn.execute(
                    text(f"UPDATE tasks SET status = 'failed' WHERE agent_id = '{agent_id}' AND status = 'running'")

                )
                conn.commit()

            time.sleep(10) #Pause on error




def main():
    # Database setup (create tables if they don't exist) - same as previous versions

    with DB_ENGINE.connect() as conn:
        conn.execute(
            text("CREATE TABLE IF NOT EXISTS tasks (id SERIAL PRIMARY KEY, agent_id TEXT, task TEXT, status TEXT)")
        )
        conn.execute(
            text("CREATE TABLE IF NOT EXISTS results (id SERIAL PRIMARY KEY, agent_id TEXT, task TEXT, result TEXT)")

        )
        conn.commit()



    agent_threads = []

    for agent_id, agent_config in CONFIG.items():
        if agent_id == "global": continue #Skip global config section


        agent = create_agent(agent_config)


        thread = threading.Thread(target=agent_loop, args=(agent, agent_id))


        agent_threads.append(thread)


    for thread in agent_threads:
        thread.start()



    # Add initial tasks
    with DB_ENGINE.connect() as conn:
        for agent_id, agent_config in CONFIG.items():
            if agent_id == "global": continue # Skip global settings when inserting initial tasks
            conn.execute(
                text(f"INSERT INTO tasks (agent_id, task, status) VALUES ('{agent_id}', '{agent_config['initial_task']}', 'pending')")
            )
        conn.commit()



    try:
        while True:  # Keep main thread alive
            time.sleep(60)
    except KeyboardInterrupt:

        print("Exiting...")


if __name__ == "__main__":
    main()