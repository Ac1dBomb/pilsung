import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Alert } from '@mui/material';
import axios from 'axios';
import api from '../services/api'; // Your API configuration


function Logout() {
    const navigate = useNavigate();
    const [logoutError, setLogoutError] = useState('');
    const [logoutMessage, setLogoutMessage] = useState('');



    const handleLogout = async () => {

        try {
            const response = await api.post('/logout'); // API call to your backend

            if (response.status === 200) {

                localStorage.removeItem('isLoggedIn');
                // Redirect after successful logout
                setLogoutMessage('Logout successful!');
                setTimeout(() => {
                    navigate('/login');

                }, 1500); // Redirect after message display


            } else {
               setLogoutError('Logout Failed. Please try again.');

            }



        } catch (error) {

            setLogoutError('Logout Failed: ' + error.message);


        }

    };



    return (
      <Container maxWidth="sm" sx={{ marginTop: '2rem' }}>
          <Typography variant="h4" align="center" gutterBottom>
              Logout
          </Typography>

          <Button variant="contained" color="primary" onClick={handleLogout}>
              Logout
          </Button>

          {logoutMessage && ( // Conditionally render the success message
            <Alert severity="success" sx={{ mt: 2 }}>
              {logoutMessage}
            </Alert>
          )}

           {logoutError && ( // Conditionally render the error message
                <Alert severity="error" sx={{ mt: 2 }}>
                  {logoutError}
                </Alert>
           )}

      </Container>

    );



}



export default Logout;
