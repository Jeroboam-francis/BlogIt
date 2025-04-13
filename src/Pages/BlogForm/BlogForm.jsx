import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { useQuery, useMutation } from "react-query";
import { blogApi } from "../../services/api";

// Sample categories - in a real app, these might come from the backend
const CATEGORIES = [
  "Technology",
  "Travel",
  "Health",
  "Food",
  "Lifestyle",
  "Business",
  "Finance",
  "Education",
  "Entertainment",
  "Sports",
  "Science",
];

function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    category: "",
    published: false,
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // Check if user is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch blog data if in edit mode
  const {
    data: blog,
    isLoading: isLoadingBlog,
    error: fetchError,
  } = useQuery(
    ["blog", id],
    () => blogApi.getBlogById(id),
    {
      enabled: isEditMode,
      onSuccess: (data) => {
        if (data) {
          setFormData({
            title: data.title || "",
            excerpt: data.excerpt || "",
            content: data.content || "",
            featuredImage: data.featuredImage || "",
            category: data.category || "",
            published: data.published || false,
          });
        }
      },
    }
  );

  // Create blog mutation
  const createMutation = useMutation(blogApi.createBlog, {
    onSuccess: (data) => {
      navigate(`/blogs/${data.id}`);
    },
    onError: (error) => {
      setSubmitError(
        error.response?.data?.message ||
          "Failed to create blog. Please try again."
      );
    },
  });

  // Update blog mutation
  const updateMutation = useMutation(
    (data) => blogApi.updateBlog(id, data),
    {
      onSuccess: () => {
        navigate(`/blogs/${id}`);
      },
      onError: (error) => {
        setSubmitError(
          error.response?.data?.message ||
            "Failed to update blog. Please try again."
        );
      },
    }
  );

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for the field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required";
    } else if (formData.excerpt.length > 200) {
      newErrors.excerpt = "Excerpt should be less than 200 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitError("");

    if (isEditMode) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const isSubmitting = createMutation.isLoading || updateMutation.isLoading;

  // Content preview
  const renderContentPreview = () => {
    if (!formData.content) {
      return (
        <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
          Your content will appear here as you type...
        </Typography>
      );
    }

    return (
      <Typography
        sx={{
          whiteSpace: "pre-wrap",
          p: 2,
        }}
      >
        {formData.content}
      </Typography>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#f9f9f9", py: 4 }}>
        <Container maxWidth="md">
          {isEditMode && isLoadingBlog ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
              <CircularProgress />
            </Box>
          ) : fetchError ? (
            <Alert severity="error" sx={{ my: 4 }}>
              Error loading blog. Please try again later.
            </Alert>
          ) : (
            <>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: 700, mb: 4 }}
              >
                {isEditMode ? "Edit Your Blog" : "Create New Blog"}
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
                  id="title"
                  label="Blog Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  disabled={isSubmitting}
                  sx={{ mb: 3 }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="excerpt"
                  label="Excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  error={!!errors.excerpt}
                  helperText={
                    errors.excerpt ||
                    `${formData.excerpt.length}/200 characters`
                  }
                  disabled={isSubmitting}
                  multiline
                  rows={2}
                  sx={{ mb: 3 }}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  id="featuredImage"
                  label="Featured Image URL"
                  name="featuredImage"
                  value={formData.featuredImage}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  sx={{ mb: 3 }}
                  InputProps={{
                    endAdornment: formData.featuredImage && (
                      <InputAdornment position="end">
                        <Button
                          size="small"
                          onClick={() =>
                            window.open(formData.featuredImage, "_blank")
                          }
                        >
                          Preview
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  select
                  margin="normal"
                  fullWidth
                  id="category"
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  sx={{ mb: 3 }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="content"
                  label="Blog Content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  error={!!errors.content}
                  helperText={errors.content}
                  disabled={isSubmitting}
                  multiline
                  rows={10}
                  sx={{ mb: 3 }}
                />

                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                  Content Preview
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    minHeight: "200px",
                    mb: 4,
                    bgcolor: "#fff",
                  }}
                >
                  {renderContentPreview()}
                </Paper>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 4,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.published}
                        onChange={handleChange}
                        name="published"
                        disabled={isSubmitting}
                      />
                    }
                    label={
                      formData.published
                        ? "Publish immediately"
                        : "Save as draft"
                    }
                  />

                  <Box>
                    <Button
                      onClick={() => navigate(-1)}
                      disabled={isSubmitting}
                      sx={{ mr: 2 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      startIcon={
                        isSubmitting ? (
                          <CircularProgress size={20} />
                        ) : null
                      }
                    >
                      {isSubmitting
                        ? "Saving..."
                        : isEditMode
                        ? "Update Blog"
                        : "Create Blog"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export default BlogForm;