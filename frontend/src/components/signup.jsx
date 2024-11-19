import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Container, Alert, Grid, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import api from '../services/api'; // Your API configuration

function SignUp() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); // Added email field
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');  // For password confirmation
    const [signupError, setSignupError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // To toggle password visibility



    const handleSignUp = async (e) => {
        e.preventDefault();
        setSignupError('');

        // Basic client-side validation
        if (password !== confirmPassword) {
            setSignupError('Passwords do not match.');
            return;
        }


        try {
            const response = await api.post('/signup', {
                username,
                email,  // Include email in request
                password,
            });



            if (response.status === 201) { // Successful signup (201 Created)

                // Optionally, you can log in the user automatically after signup
                localStorage.setItem('isLoggedIn', 'true');
                // Redirect to account or welcome page
                navigate('/account'); // Or /welcome

            } else {
                const errorMessage = response.data.error || 'Signup failed.  Please try again.';
                setSignupError(errorMessage);

            }




        } catch (error) {
            // Check for specific error codes/messages from backend if needed.
            setSignupError('Signup failed: ' + error.message);


        }

    };





    return (
        <Container maxWidth="sm" sx={{ marginTop: '2rem' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Sign Up
            </Typography>

            <form onSubmit={handleSignUp}>
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
                        <TextField  // Email input
                            label="Email"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                         />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            InputProps={{ // Add eye icon for show/hide password
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>

                                ),
                            }}
                        />

                    </Grid>


                    <Grid item xs={12}> {/*Confirm Password Field */}
                        <TextField
                            label="Confirm Password"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>

                                ),
                            }}
                        />

                    </Grid>


                </Grid>



                <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '1rem' }}>
                    Sign Up
                </Button>

            </form>

            {signupError && <Alert severity="error" sx={{ mt: 2 }}>{signupError}</Alert>}

            <Typography variant="body2" align="center" sx={{ marginTop: '1rem' }}>
                Already have an account? <Link to="/login">Login</Link>
            </Typography>

        </Container>

    );


}



export default SignUp;