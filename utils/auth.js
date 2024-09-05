import jwt from 'jsonwebtoken';

export function isLoggedIn() {
  // Get the token from cookies or local storage
  const token = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : null;

  if (!token) {
    return false;
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return !!decoded; // Return true if token is valid
  } catch (error) {
    return false; // Return false if token is invalid or expired
  }
}
