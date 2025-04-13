import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { useQuery } from "react-query";
import { blogApi } from "../../services/api";

// Helper function to format dates
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Get author initials for avatar fallback
const getInitials = (username) => {
  if (!username) return "U";
  return username.charAt(0).toUpperCase();
};

function BlogListing() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  // Check if user is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch blogs with React Query
  const {
    data: blogs,
    isLoading,
    error,
  } = useQuery(["blogs", filter], () =>
    blogApi.getBlogs(filter !== "all" ? { category: filter } : {})
  );

  // Get unique categories for filter chips
  const categories = blogs
    ? ["all", ...new Set(blogs.map((blog) => blog.category).filter(Boolean))]
    : ["all"];

  // Handle blog click
  const handleBlogClick = (id) => {
    navigate(`/blogs/${id}`);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#f9f9f9", py: 4 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              textAlign: "center",
            }}
          >
            Discover Stories That Matter
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 4,
              textAlign: "center",
              maxWidth: "700px",
              mx: "auto",
            }}
          >
            Explore thought-provoking articles from writers around the world.
            Find insights, inspiration, and ideas to fuel your curiosity.
          </Typography>

          {/* Category filters */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mb: 4,
              justifyContent: "center",
            }}
          >
            {categories.map((category) => (
              <Chip
                key={category}
                label={category === "all" ? "All Categories" : category}
                clickable
                color={filter === category ? "primary" : "default"}
                onClick={() => setFilter(category)}
                sx={{
                  textTransform: category === "all" ? "capitalize" : "none",
                  fontWeight: filter === category ? 600 : 400,
                }}
              />
            ))}
          </Box>

          {/* Blog cards */}
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">
              Error loading blogs. Please try again later.
            </Typography>
          ) : blogs?.length === 0 ? (
            <Typography align="center" sx={{ my: 4 }}>
              No blogs found. Try a different category or check back later.
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {blogs?.map((blog) => (
                <Grid item xs={12} sm={6} md={4} key={blog.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 3,
                      },
                      cursor: "pointer",
                    }}
                    onClick={() => handleBlogClick(blog.id)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={blog.featuredImage || "/placeholder-blog.jpg"}
                      alt={blog.title}
                    />

                    <CardContent sx={{ flexGrow: 1 }}>
                      {blog.category && (
                        <Chip
                          label={blog.category}
                          size="small"
                          sx={{ mb: 2 }}
                        />
                      )}

                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{ fontWeight: 600 }}
                      >
                        {blog.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {blog.excerpt}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: "auto",
                        }}
                      >
                        <Avatar
                          src={blog.author?.avatar}
                          alt={blog.author?.username}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        >
                          {getInitials(blog.author?.username)}
                        </Avatar>

                        <Box>
                          <Typography variant="subtitle2">
                            {blog.author?.username}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            {formatDate(blog.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 6,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/blogs/create")}
              sx={{
                px: 4,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Write Your Story
            </Button>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export default BlogListing;
