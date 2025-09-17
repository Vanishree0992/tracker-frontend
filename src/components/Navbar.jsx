import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-xl">To-Do App</Link>
      <div>
        {user ? (
          <>
            <span className="mr-4">{user.username}</span>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-700">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-green-500 px-3 py-1 rounded hover:bg-green-700 mr-2"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
