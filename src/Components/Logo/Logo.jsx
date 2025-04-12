import { FaBook } from "react-icons/fa6";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

function Logo() {
  return (
    <LogoContainer>
      <BookIcon />
      <LogoText variant="h6">BlogIT</LogoText>
    </LogoContainer>
  );
}

export default Logo;

// Styled components
const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1), 
  textDecoration: "none",
  color: "inherit",
  "&:hover": {
    opacity: 0.8,
  },
}));

const BookIcon = styled(FaBook)(({ theme }) => ({
  fontSize: theme.typography.h6.fontSize, 
 
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700, 
  letterSpacing: "0.5px", 
}));