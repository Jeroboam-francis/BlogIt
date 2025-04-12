import { NavLink } from "react-router-dom";
import Logo from "../Logo/Logo";
import "./Navigation.css"; 

function Navigation() {
  return (
    <header className="navigation-header">
      <Logo />
      <nav className="navigation-links">
        <NavigationLink to="/" label="Home" />
        <NavigationLink to="/signup" label="SignUp" />
        <NavigationLink to="/login" label="LogIn" />
      </nav>
    </header>
  );
}

function NavigationLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? "nav-link active" : "nav-link"
      }
    >
      {label}
    </NavLink>
  );
}

export default Navigation;
