import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from './logo.png'; // Update this import to the correct path of your logo image
// import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6fa58e'
    }
  }
});

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const containsNumber = /[0-9]/.test(email);
    const isCorrectLength = email.length >= 15;
    if (!isCorrectLength) return 'Email should be 15 characters or longer';
    if (!containsNumber) return 'Email must contain at least one number';
    if (!regex.test(email)) return 'Invalid email format';
    return '';
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = '';

    if (name === 'email') {
      setEmail(value);
      error = validateEmail(value);
    } else if (name === 'password') {
      setPassword(value);
      if (!validatePassword(value)) {
        error = 'Password must be at least 8 characters, include a number and a capital letter.';
      }
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
      if (password !== value) {
        error = 'Passwords do not match.';
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password)
      ? ''
      : 'Password must be at least 8 characters, include a number and a capital letter.';
    const confirmPasswordError = password === confirmPassword ? '' : 'Passwords do not match.';

    if (!email || !password || emailError || passwordError || confirmPasswordError) {
      // Set errors
      setErrors({
        email: !email ? 'Email is required' : emailError,
        password: !password ? 'Password is required' : passwordError,
        confirmPassword: !confirmPassword ? 'Confirm Password is required' : confirmPasswordError
      });
      return; // Stop the form submission if there are errors
    }

    // try {
    //   const result = await axios.post('http://localhost:3001/api/auth/register', { email, password });
    //   console.log('Result: ', result);
    //   navigate('/login');
    // } catch (error) {
    //   console.error('Signup error:', error.response ? error.response.data : 'Server error');
    // }
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    navigate('/signup/profile/form');
  };

  useEffect(() => {
    if (localStorage.getItem('email') || localStorage.getItem('password')) localStorage.clear();
  });

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
            <Typography variant="h6" className="mb-0.5 font-extrabold tracking-wide text-left" style={{ color: '#4c4c4c' }}>
              Register
            </Typography>
            <Typography className="mb-3 text-xs tracking-wide text-left" style={{ color: 'gray' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="underline text-xs tracking-wide hover:cursor-pointer"
                style={{ color: '#6fa58e' }}
              >
                Login
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
              value={email}
              onChange={handleInputChange}
              autoFocus
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 2, borderRadius: '200px' }}
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
              value={password}
              onChange={handleInputChange}
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                style: { borderRadius: '10px' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      sx={{ pr: 2 }}
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleInputChange}
              autoComplete="current-password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                style: { borderRadius: '10px' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      sx={{ pr: 2 }}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 5 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                bgcolor: '#70a68f',
                borderRadius: '10px',
                color: 'white',
                padding: '9px'
              }}
            >
              Continue
            </Button>
          </Box>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Signup;
