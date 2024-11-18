const apiUrl = '/api/db_interact';


export const executeQuery = async (query) => {
    try {
        const response = await fetch(apiUrl, {  // fetch API is built-in
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

        if (error.message === 'Failed to fetch') {
            // This indicates a network error (no internet, or backend is down)

            throw new Error('Network error: Could not reach the server. Please check your internet connection.'); // Throw a more specific error
        } else if (error.name === "SyntaxError") { // Check if it is Json parse error

            throw new Error("Invalid JSON response from server.  Check if backend is running correctly")
        }
        else {
            throw new Error(`An unexpected error occurred: ${error.message}`); // Throw a more specific error
        }



    }
};



// export default api; // Export the api instance for reuse in other parts of your application