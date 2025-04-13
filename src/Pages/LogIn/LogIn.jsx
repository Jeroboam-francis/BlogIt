import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import Header from "../../Components/Header/Header";
import { authApi } from "../../services/api";
import { useQueryClient } from "react-query";

function LogIn() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [credentials, setCredentials] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!credentials.usernameOrEmail) {
      newErrors.usernameOrEmail = "Username or email is required";
    }
    if (!credentials.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Call authentication API
      const userData = await authApi.login(credentials);
      
      // Save auth data to localStorage
      localStorage.setItem("token", userData.token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName
      }));
      
      // Update React Query cache with user data
      queryClient.setQueryData('user', userData);

      // Redirect to blog listing page after successful login
      navigate("/blogs");
    } catch (error) {
      console.error("Login error:", error);
      setSubmitError(
        error.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <Header />
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box
          sx={{
            backgroundColor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              textAlign: "center",
              mb: 3,
            }}
          >
            Welcome back to BlogIT
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              textAlign: "center",
              mb: 4,
            }}
          >
            Sign in to access your account and start writing
          </Typography>

          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="usernameOrEmail"
              label="Username or Email"
              name="usernameOrEmail"
              autoComplete="username"
              value={credentials.usernameOrEmail}
              onChange={handleChange}
              error={!!errors.usernameOrEmail}
              helperText={errors.usernameOrEmail}
              disabled={isSubmitting}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 1,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>

            <Divider sx={{ my: 3 }}>or</Divider>

            <Typography variant="body2" color="text.secondary" align="center">
              You do not have an account?{" "}
              <Link
                to="/signup"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: 500,
                }}
              >
                Create Account
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default LogIn;