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

// Mock fetch function (to be replaced with actual API call later)
const fetchBlogs = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock data for now
  return [
    {
      id: 1,
      title: "Getting Started with React and Material UI",
      excerpt:
        "Learn how to build beautiful user interfaces with React and Material UI components...",
      featuredImage: "https://picsum.photos/seed/react/800/500",
      author: {
        username: "reactmaster",
        avatar: "https://picsum.photos/seed/author1/100/100",
      },
      updatedAt: "2025-04-05T14:48:00.000Z",
      category: "Web Development",
    },
    {
      id: 2,
      title: "The Future of Artificial Intelligence",
      excerpt:
        "Exploring the potential impacts of AI on society and what the future might hold for this revolutionary technology...",
      featuredImage: "https://picsum.photos/seed/ai/800/500",
      author: {
        username: "aienthusiast",
        avatar: null,
      },
      updatedAt: "2025-04-08T09:22:00.000Z",
      category: "Technology",
    },
    {
      id: 3,
      title: "Healthy Eating Habits for Busy Professionals",
      excerpt:
        "Discover practical tips for maintaining a balanced diet despite your hectic schedule...",
      featuredImage: "https://picsum.photos/seed/food/800/500",
      author: {
        username: "healthguru",
        avatar: "https://picsum.photos/seed/author3/100/100",
      },
      updatedAt: "2025-04-10T16:30:00.000Z",
      category: "Health & Wellness",
    },
    {
      id: 4,
      title: "Mastering JavaScript Promises",
      excerpt:
        "A comprehensive guide to understanding and effectively using Promises in JavaScript...",
      featuredImage: "https://picsum.photos/seed/javascript/800/500",
      author: {
        username: "jsdev",
        avatar: "https://picsum.photos/seed/author4/100/100",
      },
      updatedAt: "2025-04-11T11:15:00.000Z",
      category: "Programming",
    },
    {
      id: 5,
      title: "Sustainable Living: Small Changes, Big Impact",
      excerpt:
        "Learn how making small adjustments to your daily habits can contribute to a more sustainable planet...",
      featuredImage: "https://picsum.photos/seed/eco/800/500",
      author: {
        username: "ecowarrior",
        avatar: null,
      },
      updatedAt: "2025-04-12T08:45:00.000Z",
      category: "Lifestyle",
    },
    {
      id: 6,
      title: "Financial Freedom: A Step-by-Step Guide",
      excerpt:
        "Practical strategies to help you achieve financial independence and secure your future...",
      featuredImage: "https://picsum.photos/seed/finance/800/500",
      author: {
        username: "moneymentor",
        avatar: "https://picsum.photos/seed/author6/100/100",
      },
      updatedAt: "2025-04-09T14:20:00.000Z",
      category: "Finance",
    },
  ];
};

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
  const { data: blogs, isLoading, error } = useQuery("blogs", fetchBlogs);

  // Get unique categories for filter chips
  const categories = blogs
    ? ["all", ...new Set(blogs.map((blog) => blog.category))]
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

          {/* Loading state */}
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 6 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error state */}
          {error && (
            <Box sx={{ textAlign: "center", my: 6 }}>
              <Typography color="error">
                Failed to load blog posts. Please try again later.
              </Typography>
            </Box>
          )}

          {/* Blog list */}
          {blogs && (
            <Grid container spacing={4}>
              {blogs
                .filter((blog) => filter === "all" || blog.category === filter)
                .map((blog) => (
                  <Grid item xs={12} md={6} lg={4} key={blog.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: 6,
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => handleBlogClick(blog.id)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={blog.featuredImage}
                        alt={blog.title}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Chip
                            label={blog.category}
                            size="small"
                            sx={{ fontSize: "0.75rem" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(blog.updatedAt)}
                          </Typography>
                        </Box>

                        <Typography
                          variant="h6"
                          component="h2"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            lineHeight: 1.2,
                            mb: 1,
                          }}
                        >
                          {blog.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                          sx={{ mb: 2 }}
                        >
                          {blog.excerpt}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: "auto",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {blog.author.avatar ? (
                              <Avatar
                                src={blog.author.avatar}
                                alt={blog.author.username}
                                sx={{ width: 32, height: 32 }}
                              />
                            ) : (
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: "primary.main",
                                }}
                              >
                                {getInitials(blog.author.username)}
                              </Avatar>
                            )}
                            <Typography
                              variant="body2"
                              sx={{ ml: 1, fontWeight: 500 }}
                            >
                              {blog.author.username}
                            </Typography>
                          </Box>

                          <Button
                            size="small"
                            color="primary"
                            sx={{
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            Read More
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export default BlogListing;
