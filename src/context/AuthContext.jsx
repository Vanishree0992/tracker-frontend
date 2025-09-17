import { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();
/* 
This is a React Context being created and exported so it can be used throughout your app to share authentication-related data (like user info, tokens, login status) without having to pass props through many layers of components.
*/

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) setUser({ username });
  }, []);

  const login = async (username, password) => {
    const { data } = await API.post("users/login/", { username, password });
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    localStorage.setItem("username", data.username);
    setUser({ username: data.username });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    setUser(null);
  };

  const register = async (username, email, password, password2) => {
    await API.post("users/register/", { username, email, password, password2 });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
/*
<AuthContext.Provider value={{ user, login, logout, register }}>

This is a React Context Provider component.
It wraps around all the child components that need access to authentication data and functions.
value={{ user, login, logout, register }}:

The value prop defines what data and functions are accessible to the components that consume this context.

Here, you are providing:
user: The current logged-in user's data.
login: The function to log the user in.
logout: The function to log the user out.
register: The function to register a new user.

This means any component wrapped inside AuthProvider can access these through useContext(AuthContext).

{children}

{children} represents whatever components or elements are nested inside AuthProvider in your component tree.

For example:

<AuthProvider>
  <App />
</AuthProvider>


Here, <App /> is the children. So, App and all its descendants can access the AuthContext.
*/