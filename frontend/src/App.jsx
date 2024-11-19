import React, { useState, useEffect, Suspense } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Outlet, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import axios from 'axios'; // For API requests
import api from './services/api'; // Your API configuration


// Use lazy loading for better performance
const Header = React.lazy(() => import('./components/Header'));
const Home = React.lazy(() => import('./components/Home'));
const Resources = React.lazy(() => import('./components/resources'));
const Database = React.lazy(() => import('./components/database'));
const About = React.lazy(() => import('./components/about'));
const Contact = React.lazy(() => import('./components/contact'));
const Account = React.lazy(() => import('./components/account'));
const Login = React.lazy(() => import('./components/login'));
const Logout = React.lazy(() => import('./components/logout'));
const SignUp = React.lazy(() => import('./components/signup')); // Import SignUp
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard')); //Import Admin


const theme = createTheme();
const queryClient = new QueryClient();

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    useEffect(() => {
        const storedLoggedInStatus = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(storedLoggedInStatus === 'true');
    }, []);




    const RequireAuth = ({ children }) => { // Authentication wrapper
        return isLoggedIn ? (
            children
         ) : (

            <Navigate to="/login" replace />

        );


    };





    return (

        <QueryClientProvider client={queryClient}> {/* Wrap with QueryClientProvider */}
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>

                    <Suspense fallback={<div>Loading...</div>}> {/* Handle lazy loading */}
                        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> {/* Pass login state */}

                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route index element={<Home />} />
                                <Route path="resources" element={<Resources />} />
                                <Route path="database" element={<Database />} />
                                <Route path="about" element={<About />} />
                                <Route path="contact" element={<Contact />} />
                                <Route
                                    path="account"
                                    element={
                                      <RequireAuth> {/* Protect the account route */}
                                        <Account />
                                      </RequireAuth>

                                    }
                                />

                                 <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn} />} /> {/*Pass setIsLoggedIn*/}

                                <Route path="logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} /> {/*Pass setIsLoggedIn*/}
                                <Route path="signup" element={<SignUp setIsLoggedIn={setIsLoggedIn} />} />
                                <Route path="admin" element={<AdminDashboard />} /> {/* Admin route */}

                            </Route>


                        </Routes>




                    </Suspense>



                </Router>


            </ThemeProvider>


        </QueryClientProvider>


    );



}
function Home() { // Separated Home component for clarity
    const [query, setQuery] = useState('');
    const [dbResults, setDbResults] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Add loading state


    const { data, isLoading: reactQueryIsLoading, error: reactQueryError } = useQuery({ // Use useQuery
        queryKey: ['dbData', query], // Query key with dependency on 'query'
        queryFn: () => executeQuery(query), // executeQuery function will be called with user's query
        enabled: !!query, // Only enable the query if there is user input 
    })



    const handleQuerySubmit = async (newQuery) => {
        setQuery(newQuery); // Update with the new query. This will re-trigger the useQuery
    };


    useEffect(() => {
        if(data) { // Use data from useQuery
            setDbResults(data);
            setIsLoading(false)
        } else if (reactQueryError) {
            setError(reactQueryError.message)
            setIsLoading(false)

        }
    }, [data, reactQueryError])


    // The rest of the Home component JSX remains the same

    return (
        <div className="App">
            <QueryInput onQuerySubmit={handleQuerySubmit} /> {/* Pass the submit handler */}

            {isLoading && <CircularProgress />} {/* Display loading indicator */}
            {error && <Alert severity="error">{error}</Alert>}
            <DbResponse results={dbResults} />
        </div>
    );
}


async function executeQuery(query) {
    try {
        const response = await api.post('/db_interact', { query });
        if (!response.ok) {
            const errorData = await response.json(); // Attempt to get error details
            const errorMessage = errorData?.error || response.statusText;
            throw new Error(errorMessage); //Throw a more specific error if available

        }


        return await response.json(); // Parse as JSON after status check
    } catch (error) {
        console.error("API Error:", error); // Keep this console log for API debugging

        throw error; //Re-throw to be handled by react-query


    }
}





function Layout() {
    return (
        <div style={{ padding: '20px' }}>
            <Outlet /> {/* Content of child routes goes here */}

        </div>


    );

}



export default App;
