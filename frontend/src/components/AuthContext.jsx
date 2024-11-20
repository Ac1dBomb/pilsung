// AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

const getTokenFromStorage = () => {
    try {
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
            const decodedToken = jwt_decode(storedToken);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
                // Token expired
                localStorage.removeItem('token');
                return null;
            }
            return storedToken;
        }
        return null;
    } catch (error) {
        console.error("Error decoding/retrieving token:", error);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(getTokenFromStorage());  // Initialize token
    const [authError, setAuthError] = useState(null); // State for error messages

    const fetchUserData = useCallback(async () => { // useCallback for optimization
        if (token) {
            try {
                const response = await fetch('/api/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = errorData.message || 'Could not fetch user data';
                    setAuthError(errorMessage) //set error message if not ok
                    throw new Error(errorMessage);

                }


                const userData = await response.json();
                setUser(userData);
                setAuthError(null); // Clear any previous error

            } catch (error) {
                console.error('Failed to fetch user data:', error);

                setToken(null); //Log out user on critical error so they are not left in invalid auth state
                localStorage.removeItem('token')
                setUser(null)
            }

        } else {
            setUser(null);
            setAuthError(null); // Clear error if no token

        }
    }, [token]);


    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]); // Use the useCallback result



    const login = (token, userData) => {
        setToken(token);
        localStorage.setItem('token', token);
        setUser(userData);
        setAuthError(null); // Clear any login error on success
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        setUser(null);
        setAuthError(null); // Clear errors on logout

    };

    const contextValue = {
        user,
        token,
        login,
        logout,
        isLoggedIn: !!token,
        authError // Include the authError state
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;