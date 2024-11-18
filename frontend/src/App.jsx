import React, { useState, useEffect } from 'react';
import './App.css';
import QueryInput from './components/QueryInput';
import DbResponse from './components/DbResponse';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress'; // For loading indication
import Alert from '@mui/material/Alert'; // For error display
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'; // For data fetching



const theme = createTheme();
const queryClient = new QueryClient(); // Initialize queryClient


function App() {
    return (
        <QueryClientProvider client={queryClient}> {/* Wrap with QueryClientProvider */}
            <Router>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Routes>
                        <Route path="/" element={<Home />} /> {/* Home route */}
                    </Routes>
                </ThemeProvider>
            </Router>
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
        const response = await fetch('/api/db_interact', { // fetch API is built-in
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }), // Send the query in the request body
        });

        if (!response.ok) {
            const errorData = await response.json() // Attempt to parse error details
            const errorMessage = errorData?.error || response.statusText
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error
    }
}


export default App;