import React, { useState } from 'react';
import { executeQuery } from '../services/api';  // Import your API function

function QueryInput({ onResults }) { // Pass a callback to handle results
const [query, setQuery] = useState('');

const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
        const results = await executeQuery(query);
    onResults(results);  // Pass the results to the parent component
    } catch (error) {
        console.error("Error executing query:", error);
      // Handle error state/display in your component
    onResults({ error: "Error fetching results. Please check the console." }); // Example
    }
};

return (
    <form onSubmit={handleSubmit}>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit">Submit</button>
    </form>
    );
}

export default QueryInput;