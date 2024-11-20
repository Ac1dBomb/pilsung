import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Alert, Grid } from '@mui/material';
import AuthContext from '../context/AuthContext'; // Assuming you're using a context for auth
import api from '../services/api';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const { login } = useContext(AuthContext); // Use login function from context


    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');

        try {
            const response = await api.post('/api/login', { username, password }); // Corrected API endpoint

            if (response.ok) { // Check for successful response (status 2xx)
                const data = await response.json(); // Get the response data (e.g., token)

                // Use your authentication context to log in:
                login(data.token, data.user); // Or however your login function works

                // Example: Redirect or update UI based on logged in status:

                navigate('/account'); // Assuming /account is a protected route
            } else {
                const errorData = await response.json(); // Parse error data from response
                const errorMessage = errorData.error || 'Login failed. Please check your credentials.';
                setLoginError(errorMessage);
            }
        } catch (error) {
            // Handle network or other unexpected errors
            console.error('Login failed:', error);

            setLoginError('A network error occurred. Please try again later.'); // More user-friendly
        }
    };

    return (
      <Container maxWidth="sm" sx={{ marginTop: '2rem' }}>
          <Typography variant="h4" align="center" gutterBottom>Login</Typography>
          <form onSubmit={handleLogin}> {/* Add onSubmit handler */}
              <Grid container spacing={2}>
                  <Grid item xs={12}>
                      <TextField
                          label="Username"
                          fullWidth
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                      />
                  </Grid>
                  <Grid item xs={12}>
                      <TextField
                          label="Password"
                          fullWidth
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                      />
                  </Grid>
              </Grid>
              <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '1rem' }}>
                  Login
              </Button>
          </form>

          {/* Display error messages if necessary */}
          {loginError && <Alert severity="error" sx={{ mt: 2 }}>{loginError}</Alert>}
      </Container>
    );
}

export default Login;
