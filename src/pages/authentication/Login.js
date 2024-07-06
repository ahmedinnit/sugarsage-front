import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert, IconButton, InputAdornment } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from './logo.png'; // Ensure this path is correct

const theme = createTheme({
  palette: {
    primary: {
      main: '#6fa58e'
    }
  }
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[A-Za-z].*\d.*$/;
    if (!regex.test(email) || email.length < 15) {
      setEmailError('Email must start with a letter, contain at least one number, and be at least 15 characters long.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      return; // Stop the submission if the email is invalid
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        email,
        password
      });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('id', response.data.id);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('pp', response.data.pp);

        navigate(response.data.role === 'user' ? '/user' : '/admin');
        navigate('/admin');
      } else {
        setLoginError(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : 'Server error');
      setLoginError('Invalid Email or Password!');
    }
  };

  const handleLoginErrorClose = () => {
    setLoginError('');
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="flex h-screen">
        <div className="hidden sm:flex w-1/2 items-center justify-center" style={{ backgroundColor: '#6fa58e' }}>
          <img src={Logo} alt="SugarSage Logo" className="h-70" />
        </div>
        <div className="w-full sm:w-1/2 flex flex-col items-center justify-center p-8">
          <Typography component="h1" variant="h4" className="mb-12 tracking-wide font-extrabold text-center" style={{ color: '#4c4c4c' }}>
            Welcome to SugarSage!
          </Typography>
          <Box component="form" sx={{ width: '100%', maxWidth: '400px' }} noValidate onSubmit={handleSubmit}>
            {loginError && (
              <Alert
                severity="error"
                action={
                  <IconButton aria-label="close" color="inherit" size="small" onClick={handleLoginErrorClose}>
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {loginError}
              </Alert>
            )}
            <Typography variant="h6" className="mb-0.5 font-extrabold tracking-wide text-left" style={{ color: '#4c4c4c' }}>
              Log in
            </Typography>
            <Typography className="mb-3 text-xs tracking-wide text-left" style={{ color: 'gray' }}>
              Don&apos;t Have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="underline text-xs tracking-wide hover:cursor-pointer"
                style={{ color: '#6fa58e' }}
              >
                Register
              </button>
            </Typography>

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
              sx={{ mb: 2, borderRadius: '10px' }}
              InputProps={{ style: { borderRadius: '10px' } }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              sx={{ mb: 2 }}
              InputProps={{
                style: { borderRadius: '10px' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end" sx={{ mr: 0.5 }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                margin: (theme) => theme.spacing(3, 0, 2),
                bgcolor: '#70a68f',
                borderRadius: '10px',
                color: 'white',
                padding: '9px'
              }}
            >
              Login
            </Button>
          </Box>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default LoginPage;
