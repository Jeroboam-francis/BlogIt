import { NavLink } from "react-router-dom";
import { AppBar, Toolbar, List, ListItem, styled } from "@mui/material";
import Logo from "../Logo/Logo";

function Navigation() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Logo />
        <List component="nav" sx={{ display: "flex", marginLeft: "auto" }}>
          <NavigationLink to="/" label="Home" />
          <NavigationLink to="/signup" label="SignUp" />
          <NavigationLink to="/login" label="LogIn" />
        </List>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.common.white,
  padding: theme.spacing(3, 8),
  borderRadius: theme.shape.borderRadius,
  "&.active": {
    backgroundColor: theme.palette.action.selected,
    fontWeight: theme.typography.fontWeightBold,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function NavigationLink({ to, label }) {
  return (
    <ListItem disablePadding>
      <StyledNavLink to={to}>{label}</StyledNavLink>
    </ListItem>
  );
}
