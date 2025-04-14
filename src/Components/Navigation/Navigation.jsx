import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../Logo/Logo";
import "./Navigation.css";

function Navigation() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Get user data from localStorage

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <header className="navigation-header">
      <Logo />
      <nav className="navigation-links">
        <NavigationLink to="/" label="Home" />
        {!user ? (
          <>
            <NavigationLink to="/signup" label="SignUp" />
            <NavigationLink to="/login" label="LogIn" />
          </>
        ) : (
          <>
            <button
              className="nav-button"
              onClick={() => navigate("/blogs/create")}
            >
              Write
            </button>
            <button
              className="nav-button"
              onClick={() => navigate("/my-blogs")}
            >
              My Blogs
            </button>
            <button
              className="nav-button"
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              My Profile
            </button>
            <button className="nav-button" onClick={handleLogout}>
              Log Out
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

function NavigationLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
    >
      {label}
    </NavLink>
  );
}

export default Navigation;
