import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

function Header() {
    return (
        <AppBar position="static"> {/* Use MUI's AppBar for a header */}
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Your App Name  {/* Replace with your app name */}
                </Typography>
                <Button color="inherit" component={Link} to="/">Home</Button>
                
                <Button color="inherit" component={Link} to="/about">About</Button>  {/* Example link */}
                {/* Add more links as needed */}
            </Toolbar>
        </AppBar>
    );
}