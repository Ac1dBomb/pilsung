require('dotenv').config();
const express = require('express');
const helmet = require('helmet'); // Security enhancement
const rateLimit = require('express-rate-limit'); // Security enhancement
const { Pool } = require('pg');
const userRoutes = require('./api/users');
const queryRoutes = require('./api/query');

const app = express();
const PORT = process.env.PORT || 3001;



// PostgreSQL database connection
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: process.env.PG_SSL ? { rejectUnauthorized: false } : false,
  max: 20, // Set a maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client can be idle before being closed (milliseconds)
  connectionTimeoutMillis: 2000,  // How long to wait for a connection before timing out (milliseconds).
});


pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1); // Exit the process if a critical database error occurs in a pooled client
});


// Security Enhancements:
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.', // Custom message
});

app.use(limiter);



app.use(express.json()); // Middleware to parse JSON


// Check database connection after setting up middleware
pool.connect()
  .then(() => console.log('PostgreSQL connected!'))
  .catch(err => {
    console.error('Connection error:', err.stack);
    // Consider gracefully shutting down the server if the database connection fails
    process.exit(1);
  });




// API routes
app.use('/api/users', userRoutes);
app.use('/api/query', queryRoutes);

// Example data route (replace with your actual logic)
app.get('/api/data', async (req, res) => {
  try {
    // Use parameterized queries to prevent SQL injection
    const result = await pool.query('SELECT * FROM your_table'); // Replace 'your_table'
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Database error' }); // Generic error message for security in production
  }
});


// Error handling middleware (for any uncaught errors)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack); // Log the error
  res.status(500).json({ error: 'An internal server error occurred' }); // Generic message
});



app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));