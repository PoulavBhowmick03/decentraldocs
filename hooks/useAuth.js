"use client"
import { useState, useEffect, useCallback } from 'react';
import { isLoggedIn } from '../utils/auth';

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isLoggedIn());
  }, []);

  const login = useCallback(() => {
    setAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setAuthenticated(false);
  }, []);

  // Return an array for backwards compatibility
  const returnArray = [authenticated, setAuthenticated];
  
  // Attach additional properties to the array
  returnArray.authenticated = authenticated;
  returnArray.login = login;
  returnArray.logout = logout;

  return returnArray;
}