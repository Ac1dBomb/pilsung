const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const { GoogleAuth } = require('google-auth-library');
const { Ollama } = require('ollama');
const { spawn } = require('child_process'); // For spawning subprocesses (Llama)



// Configuration for OpenAI
const openaiConfiguration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiConfiguration);



// Configuration for Gemini
const googleAuth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/generativelanguage',
    credentials: { /* Replace with your service account credentials if needed */ }
});



// Configuration for Ollama
const ollama = new Ollama({
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
});




// Database configuration (replace with your database credentials)
const db = require('./db'); // Import your database connection module.




// SQL Sanitization function (using parameterized queries - adapt to your database library)

const sanitizeSQL = (sqlQuery, db) => {


    try {

        // Regular expression to match SELECT statements and extract table and column

        const selectRegex = /SELECT\s+(.*?)\s+FROM\s+(.*?)\s+WHERE\s+(.*?)\s*(?:[=<>!]+)\s*\?/;

        const insertRegex = /INSERT\s+INTO\s+(.*?)\s+\((.*?)\)\s+VALUES\s+\((.*?)\)/;


        let values = [];
        let sanitizedQuery;
        if (selectRegex.test(sqlQuery)) {


            const [, columns, table, condition] = sqlQuery.match(selectRegex);
            // Extract values based on operators. Using a simple split for illustration. Replace with robust parsing in production


            values = sqlQuery.split(/[=<>!]+/g).slice(1).map(v => v.trim());



            sanitizedQuery = `SELECT ${columns} FROM ${table} WHERE ${condition}`;

        } else if (insertRegex.test(sqlQuery)) {


            const [, table, columns, placeholders] = sqlQuery.match(insertRegex);

            values = sqlQuery.split('VALUES')[1].slice(1, -1).split(',').map(v => v.trim());



            sanitizedQuery = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
        } else {

            throw new Error("Unsupported or unsafe SQL query type.");

        }


        // Use your database library's parameterized query method
        return db.query(sanitizedQuery, values);

    } catch (error) {
        console.error("Sanitization Error:", error);
        throw new Error("Error sanitizing SQL query.");
    }

};



router.post('/', async (req, res) => {
    try {
        const { query, model } = req.body;
        let sqlQuery;



        if (model === "openai") {
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo-1106",
                messages: [
                    // ... (Same system prompt as before)
                ],
            });
            sqlQuery = completion.data.choices[0].message.content.trim();
        } else if (model === "gemini") {

            // ... (Gemini API call - adapt as needed when official documentation is available)


        } else if (model === "ollama") {
            const response = await ollama.createCompletion({
                model: process.env.OLLAMA_MODEL || 'llama2',
                prompt: `Translate this query into SQL: ${query}`,
            });
            sqlQuery = response.choices[0].text.trim();


        } else if (model === "llama") {
            // Local Llama integration example using llama.cpp (adapt paths and arguments as needed)
            const llamaProcess = spawn('./llama', [ // Path to your llama executable
                '-m', '/path/to/your/llama/model', // Path to your Llama model file
                '--n_predict', '256', // Adjust prediction parameters as needed
                '-p', `Translate this query into SQL: ${query}`
            ]);


            let llamaOutput = '';
            llamaProcess.stdout.on('data', (data) => {
                llamaOutput += data.toString();
            });



            llamaProcess.stderr.on('data', (data) => {

                console.error(`Llama Error: ${data}`);
                return res.status(500).json({ error: 'Error during Llama execution' });  // Return specific error from llama.cpp

            });



            llamaProcess.on('close', (code) => {

                if (code !== 0) {
                    console.error(`Llama process exited with code ${code}`);
                    return res.status(500).json({ error: 'Error during Llama execution' });
                }


                sqlQuery = llamaOutput.trim();


                processQueryAndRespond(sqlQuery, db, res)


            });





        } else {
            return res.status(400).json({ error: "Invalid model specified." });
        }


        if (model !== "llama"){  //For all other LLMs except for Llama.cpp
            processQueryAndRespond(sqlQuery, db, res)
        }



    } catch (error) {
        console.error("Query processing error:", error);

        // ... (Improved error handling as in the previous response)
    }

});






async function processQueryAndRespond(sqlQuery, db, res){
        try{
                const sanitizedSQL = sanitizeSQL(sqlQuery, db);
                const results = await sanitizedSQL;
                res.json(results);
        }
        catch (error){
            console.error("Post-LLM error:", error)
                res.status(500).json({ error: error.message || 'An error occurred during query processing.' });
        }
}





module.exports = router;