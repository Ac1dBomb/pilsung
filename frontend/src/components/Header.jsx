import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import './Header.css';



function Header({ isLoggedIn, handleLogout }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleLogoutClick = () => {
        handleLogout();
        navigate('/');
    };

    const navLinks = [
        { to: "/", text: "Home", icon: <HomeIcon />, show: true },
        { to: "/about", text: "About", icon: <InfoIcon />, show: true },
        { to: "/query", text: "Query Interface", icon: <SearchIcon />, show: isLoggedIn },
        { to: "/login", text: "Login", icon: <LoginIcon />, show: !isLoggedIn },
        { to: "/signup", text: "Sign Up", icon: <LoginIcon />, show: !isLoggedIn },
        // ... more routes
    ];



    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#282c34', color: '#61dafb', boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)' }}>
            <Toolbar>
                {/* ... (Mobile Menu Icon - same as before) */}

                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        fontFamily: 'Roboto Mono',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate('/')}
                >
                    Pilsung AI SQL  {/* Corrected title */}
                </Typography>



                {!isMobile && (
                    <div>
                        {navLinks.filter(link => link.show).map((link) => ( // Filter links based on show property


                            <Button

                                key={link.to}
                                color="inherit"
                                component={link.to === '/logout' ? null : Link} // Do not use Link for logout button

                                to={link.to !== '/logout' ? link.to : null} // Do not set a 'to' for logout

                                onClick={link.to === '/logout' ? handleLogoutClick : null} // Call logout handler if logout button

                                sx={{
                                    fontWeight: location.pathname === link.to ? 'bold' : 'normal',

                                    textDecoration: location.pathname === link.to ? 'underline' : 'none',

                                    fontFamily: 'Roboto Mono',
                                    marginRight: '1rem'

                                }}

                            >

                                {link.text}

                            </Button>
                        ))}


                        {isLoggedIn && ( // Show Logout button only if logged in
                            <Button color="inherit" onClick={handleLogoutClick} sx={{ fontFamily: 'Roboto Mono', marginRight: '1rem' }}>

                                <LogoutIcon sx={{ marginRight: '0.5rem' }} /> {/* Add logout icon */}

                                Logout

                            </Button>
                        )}

                    </div>
                )}

            </Toolbar>



            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)} >

                <List sx={{ backgroundColor: '#282c34', color: '#61dafb', width: '250px' }}>


                    <div className="drawer-header"> {/* Added a header in the drawer */}
                    <Typography variant="h6" component="div" sx={{ p: 2, fontFamily: 'Roboto Mono', fontWeight: 'bold' }}>
                        Menu
                    </Typography>
                      <Divider /> {/* Add divider below header */}
                    </div>

                    {navLinks.filter(link => link.show).map((link) => (  // Filter here as well

                        <ListItem

                            key={link.to}
                            disablePadding
                            component={link.onClick ? null : Link} // Allow custom onClick

                            to={link.onClick ? null : link.to}


                            onClick={link.onClick}  // Pass in the onClick function if provided

                            sx={{
                                "&:hover": {  // Add hover effect
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '0.25rem'
                                },


                                "&.Mui-selected": {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '0.25rem'


                                }

                            }}

                        >


                            <ListItemButton>
                                <ListItemIcon sx={{ color: 'inherit' }}>
                                    {link.icon}
                                </ListItemIcon>

                                <ListItemText primary={link.text} sx={{ fontFamily: 'Roboto Mono' }} />
                            </ListItemButton>

                        </ListItem>

                    ))}
                </List>
            </Drawer>

        </AppBar>
    );
}


export default Header;