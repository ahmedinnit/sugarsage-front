import React, { useState } from 'react';
import { TextField, Typography, Button, Box, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MainCard from 'components/MainCard';
import axios from 'axios';
import feedbackTopics from 'utils/feedbackTopics';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6fa58e'
    }
  }
});

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    feedback_topic: '',
    feedback_type: '',
    feedback_title: '',
    description: ''
  });

  const [formErrors, setFormErrors] = useState({
    feedback_topic: '',
    feedback_type: '',
    feedback_title: '',
    description: ''
  });

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'feedback_title':
        if (value.length > 150) error = 'feedback_title must be at most 150 characters.';
        if (!value) error = 'feedback_title is required.';
        break;
      case 'description':
        if (value.length > 2000) error = 'Description must be at most 2000 characters.';
        if (!value) error = 'Description is required.';
        break;
      case 'feedback_topic':
        if (!value) error = 'Feedback Topic is required.';
        break;
      case 'feedback_type':
        if (!value) error = 'Feedback Type is required.';
        break;
      default:
        break;
    }
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    return error === '';
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
    setFormData({ ...formData, [name]: value });

    // Handle length validation and error setting
    if ((name === 'feedback_title' && value.length > 150) || (name === 'description' && value.length > 2000)) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} must be at most ${name === 'feedback_title' ? 150 : 2000} characters.`
      }));
    }
  };

  const handleSubmit = () => {
    let valid = true;
    Object.keys(formData).forEach((key) => {
      if (!validateField(key, formData[key])) {
        valid = false;
      }
    });

    if (valid) {
      const userId = localStorage.getItem('id');
      const token = localStorage.getItem('token');

      axios
        .post(`http://localhost:3001/api/user/feedback/${userId}`, formData, {
          headers: {
            Authorization: `${token}`
          }
        })
        .then((response) => {
          console.log('Feedback submitted:', response.data);
          // Handle successful submission (e.g., show a success message or redirect)
        })
        .catch((error) => {
          console.error('Error submitting feedback:', error);
          // Handle submission error (e.g., show an error message)
        });
    } else {
      console.log('Validation errors:', formErrors);
    }
  };

  return (
    <>
      <Typography variant="h3" component="h1" sx={{ mb: 4 }}>
        Feedbacks
      </Typography>
      <MainCard sx={{ p: 3 }}>
        <ThemeProvider theme={theme}>
          <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
            Enter Feedback Details
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 4 }}>
            <TextField
              fullWidth
              label="Feedback Topic"
              variant="outlined"
              select
              name="feedback_topic"
              value={formData.feedback_topic}
              onChange={handleFormChange}
              error={!!formErrors.feedback_topic}
              helperText={formErrors.feedback_topic}
              sx={{ flex: 1, mr: 2 }}
            >
              {feedbackTopics.map((topic, index) => (
                <MenuItem key={index} value={topic}>
                  {topic}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Feedback Type"
              variant="outlined"
              select
              name="feedback_type"
              value={formData.feedback_type}
              onChange={handleFormChange}
              error={!!formErrors.feedback_type}
              helperText={formErrors.feedback_type}
              sx={{ flex: 1 }}
            >
              <MenuItem value="Positive">Positive</MenuItem>
              <MenuItem value="Negative">Negative</MenuItem>
              <MenuItem value="Neutral">Neutral</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 4 }}>
            <TextField
              fullWidth
              label="Feedback Title"
              name="feedback_title"
              value={formData.feedback_title}
              onChange={handleFormChange}
              error={!!formErrors.feedback_title}
              helperText={formErrors.feedback_title}
              inputProps={{ maxLength: 150 }}
              sx={{ flex: 1 }}
            />
          </Box>
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={12}
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            error={!!formErrors.description}
            helperText={formErrors.description}
            inputProps={{ maxLength: 2000 }}
            sx={{ mb: 2 }}
          />
        </ThemeProvider>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: '#6ea393', '&:hover': { backgroundColor: '#5d8c7f' } }}>
            Upload
          </Button>
        </Box>
      </MainCard>
    </>
  );
};

export default FeedbackForm;
