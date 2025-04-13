import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          py: 8 
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
              fontSize: { xs: "6rem", md: "10rem" }, 
              fontWeight: 700, 
              color: "primary.main" 
            }}
          >
            404
          </Typography>
          
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              mb: 3, 
              fontWeight: 600 
            }}
          >
            Page Not Found
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 4, 
              maxWidth: "500px", 
              mx: "auto" 
            }}
          >
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </Typography>
          
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate("/")}
            sx={{ 
              px: 4, 
              py: 1.5, 
              borderRadius: 2 
            }}
          >
            Back to Home
          </Button>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
}

export default NotFound;