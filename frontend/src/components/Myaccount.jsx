import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Alert, Grid } from '@mui/material';
import axios from 'axios'; // For making API requests

// Assuming api.js handles the base URL and other API configurations
import api from '../services/api';


function Account() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');  // To display success/error message
    const [error, setError] = useState(''); // Separate error handling for API calls


    useEffect(() => {
        // Fetch user data (replace with your actual logic)
        const fetchUserData = async () => {
            try {
                const response = await api.get('/account'); // Adjust endpoint as needed
                setUserData(response.data);
            } catch (err) {
                setError("Error fetching user data. " + err.message);  //Display user friendly message

            }
        };

        fetchUserData();
    }, []);




    const handleUpdateAccount = async (e) => {
        e.preventDefault();
        setUpdateMessage(''); // Clear previous messages
        setError('');

        try {

            const response = await api.put('/account', {  // Assuming PUT request for update
                username: newUsername || userData.username, // Keep original if not changing
                password: newPassword, // Update if new password is provided
            });

            if (response.status === 200) {
                setUpdateMessage('Account updated successfully!');
                setNewPassword(''); // Clear password fields for security
                setNewUsername('');

            } else {
                setError('Failed to update account.  Please try again later.');

            }
        } catch (err) {
            setError('Error updating account: ' + err.message); // Handle API errors

        }

    };



    if (!userData) {
        return <div>Loading user data...</div>; // Loading state
    }


    if (error) {
        return ( <Alert severity="error">{error}</Alert>); // Display an error message


    }





    return (
        <Container maxWidth="sm" sx={{ marginTop: '2rem' }}> {/* Use MUI Container for better layout */}
            <Typography variant="h4" align="center" gutterBottom>
                My Account
            </Typography>

           {/* Display user data */}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="body1">
                       **Username:** {userData.username}
                    </Typography>
                </Grid>
                {/* Add more data fields as needed */}
            </Grid>




            <form onSubmit={handleUpdateAccount}>
                <Grid container spacing={2}> {/*Use grid for alignment */}
                    <Grid item xs={12}>
                        <TextField
                           label="New Username (optional)"
                           fullWidth
                           value={newUsername}
                           onChange={(e) => setNewUsername(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        label="New Password"
                        fullWidth
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}

                        />

                    </Grid>


                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ marginTop: '1rem' }}

                >


                    Update Account
                </Button>
                {updateMessage && <Alert severity="success" sx={{ mt: 2 }}>{updateMessage}</Alert>} {/*Success message */}



            </form>

            <Button onClick={() => navigate('/logout')}  sx={{ marginTop: '1rem' }}> {/* Logout button */}
            Log Out
            </Button>




        </Container>

    );



}




export default Account;