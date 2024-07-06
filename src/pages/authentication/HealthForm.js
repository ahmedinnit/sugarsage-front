import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Logo from './logo.png'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const theme = createTheme({
  palette: {
    primary: {
      main: '#6fa58e'
    }
  }
});

const HealthForm = () => {
  const [formValues, setFormValues] = useState({
    weight: '',
    height: '',
    hbA1cScore: '',
    activityLevel: '',
    diabetesType: ''
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate(); // Use the navigate function

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value, errorsObj = errors) => {
    let errorMsg = '';
    switch (name) {
      case 'weight':
        errorMsg = value < 45 || value > 150 ? 'Weight must be between 45 and 150 kg.' : '';
        break;
      case 'height':
        errorMsg = value < 1.5 || value > 2 ? 'Height must be between 1.5 and 2 meters.' : '';
        break;
      case 'hbA1cScore':
        errorMsg = value < 4.0 || value > 8.9 ? 'HbA1c score must be between 4.0% and 8.9%.' : '';
        break;
      case 'activityLevel':
        errorMsg = !['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extra Active'].includes(value)
          ? 'Please select a valid activity level.'
          : '';
        break;
      case 'diabetesType':
        errorMsg = !['Type-1', 'Type-2'].includes(value) ? 'Please select a valid diabetes type.' : '';
        break;
      default:
        errorMsg = '';
    }
    setErrors({ ...errorsObj, [name]: errorMsg });
  };

  const convertDateFormat = (dateStr) => {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[0]}/${parts[1]}`; // Rearrange to YYYY/MM/DD
    } else {
      throw new Error('Invalid date format');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let newErrors = {};
    let formIsValid = true;

    Object.keys(formValues).forEach((key) => {
      if (formValues[key] === '') {
        newErrors[key] = 'This field is required';
        formIsValid = false;
      } else {
        validateField(key, formValues[key], newErrors);
      }
    });

    setErrors(newErrors);

    if (formIsValid && Object.values(newErrors).every((error) => error === '')) {
      const fullData = {
        ...formValues,
        email: localStorage.getItem('email'),
        password: localStorage.getItem('password'),
        fname: localStorage.getItem('fname'),
        lname: localStorage.getItem('lname'),
        gender: localStorage.getItem('gender'),
        dob: localStorage.getItem('dob'),
        country: localStorage.getItem('country'),
        city: localStorage.getItem('city')
      };
      fullData.dob = convertDateFormat(fullData.dob);

      const formattedDataString = JSON.stringify(fullData, null, 2).replace(/,/g, ';');
      console.log(formattedDataString);

      try {
        const response = await axios.post('http://localhost:3001/api/auth/signup', fullData);
        console.log('Response from the server:', response.data);
        localStorage.clear();
        navigate('/login');
      } catch (error) {
        console.error('Error submitting the form:', error.response ? error.response.data : error.message);
      }
    } else {
      console.log('Errors in form', newErrors);
    }
  };

  useEffect(() => {
    if (
      !localStorage.getItem('email') ||
      !localStorage.getItem('password') ||
      !localStorage.getItem('fname') ||
      !localStorage.getItem('lname') ||
      !localStorage.getItem('gender') ||
      !localStorage.getItem('dob') ||
      !localStorage.getItem('country') ||
      !localStorage.getItem('city')
    ) {
      localStorage.clear();
      navigate('/signup');
    }
  }, [navigate]); // Dependency added for useEffect

  return (
    <ThemeProvider theme={theme}>
      <div className="flex h-screen">
        <div className="hidden sm:flex w-1/2 items-center justify-center" style={{ backgroundColor: '#6fa58e' }}>
          <img src={Logo} alt="Logo" className="h-70" />
        </div>
        <div className="w-full sm:w-1/2 flex flex-col items-center justify-center p-8">
          <Typography component="h4" variant="h4" className="mb-3 tracking-wide font-extrabold text-center" style={{ color: '#4c4c4c' }}>
            Enter Health Form
          </Typography>
          <Box component="form" sx={{ width: '100%', maxWidth: '400px' }} noValidate onSubmit={handleSubmit}>
            {Object.keys(formValues).map((key) =>
              key === 'diabetesType' || key === 'activityLevel' ? (
                <TextField
                  key={key}
                  select
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  required
                  label={`${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}`}
                  name={key}
                  value={formValues[key]}
                  onChange={handleInputChange}
                  error={!!errors[key]}
                  helperText={errors[key]}
                  sx={{ mb: 0.5, borderRadius: '10px' }}
                  InputProps={{
                    style: {
                      borderRadius: '10px'
                    }
                  }}
                >
                  {key === 'diabetesType'
                    ? ['Type-1', 'Type-2'].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))
                    : ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extra Active'].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                </TextField>
              ) : (
                <TextField
                  key={key}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  required
                  label={`${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} (${key === 'weight' ? 'kg' : key === 'height' ? 'm' : key === 'hbA1cScore' ? '%' : 'mg/dL'})`}
                  type="number"
                  name={key}
                  value={formValues[key]}
                  onChange={handleInputChange}
                  error={!!errors[key]}
                  helperText={errors[key]}
                  sx={{ mb: 0.5, borderRadius: '10px' }}
                  InputProps={{
                    style: {
                      borderRadius: '10px'
                    }
                  }}
                />
              )
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ borderRadius: '10px', bgcolor: '#70a68f', color: 'white', mt: 2 }}
            >
              Submit
            </Button>
          </Box>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default HealthForm;
