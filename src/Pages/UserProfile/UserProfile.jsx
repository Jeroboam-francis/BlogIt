import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Tabs,
  Tab,
  TextField,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
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
const getInitials = (firstName = "", lastName = "") => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    avatar: "",
  });
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user from localStorage
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    }
  }, []);

  // Check if viewing own profile
  const isOwnProfile = currentUser && currentUser.id === parseInt(id);

  // // Fetch user profile data
  // Fetch user profile data
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery(["userProfile", id], () => blogApi.getUserProfile(id));
  // } = useQuery(["userProfile", id], () => blogApi.get(`/users/${id}`));

  const updateProfileMutation = useMutation(
    (data) => blogApi.put(`/users/${id}`, data),
    {
      onSuccess: (data) => {
        setIsEditMode(false);
        queryClient.setQueryData(["userProfile", id], (oldData) => ({
          ...oldData,
          ...data,
        }));

        if (isOwnProfile) {
          const updatedUser = {
            ...currentUser,
            firstName: data.firstName,
            lastName: data.lastName,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
        }
      },
    }
  );
  // const {
  //   data: profile,
  //   isLoading,
  //   error,
  //   refetch,
  // } = useQuery(["userProfile", id], () => {
  //   // Call your API to get user profile
  //   // For now, returning mock data
  //   return {
  //     id: parseInt(id),
  //     username: "johndoe",
  //     firstName: "John",
  //     lastName: "Doe",
  //     avatar: null,
  //     bio: "Web developer and tech enthusiast. I write about JavaScript, React, and web development.",
  //     createdAt: "2023-01-15T12:00:00Z",
  //     blogsCount: 12,
  //     recentBlogs: [
  //       {
  //         id: 1,
  //         title: "Getting Started with React Hooks",
  //         excerpt: "Learn how to use React Hooks to simplify your components.",
  //         featuredImage: "/placeholder-blog.jpg",
  //         category: "Technology",
  //         createdAt: "2023-10-15T12:00:00Z",
  //         commentsCount: 5,
  //         likesCount: 12,
  //       },
  //       {
  //         id: 2,
  //         title: "Building a RESTful API with Node.js",
  //         excerpt:
  //           "A comprehensive guide to creating RESTful APIs using Node.js and Express.",
  //         featuredImage: "/placeholder-blog.jpg",
  //         category: "Technology",
  //         createdAt: "2023-09-22T12:00:00Z",
  //         commentsCount: 3,
  //         likesCount: 8,
  //       },
  //     ],
  //   };
  // });

  // // Update profile mutation
  // const updateProfileMutation = useMutation(
  //   (data) => {
  //     // Call my API to update profile
  //     // For now, just returning the data
  //     return Promise.resolve(data);
  //   },
  //   {
  //     onSuccess: (data) => {
  //       setIsEditMode(false);
  //       queryClient.setQueryData(["userProfile", id], (oldData) => ({
  //         ...oldData,
  //         ...data,
  //       }));

  //       // Update local storage if it's the current user
  //       if (isOwnProfile) {
  //         const updatedUser = {
  //           ...currentUser,
  //           firstName: data.firstName,
  //           lastName: data.lastName,
  //         };
  //         localStorage.setItem("user", JSON.stringify(updatedUser));
  //         setCurrentUser(updatedUser);
  //       }
  //     },
  //   }
  // );

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle edit profile button click
  const handleEditClick = () => {
    setFormData({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      bio: profile.bio || "",
      avatar: profile.avatar || "",
    });
    setIsEditMode(true);
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  // Handle view blog click
  const handleBlogClick = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#f9f9f9", py: 4 }}>
        <Container maxWidth="lg">
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ my: 4 }}>
              Error loading profile. Please try again later.
            </Alert>
          ) : profile ? (
            <>
              {/* Profile header */}
              <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { xs: "center", md: "flex-start" },
                    gap: 4,
                  }}
                >
                  {!isEditMode ? (
                    <>
                      <Avatar
                        src={profile.avatar}
                        alt={profile.username}
                        sx={{
                          width: 120,
                          height: 120,
                          fontSize: "3rem",
                          bgcolor: "primary.main",
                        }}
                      >
                        {getInitials(profile.firstName, profile.lastName)}
                      </Avatar>

                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {profile.firstName} {profile.lastName}
                          </Typography>

                          {isOwnProfile && (
                            <Button
                              startIcon={<EditIcon />}
                              onClick={handleEditClick}
                              variant="outlined"
                              size="small"
                            >
                              Edit Profile
                            </Button>
                          )}
                        </Box>

                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          @{profile.username}
                        </Typography>

                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {profile.bio || "This user hasn't added a bio yet."}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Member since {formatDate(profile.createdAt)}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            gap: 3,
                            mt: 2,
                          }}
                        >
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {profile.blogsCount}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Blogs
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Box
                      component="form"
                      onSubmit={handleSubmit}
                      sx={{ width: "100%" }}
                    >
                      <Typography variant="h5" sx={{ mb: 3 }}>
                        Edit Profile
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Avatar URL"
                            name="avatar"
                            value={formData.avatar}
                            onChange={handleChange}
                            margin="normal"
                            helperText="Enter the URL of your profile picture"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            margin="normal"
                            multiline
                            rows={4}
                            helperText="Tell others about yourself"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 2,
                              mt: 2,
                            }}
                          >
                            <Button
                              variant="outlined"
                              onClick={() => setIsEditMode(false)}
                              disabled={updateProfileMutation.isLoading}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              variant="contained"
                              disabled={updateProfileMutation.isLoading}
                              startIcon={
                                updateProfileMutation.isLoading ? (
                                  <CircularProgress size={20} />
                                ) : null
                              }
                            >
                              Save Changes
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              </Paper>

              {/* Tabs */}
              {!isEditMode && (
                <>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      aria-label="profile tabs"
                    >
                      <Tab label="Blogs" id="profile-tab-0" />
                      {isOwnProfile && (
                        <Tab label="Drafts" id="profile-tab-1" />
                      )}
                    </Tabs>
                  </Box>

                  {/* Blogs tab */}
                  <TabPanel value={tabValue} index={0}>
                    {profile.recentBlogs?.length > 0 ? (
                      <Grid container spacing={4}>
                        {profile.recentBlogs.map((blog) => (
                          <Grid item xs={12} md={6} lg={4} key={blog.id}>
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
                                height="160"
                                image={
                                  blog.featuredImage || "/placeholder-blog.jpg"
                                }
                                alt={blog.title}
                              />

                              <CardContent sx={{ flexGrow: 1 }}>
                                {blog.category && (
                                  <Chip
                                    label={blog.category}
                                    size="small"
                                    sx={{ mb: 1 }}
                                  />
                                )}

                                <Typography
                                  gutterBottom
                                  variant="h6"
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
                                    justifyContent: "space-between",
                                    mt: "auto",
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {formatDate(blog.createdAt)}
                                  </Typography>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 2,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {blog.commentsCount} comments
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {blog.likesCount} likes
                                    </Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Box
                        sx={{
                          textAlign: "center",
                          py: 6,
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          No blogs published yet
                        </Typography>
                        {isOwnProfile && (
                          <Button
                            variant="contained"
                            onClick={() => navigate("/blogs/create")}
                          >
                            Create Your First Blog
                          </Button>
                        )}
                      </Box>
                    )}
                  </TabPanel>

                  {/* Drafts tab (only for own profile) */}
                  {isOwnProfile && (
                    <TabPanel value={tabValue} index={1}>
                      <Box
                        sx={{
                          textAlign: "center",
                          py: 6,
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          No drafts available
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={() => navigate("/blogs/create")}
                        >
                          Start a New Draft
                        </Button>
                      </Box>
                    </TabPanel>
                  )}
                </>
              )}
            </>
          ) : (
            <Alert severity="warning" sx={{ my: 4 }}>
              User not found.
            </Alert>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export default UserProfile;
