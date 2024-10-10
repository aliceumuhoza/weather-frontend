// scenes/Login.js
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Grid } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify'; // For notifications
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Login = () => {
  const theme = useTheme(); // Use MUI theme for consistent styling
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/staffs/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      login(data); // Call login function from context
      toast.success('Login successful!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }); // Show success message
      navigate('/dashboard'); // Navigate to the dashboard or desired route
    } catch (error) {
      toast.error(error.message || 'An error occurred. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }); // Show error message
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh" 
      bgcolor={theme.palette.primary.main} // Set background to primary blue color
    >
      <Paper elevation={3} sx={{ padding: '40px', borderRadius: '8px', width: '400px' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: theme.palette.common.yellow }}>
          Login_to_Access
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                sx={{ padding: '10px', fontSize: '16px' }}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;