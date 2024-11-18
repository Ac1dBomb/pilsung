# Pilsung

Pilsung is a Flask-based web application that allows users to interact with a PostgreSQL database using natural language.  It leverages LangChain for natural language processing and Render for deployment.

## Features

* **Natural Language Interface:** Interact with your PostgreSQL database using everyday language.
* **CRUD Operations:** Perform Create, Read, Update, and Delete operations seamlessly.
* **LangChain Integration:** Utilizes LangChain's powerful features for enhanced natural language understanding.
* **Render Deployment:** Easy deployment on Render with a provided `render.yaml` file.
* **Secure and Robust:** Built with security and error handling in mind.

## Getting Started

### Prerequisites

* **Python 3.8+:** Ensure you have Python 3.8 or higher installed.
* **PostgreSQL:**  A running PostgreSQL database instance is required.
* **Render Account:** You'll need a Render account for deployment.
* **Gemini API Key:**  An Gemini API key is necessary for LangChain's interaction with the LLM or,
* **OpenAI API Key:**  An OpenAI API key is necessary for LangChain's interaction with the LLM aka
* **ChatGPT API Key:**  Also can use this or other models.


### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ac1dBomb/pilsung.git
   ```

2. Navigate to the project directory:
   ```bash
   cd pilsung
   ```

3. Create a virtual environment (recommended):
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Linux/macOS
   .venv\Scripts\activate  # On Windows
   ```

4. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

5. Set up environment variables: Create a `.env` file in the root directory and add the following, replacing placeholders with your actual values:

   ```
   DATABASE_URL=your_database_url
   OPENAI_API_KEY=your_openai_api_key
   SECRET_KEY=your_secret_key  
   ```

### Usage

1. Run the Flask development server:
   ```bash
   python app.py
   ```

2. Access the application in your web browser at `http://127.0.0.1:5000/`.

3. Enter natural language queries to interact with your database.

### Deployment (Render)

1. Commit your changes and push to your GitHub repository.

2. Create a new web service on Render, connecting it to your GitHub repository.

3. Set the environment variables in the Render dashboard, matching the ones in your `.env` file. Use Render's secrets management to keep sensitive information secure.

4. Deploy your application.


## Built With

* [Flask](https://flask.org/)
* [PostgreSQL](https://www.postgresql.org/)
* [LangChain](https://python.langchain.com/)
* [Render](https://render.com/)


## Contributing

Contributions are welcome! Please feel free to open issues and submit pull requests.


## License

This project is licensed under the MIT License.

## Contact

[Sam] - [ipilsungi@prontonmail.com]



## Acknowledgements

*  Thanks to the open-source community for their valuable contributions to the libraries used in this project.
*  Google
*  Google Gemini Team
*  OpenAI
*  Render

(This README is current as of 18 November 2024 and may require updates in the future.)
