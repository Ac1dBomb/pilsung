import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography, // For headings
    Alert,  // For error display
    Box,  // For layout and spacing
} from '@mui/material';[[1](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AZnLMfwUEKJlIpLuOLHGkvt7QyKfO064FM9wIoaumHpPlxeYwT0muIYx1Qz8jQm8EmBmy2Xe94FiDgEHF47GYnM69REI9nvSqXzr4-2xw1idew==)]


function DbResponse({ results }) {
    if (results?.error) { //Check if error exists in result object first.
        return (
            <Alert severity="error">
                <Typography variant='h6'>Error: {results.error}</Typography>
            </Alert>
        );
    }

    if (!results) {
        return (
            <Typography variant="body1">
                Enter a query and submit.
            </Typography>
        );
    }



    if (Array.isArray(results) && results.length > 0 && Array.isArray(results[0])) {
        // Data is an array of arrays (tabular data)
        const numColumns = results[0].length


        return (
            <Box mt={2}> {/* Add spacing at the top */}
                <Typography variant="h6" gutterBottom>
                    Query Results
                </Typography>

                <TableContainer component={Paper}> {/* Use MUI TableContainer */}
                    <Table>
                        <TableHead>
                            <TableRow>
                                {/*Create an header for column number*/}
                                {Array.from({length: numColumns}, (_, i) => <TableCell key={i}>{i+1}</TableCell>)}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {results.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <TableCell key={cellIndex}>{cell}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    } else if (Array.isArray(results)) { // Handle a simple array
        return (
            <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                    Query Results
                </Typography>
                <ul>
                    {results.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </Box>
        )
    }
    else if (typeof results === 'object') { // Handle object responses.
        return (
            <Box mt={2}> {/* Use Box for spacing and layout */}
                <Typography variant="h6" gutterBottom>
                    Query Results:
                </Typography>
                <pre>{JSON.stringify(results, null, 2)}</pre>
            </Box>
        )
    }
    // For other single values
    return (
        <Box mt={2}>
            <Typography variant="h6" gutterBottom>
                Query Result
            </Typography>
            <Typography variant="body1">
                {results}
            </Typography>
        </Box>
    )


}

export default DbResponse;