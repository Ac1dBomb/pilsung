# Pilsung 필승 : Certain Victory - Your Natural Language Interface to PostgreSQL

Pilsung empowers you to interact with your PostgreSQL database using intuitive natural language, streamlining data manipulation and retrieval.  Leveraging the power of LangChain for advanced natural language processing and seamlessly deployed on Render, Pilsung offers a robust and efficient solution for database interaction.

## Key Features

* **Intuitive Natural Language Interface:** Query your database using everyday language, eliminating the need for complex SQL syntax.
* **Comprehensive CRUD Operations:** Perform Create, Read, Update, and Delete operations with ease and precision.
* **Advanced NLP with LangChain:** Pilsung integrates LangChain's powerful capabilities to understand and process complex natural language queries.
* **Effortless Deployment on Render:**  Deploy your Pilsung application quickly and easily with the provided `render.yaml` configuration file.
* **Secure and Robust Design:** Built-in security measures and comprehensive error handling ensure data integrity and application stability.
* **Flexible API Key Integration:** Supports OpenAI, Gemini, and other LLMs via API keys, giving you flexibility and choice. (See **Configuration**)


## Getting Started

### Prerequisites

* **Python 3.8+:**  Make sure you have a compatible Python version installed on your system.
* **PostgreSQL:** A running PostgreSQL database instance is required.  Ensure that you have the necessary credentials (username, password, database name, host, port) to connect to your database.
* **Render Account:** A Render account is required for deploying the application.
* **API Key:** An API key for your chosen Large Language Model (LLM) provider (e.g., OpenAI, Gemini, or others) is needed for LangChain integration.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ac1dBomb/pilsung.git
Navigate to the project directory:

cd pilsung
Create and activate a virtual environment (recommended):

python3 -m venv .venv
source .venv/bin/activate  # On Linux/macOS
.venv\Scripts\activate  # On Windows
Install dependencies:

pip install -r requirements.txt
Configuration
Environment Variables: Create a .env file in the root directory of your project and add the following environment variables, replacing the placeholders with your actual values:

DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database_name>"  
API_KEY=<your_api_key>  
SECRET_KEY=<your_secret_key> 
MODEL_PROVIDER=<your_model_provider> # e.g., "openai", "gemini"
Adjust the DATABASE_URL format as needed to match your PostgreSQL connection string. The MODEL_PROVIDER variable allows you to specify the LLM provider, allowing easy switching between providers. Ensure your .env file is included in your .gitignore to prevent sensitive information from being committed to version control.

Render Configuration: If deploying to Render, configure the environment variables in the Render dashboard's "Environment" section. Use Render's secrets management for sensitive information like API keys and database credentials. The provided render.yaml file can be used as a starting point for your Render deployment configuration. You'll need to adjust it to match your application's name and other specific requirements.

Running the Application
Development Server: To run the Flask development server locally:

python app.py
The application will be accessible at http://127.0.0.1:5000/.

Render Deployment: Commit and push your code to your GitHub repository. Create a new web service on Render, linking it to your repository. Configure the necessary environment variables in the Render dashboard, and deploy your application.

Tech Stack
Backend: Flask (Python)
Database: PostgreSQL
Natural Language Processing: LangChain
Deployment: Render
Frontend: React, Material UI
Contributing
Contributions are welcome and encouraged! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

License
This project is licensed under the MIT License.

Contact
Sam - ipilsungi@protonmail.com

Acknowledgements
The open-source community for their contributions to Flask, PostgreSQL, LangChain, and React.
Render for their streamlined deployment platform.
OpenAI and Google Gemini teams for their work on large language models.
(This README is current as of November 19, 2024, and may be updated in the future.)
