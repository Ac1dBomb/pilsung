import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Alert, Grid } from '@mui/material';
import axios from 'axios';
import api from '../services/api'; // Your API configuration

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');



    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError(''); // Clear any previous errors

        try {
            const response = await api.post('/login', { username, password });


            if (response.status === 200) { // Successful login
                // Store authentication token/user info (e.g., in local storage, session, or context)
                localStorage.setItem('isLoggedIn', 'true'); // Example: storing login status
                // Redirect to the account page or other protected route
                navigate('/account');

            } else {
                // Display an error message from the backend if available
                const errorMessage = response.data.error || 'Login failed. Please check your credentials.';
                setLoginError(errorMessage);

            }

        } catch (error) {
             // Handle network errors or other exceptions
            setLoginError('Login failed. ' + error.message); //Generic error message for user
        }

    };




    return (
        <Container maxWidth="sm" sx={{ marginTop: '2rem' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Login
            </Typography>

            <form onSubmit={handleLogin}>
                 <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Username"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required  // Make the field required
                        />

                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            fullWidth
                            type="password" // Hide the password
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required // Make the field required

                        />

                    </Grid>

                 </Grid>




                <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '1rem' }}>
                    Login
                </Button>
            </form>

            {/* Display error message if there is one */}

            {loginError && <Alert severity="error" sx={{ mt: 2 }}>{loginError}</Alert>}

        </Container>
    );
}



export default Login;
