import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  /* 
  register: Function from AuthContext that sends registration data to the backend.
  navigate: Used to redirect the user after successful registration.
  */
  
  const [formData, setFormData] = useState({ 
    username: "", email: "", password: "", password2: "" 
  });
  const [error, setError] = useState("");
  /* 
  formData: Stores user input for username, email, password, and confirm password.
  error: Stores any error messages to display.
  */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  /* 
  Updates the appropriate property in formData when an input changes.
  Uses computed property names [e.target.name] to dynamically set the field.
  */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(formData.username, formData.email, formData.password, formData.password2);
      navigate("/login"); // Redirect to login after successful registration
    } catch (err) {
      setError(err.response?.data?.password || err.response?.data?.non_field_errors || "Registration failed");
    }
  };
  /* 
  Prevents the default form submission behavior.
  Resets the error state.
  Calls register with the form data.
  On success, navigates to the login page.
  On error, extracts and sets error messages from the backend response.
  */

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          value={formData.password2}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
