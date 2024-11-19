import os
import threading
import time
from typing import Dict, List

from langchain.agents import AgentType, initialize_agent, load_tools
from langchain.chat_models import ChatOpenAI  # Replace with other models as needed
from langchain.schema import SystemMessage
from sqlalchemy import create_engine, text

# Load environment variables (replace with your preferred method)
DATABASE_URL = os.environ.get("DATABASE_URL")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY") # Example; adapt to other LLMs
MODEL_PROVIDER = os.environ.get("MODEL_PROVIDER", "openai") # Default to OpenAI

# Multi-Agent Configuration (config.py or a separate YAML/JSON file)
AGENT_CONFIG = {
    "agent1": {
        "model": "ChatOpenAI",  # or "google/gemini-pro" or others
        "tools": ["wikipedia", "llm-math"],  # Example tools
        "objective": "Gather information about historical events.", # Example
        "initial_task": "Find information about the French Revolution." # Example
    },
    "agent2": {
        "model": "ChatOpenAI",
        "tools": ["serpapi", "requests"],
        "objective": "Analyze current trends and news.",
        "initial_task": "Summarize recent news on artificial intelligence." # Example

    },
    # Add more agents as needed
}


def create_agent_from_config(config: Dict) -> AgentType:

    llm = None
    if config['model'] == "ChatOpenAI":
        if MODEL_PROVIDER.lower() != 'openai':
            raise ValueError("Model provider mismatch.  Config specifies OpenAI, but environment variable is not set to 'openai'.")
        llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY)
    # Add logic for other LLMs like Gemini
    elif config['model'].startswith("google/"): # Placeholder for Gemini; modify as needed
        if MODEL_PROVIDER.lower() != 'gemini': # Replace with actual provider name for Gemini
            raise ValueError("Model provider mismatch. Config specifies Gemini, but environment variable is not set to 'gemini'.")

        # Add code to initialize Gemini models (similar to ChatOpenAI)
        # ...

    if llm is None:
        raise ValueError(f"Unsupported LLM specified: {config['model']}")

    tools = load_tools(config["tools"])
    system_message = SystemMessage(config["objective"])
    agent = initialize_agent(
        tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True, system_message=system_message
    )
    return agent



def agent_loop(agent: AgentType, agent_id: str, db_engine):
    while True:
        try:
            with db_engine.connect() as conn:
                # 1. Check for tasks
                task_result = conn.execute(
                    text(f"SELECT task FROM tasks WHERE agent_id = '{agent_id}' AND status = 'pending' LIMIT 1")
                ).first()

                if task_result:

                    task = task_result[0]

                    print(f"Agent {agent_id} received task: {task}")




                    # 2. Update task status to 'running' (important for preventing duplicate processing)

                    conn.execute(text(f"UPDATE tasks SET status = 'running' WHERE agent_id = '{agent_id}' AND task = '{task}'"))
                    conn.commit()


                    # 3. Execute the task
                    result = agent(task)


                    # 4. Save result and update task status

                    conn.execute(
                        text(f"INSERT INTO results (agent_id, task, result) VALUES ('{agent_id}', '{task}', '{result['output']}')")
                    )
                    conn.execute(
                        text(f"UPDATE tasks SET status = 'complete' WHERE agent_id = '{agent_id}' AND task = '{task}'")

                    )



                    conn.commit()


                    print(f"Agent {agent_id}: Task '{task}' complete. Result: {result['output']}")
                else:

                    print(f"Agent {agent_id} waiting for tasks...") # Add debug message
                    time.sleep(5) # Check for tasks every 5 seconds

        except Exception as e:

            print(f"Agent {agent_id} encountered an error: {e}") #Log the error
            with db_engine.connect() as conn: # Connection within error handling to make sure a connection is available

                conn.execute(
                    text(f"UPDATE tasks SET status = 'failed' WHERE agent_id = '{agent_id}' AND status = 'running'")

                ) #Set task status to failed

                conn.commit()
            time.sleep(10)  # Wait before checking for new tasks




def main():
    db_engine = create_engine(DATABASE_URL)  # Create database engine

    # Create necessary tables if they don't exist
    with db_engine.connect() as conn:
        conn.execute(text("CREATE TABLE IF NOT EXISTS tasks (id SERIAL PRIMARY KEY, agent_id TEXT, task TEXT, status TEXT)"))
        conn.execute(text("CREATE TABLE IF NOT EXISTS results (id SERIAL PRIMARY KEY, agent_id TEXT, task TEXT, result TEXT)"))
        conn.commit()

    agents = {}
    agent_threads = []


    for agent_id, config in AGENT_CONFIG.items():

        agent = create_agent_from_config(config)


        agents[agent_id] = agent


        thread = threading.Thread(target=agent_loop, args=(agent, agent_id, db_engine))

        agent_threads.append(thread)




    for thread in agent_threads:

        thread.start()

        with db_engine.connect() as conn: #Add initial tasks
            for agent_id, config in AGENT_CONFIG.items():
                conn.execute(text(f"INSERT INTO tasks (agent_id, task, status) VALUES ('{agent_id}', '{config['initial_task']}', 'pending')"))

            conn.commit()





    # Keep the main thread alive (you can add other logic here if needed)

    try:

        while True:
            time.sleep(60)
    except KeyboardInterrupt:
        print("Exiting...")



if __name__ == "__main__":
    main()