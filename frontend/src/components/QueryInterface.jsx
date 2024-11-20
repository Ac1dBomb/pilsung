import React, { useState, useEffect } from 'react';

function QueryInterface() {
    const [query, setQuery] = useState('');
    const [model, setModel] = useState('openai'); // Default model
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]); // Store query history



    useEffect(() => {
        // Load history from local storage on component mount
        const storedHistory = localStorage.getItem('queryHistory');
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    }, []); // Empty dependency array ensures this runs only once on mount



    useEffect(() => {
        // Save history to local storage whenever it changes
        localStorage.setItem('queryHistory', JSON.stringify(history));

    }, [history]);



    const handleSubmit = async () => {

        if (!query.trim()) {
            setError("Query cannot be empty.");
            return;
        }


        setLoading(true);

        setError(null);



        try {

            const response = await fetch('/api/query', {

                method: 'POST',

                headers: { 'Content-Type': 'application/json' },

                body: JSON.stringify({ query, model })
            });



            if (!response.ok) {
                const errorData = await response.json(); // Get error details from the backend
                throw new Error(errorData.error || 'Server error');
            }



            const data = await response.json();
            setResults(data);
            setHistory([...history, { query, model, results: data }]); // Add to history

        } catch (error) {
            console.error("Fetch error:", error);
            setError(error.message || "An error occurred during query processing.");
        } finally {
            setLoading(false);

        }
    };



    const handleHistoryClick = (pastQuery) => {

        setQuery(pastQuery.query);
        setModel(pastQuery.model);

    };




    const formatResults = (results) => {
        if (Array.isArray(results)) {  // Check if the results are an array (common for database queries)
            // If so, create a simple HTML table to display data
            if (results.length === 0) {
                return <p>No results found.</p>;
            }

            const headers = Object.keys(results[0]);

            return (
                <table>
                    <thead>
                        <tr>{headers.map(header => <th key={header}>{header}</th>)}</tr>
                    </thead>

                    <tbody>
                        {results.map((row, index) => (
                            <tr key={index}>
                                {headers.map(header => <td key={header}>{row[header]}</td>)}
                            </tr>
                        ))}

                    </tbody>
                </table>
            );
        } else if (typeof results === 'object' && results !== null) {
            return <pre>{JSON.stringify(results, null, 2)}</pre>; // Format JSON nicely
        } else {
            return <pre>{results}</pre>;
        }
    }[[1](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AZnLMfyPQYpUmz6nFayOBC4dKTXiKp_IcuqD8lW2Im3RUgSYpyOKShSgPfejxoBUwENarIMCnkDCN5dlmv8aOgDnvsI4OVaMspYeAez4e4x8ejq2MYaSg76HVExDLhLIMyBgyIAVjkhFqViuAOWs4mb8S8uMKxPmLXY9Rs4=)]





    return (

        <div>

            <textarea value={query} onChange={(e) => setQuery(e.target.value)} />

            <select value={model} onChange={(e) => setModel(e.target.value)}>
                <option value="openai">OpenAI</option>
                <option value="gemini">Gemini</option>
                <option value="ollama">Ollama</option>
                <option value="llama">Llama</option>
            </select>
            <button onClick={handleSubmit} disabled={loading}>Submit</button>



            {loading && <p>Loading...</p>}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="results-container">

                {results && formatResults(results)}
            </div>



            <div className="history-container">
                <h2>Query History</h2>
                <ul>
                    {history.map((item, index) => (
                        <li key={index} onClick={() => handleHistoryClick(item)}>
                            {item.query} ({item.model})
                        </li>
                    ))}

                </ul>

            </div>

        </div>
    );

}



export default QueryInterface;