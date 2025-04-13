import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Divider,
  Avatar,
  Chip,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Paper,
  Alert,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { useQuery, useMutation, useQueryClient } from "react-query";
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

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user from localStorage
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const userString = localStorage.getItem("user");
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    }
  }, [navigate]);

  // Fetch blog data
  const {
    data: blog,
    isLoading,
    error,
  } = useQuery(["blog", id], () => blogApi.getBlogById(id));

  // Like/unlike mutation
  const likeMutation = useMutation(() => blogApi.toggleLike(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["blog", id]);
    },
  });

  // Delete blog mutation
  const deleteMutation = useMutation(() => blogApi.deleteBlog(id), {
    onSuccess: () => {
      navigate("/blogs");
    },
  });

  // Check if current user is the author
  const isAuthor = currentUser && blog?.author?.id === currentUser.id;

  // Handle like button click
  const handleLikeClick = () => {
    if (!currentUser) return;
    likeMutation.mutate();
  };

  // Handle edit button click
  const handleEditClick = () => {
    navigate(`/blogs/edit/${id}`);
  };

  // Handle delete button click
  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      deleteMutation.mutate();
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "#f9f9f9", py: 4 }}
      >
        <Container maxWidth="md">
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ my: 4 }}>
              Error loading blog. Please try again later.
            </Alert>
          ) : blog ? (
            <>
              {/* Blog header */}
              <Box sx={{ mb: 4 }}>
                {blog.category && (
                  <Chip
                    label={blog.category}
                    color="primary"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                )}

                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                  }}
                >
                  {blog.title}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={blog.author?.avatar}
                    alt={blog.author?.username}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  >
                    {getInitials(blog.author?.username)}
                  </Avatar>

                  <Box>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {blog.author?.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Published on {formatDate(blog.createdAt)}
                    </Typography>
                  </Box>

                  {/* Author actions */}
                  {isAuthor && (
                    <Box sx={{ ml: "auto" }}>
                      <IconButton
                        color="primary"
                        onClick={handleEditClick}
                        disabled={deleteMutation.isLoading}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={handleDeleteClick}
                        disabled={deleteMutation.isLoading}
                      >
                        {deleteMutation.isLoading ? (
                          <CircularProgress size={24} />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Featured image */}
              {blog.featuredImage && (
                <Box
                  component="img"
                  src={blog.featuredImage}
                  alt={blog.title}
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "500px",
                    objectFit: "cover",
                    borderRadius: 2,
                    mb: 4,
                  }}
                />
              )}

              {/* Blog content */}
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  fontSize: "1.1rem",
                  mb: 4,
                  whiteSpace: "pre-wrap",
                }}
              >
                {blog.content}
              </Typography>

              {/* Like button */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  my: 4,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={
                    blog.hasLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />
                  }
                  onClick={handleLikeClick}
                  disabled={likeMutation.isLoading || !currentUser}
                  color={blog.hasLiked ? "error" : "primary"}
                  sx={{
                    borderRadius: 4,
                    px: 3,
                    py: 1,
                  }}
                >
                  {likeMutation.isLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <>
                      {blog.hasLiked ? "Liked" : "Like"} • {blog.likesCount || 0}
                    </>
                  )}
                </Button>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Author bio */}
              {blog.author?.bio && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: "#f5f5f5",
                    borderRadius: 2,
                    mb: 4,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Avatar
                      src={blog.author?.avatar}
                      alt={blog.author?.username}
                      sx={{ width: 48, height: 48, mr: 2 }}
                    >
                      {getInitials(blog.author?.username)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">About the author</Typography>
                      <Typography variant="body2" color="text.secondary">
                        @{blog.author?.username}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2">{blog.author?.bio}</Typography>
                </Paper>
              )}

              {/* Comments section */}
              <Box sx={{ mt: 6 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  Comments ({blog.comments?.length || 0})
                </Typography>

                {/* Comment input */}
                {currentUser && (
                  <Box sx={{ mb: 4 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Share your thoughts..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      disabled={!comment.trim()}
                      sx={{
                        borderRadius: 1,
                        textTransform: "none",
                      }}
                    >
                      Post Comment
                    </Button>
                  </Box>
                )}

                {/* Comments list */}
                {blog.comments?.length > 0 ? (
                  blog.comments.map((comment) => (
                    <Paper
                      key={comment.id}
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        bgcolor: "#f5f5f5",
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Avatar
                          src={comment.user?.avatar}
                          alt={comment.user?.username}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        >
                          {getInitials(comment.user?.username)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {comment.user?.username}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {formatDate(comment.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2">{comment.content}</Typography>
                    </Paper>
                  ))
                ) : (
                  <Typography color="text.secondary" sx={{ my: 2 }}>
                    No comments yet. Be the first to comment!
                  </Typography>
                )}
              </Box>
            </>
          ) : (
            <Alert severity="warning" sx={{ my: 4 }}>
              Blog not found.
            </Alert>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export default BlogDetails;