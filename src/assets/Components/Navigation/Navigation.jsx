import { NavLink } from "react-router-dom";
import { AppBar, Toolbar, List, ListItem, styled } from "@mui/material";

function Navigation() {
  return (
    <AppBar position="static">
      <Toolbar>
        <List component="nav" sx={{ display: "flex" }}>
          <NavigationLink to="/" label="Home" />
          <NavigationLink to="/login" label="Log In" />
          <NavigationLink to="/signup" label="Sign Up" />
        </List>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.common.white,
  padding: theme.spacing(1, 2),
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
