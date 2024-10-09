export const isAuthenticated = () => {
    return localStorage.getItem('user') !== null;
  };
  
  export const logout = () => {
    localStorage.removeItem('user'); // Removes the user data from localStorage
  };