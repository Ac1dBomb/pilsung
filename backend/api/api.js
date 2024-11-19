const express = require('express');
const { Pool } = require('pg');  // PostgreSQL library for Node.js

const app = express();
const PORT = process.env.PORT || 8443; // Choose an available port

const pool = new Pool({
  connectionString: process.env.DATABASE_URL // Your PostgreSQL connection URL
});

app.get('/api/items', async (req, res) => { // Example endpoint
    try {
      const result = await pool.query('SELECT * FROM your_table'); // Replace with your query
      res.json(result.rows);
    } catch (err) {
      console.error("Error executing query", err.stack)
      res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));