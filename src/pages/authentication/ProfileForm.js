import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Logo from './logo.png';
import { countries, cities } from '../../utils/places'; // Adjust the path as necessary

const theme = createTheme({
  palette: {
    primary: {
      main: '#6fa58e'
    }
  }
});

const ProfileForm = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    gender: '',
    country: '',
    city: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    validateField(name, value);
  };

  const handleDateChange = (value) => {
    if (value && !isNaN(new Date(value))) {
      const formattedDate = format(new Date(value), 'dd/MM/yyyy');
      setFormValues({ ...formValues, dateOfBirth: formattedDate });
      validateField('dateOfBirth', formattedDate);
    } else {
      setFormValues({ ...formValues, dateOfBirth: '' });
      validateField('dateOfBirth', '');
    }
  };

  const validateField = (name, value) => {
    let errorMsg = '';
    if (name === 'firstName' || name === 'lastName') {
      if (!/^[A-Za-z\s]{1,30}$/.test(value)) {
        errorMsg = 'Name must contain only letters and be no more than 30 characters long.';
      }
    } else if (name === 'dateOfBirth') {
      // const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 100);
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() - 15);

      // Handling manual input and conversion from string to date if needed
      let enteredDate = value instanceof Date ? value : new Date(value);
      if (isNaN(enteredDate)) {
        errorMsg = 'Invalid date format.';
      } else if (enteredDate > maxDate || enteredDate < minDate) {
        errorMsg = 'You must be at least 15 years old and less than 100 years old.';
      }
    }
    setErrors({ ...errors, [name]: errorMsg });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Check all fields are filled
    const allFieldsFilled = Object.values(formValues).every((x) => x !== '' && x !== null);
    const noErrors = Object.values(errors).every((x) => x === '');

    if (allFieldsFilled && noErrors) {
      // console.log('Submitting form', formValues);
      localStorage.setItem('fname', formValues.firstName);
      localStorage.setItem('lname', formValues.lastName);
      localStorage.setItem('dob', formValues.dateOfBirth);
      localStorage.setItem('gender', formValues.gender);
      localStorage.setItem('country', formValues.country);
      localStorage.setItem('city', formValues.city);
      navigate('/signup/health/form'); // Navigate after submission
    } else {
      console.log('Errors in form', errors);
      // Update form errors for unfilled fields dynamically
      Object.keys(formValues).forEach((key) => {
        if (!formValues[key]) {
          setErrors((prev) => ({ ...prev, [key]: 'This field is required' }));
        }
      });
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('email') || !localStorage.getItem('password')) {
      localStorage.clear();
      navigate('/signup');
    }
    if (
      localStorage.getItem('fname') ||
      localStorage.getItem('lname') ||
      localStorage.getItem('gender') ||
      localStorage.getItem('dob') ||
      localStorage.getItem('country') ||
      localStorage.getItem('city')
    ) {
      localStorage.removeItem('fname');
      localStorage.removeItem('lname');
      localStorage.removeItem('gender');
      localStorage.removeItem('dob');
      localStorage.removeItem('country');
      localStorage.removeItem('city');
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="flex h-screen">
          <div className="hidden sm:flex w-1/2 items-center justify-center" style={{ backgroundColor: '#6fa58e' }}>
            <img src={Logo} alt="Logo" className="h-70" />
          </div>
          <div className="w-full sm:w-1/2 flex flex-col items-center justify-center p-8">
            <Typography component="h4" variant="h4" className="mb-2 tracking-wide font-extrabold text-center" style={{ color: '#4c4c4c' }}>
              Enter Profile Details
            </Typography>
            <Box component="form" sx={{ width: '100%', maxWidth: '400px' }} noValidate onSubmit={handleSubmit}>
              <TextField
                label="First Name"
                fullWidth
                variant="outlined"
                margin="normal"
                required
                name="firstName"
                value={formValues.firstName}
                onChange={handleInputChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                sx={{ mb: 0.5 }}
                InputProps={{
                  style: {
                    borderRadius: '10px'
                  }
                }}
              />
              <TextField
                label="Last Name"
                fullWidth
                variant="outlined"
                margin="normal"
                required
                name="lastName"
                value={formValues.lastName}
                onChange={handleInputChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                sx={{ mb: 0.5 }}
                InputProps={{
                  style: {
                    borderRadius: '10px'
                  }
                }}
              />
              <DatePicker
                label="Date of Birth"
                views={['year', 'month', 'day']}
                openTo="year"
                value={formValues.dateOfBirth}
                onChange={handleDateChange}
                sx={{ mb: 0.5 }}
                InputProps={{
                  style: {
                    borderRadius: '10px'
                  }
                }}
                maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 15))}
                minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 100))}
                renderInput={(params) => {
                  // Ensure the TextField displays the date in the correct format when a date is present
                  const valueToDisplay = formValues.dateOfBirth
                    ? isNaN(new Date(formValues.dateOfBirth))
                      ? ''
                      : format(new Date(formValues.dateOfBirth), 'dd/MM/yy')
                    : '';
                  return (
                    <TextField
                      {...params}
                      value={valueToDisplay}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      required
                      error={!!errors.dateOfBirth}
                      helperText={errors.dateOfBirth}
                    />
                  );
                }}
              />

              <TextField
                select
                label="Gender"
                fullWidth
                variant="outlined"
                margin="normal"
                required
                name="gender"
                value={formValues.gender}
                onChange={handleInputChange}
                error={!!errors.gender}
                helperText={errors.gender}
                sx={{ mb: 0.5 }}
                InputProps={{
                  style: {
                    borderRadius: '10px'
                  }
                }}
              >
                {['Male', 'Female'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Country"
                fullWidth
                variant="outlined"
                margin="normal"
                required
                name="country"
                value={formValues.country}
                onChange={handleInputChange}
                error={!!errors.country}
                helperText={errors.country}
                sx={{ mb: 0.5 }}
                InputProps={{
                  style: {
                    borderRadius: '10px'
                  }
                }}
              >
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.name}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="City"
                fullWidth
                variant="outlined"
                margin="normal"
                required
                name="city"
                value={formValues.city}
                onChange={handleInputChange}
                error={!!errors.city}
                helperText={errors.city}
                disabled={!formValues.country}
                sx={{ mb: 1 }}
                InputProps={{
                  style: {
                    borderRadius: '10px'
                  }
                }}
              >
                {formValues.country &&
                  cities[formValues.country]?.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
              </TextField>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2, bgcolor: '#70a68f', color: 'white', borderRadius: '10px' }}
              >
                Submit
              </Button>
            </Box>
          </div>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default ProfileForm;
