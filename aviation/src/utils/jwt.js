import { jwtDecode } from 'jwt-decode';

// Secret key used in the backend
const JWT_SECRET = 'your-secret-key';

/**
 * Decodes a JWT token and returns its payload
 * @param {string} token - The JWT token to decode
 * @returns {Object} The decoded token payload
 */
export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Gets the current user's information from the stored JWT token
 * @returns {Object|null} User information or null if no valid token exists
 */
export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    email: decoded.email,
    userId: decoded.userId
  };
};

/**
 * Checks if the current JWT token is expired
 * @returns {boolean} True if token is expired or invalid, false otherwise
 */
export const isTokenExpired = () => {
  const token = localStorage.getItem('token');
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded) return true;

  // Check if token has expired
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}; 