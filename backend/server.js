require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const userRoutes = require('./api/users');
const queryRoutes = require('./api/query');
const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: process.env.PG_SSL ? { rejectUnauthorized: false } : false // Include this for SSL or set to false if not using.
});

pool.connect()
  .then(() => console.log('PostgreSQL connected!'))
  .catch(err => console.error('Connection error:', err.stack));



app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM your_table');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'An error occurred' }); // Send error as JSON
  }

});
app.use('/api/users', userRoutes); // Mount user routes under /api/users
app.use('/api/query', queryRoutes); // Mount query routes under /api/query

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));