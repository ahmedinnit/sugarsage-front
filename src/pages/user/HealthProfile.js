import React, { useState, useEffect } from 'react';
import { Typography, Button, TextField, Box, MenuItem, CircularProgress, Autocomplete, Popover } from '@mui/material';
import MainCard from 'components/MainCard';
import axios from 'axios';

function Profile() {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    sugar_level: '',
    hbA1c: '',
    activity_level: '',
    diabetes_type: '',
    foodPreferences: {}
  });

  const [foodItems, setFoodItems] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [currentFood, setCurrentFood] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const admin_id = localStorage.getItem('id');

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/healthprofile/get/${admin_id}`,
          {},
          { headers: { Authorization: `${token}` } }
        );

        const { food_data, liked_foods } = response.data;
        const data = response.data.data[0];

        const foodPreferences = liked_foods.reduce((acc, item) => {
          acc[item.food_id] = item.reaction || null;
          return acc;
        }, {});

        setFormData({
          weight: data.weight || '',
          height: data.height || '',
          sugar_level: data.sugar_level || '',
          hbA1c: data.hbA1c || '',
          activity_level: data.activity_level || '',
          diabetes_type: data.diabetes_type || '',
          foodPreferences
        });

        const formattedFoodItems = food_data.map((item) => ({
          label: item.food_name,
          id: item.food_id
        }));
        setFoodItems(formattedFoodItems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching health profile:', error.response || error.message || error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePopoverOpen = (foodId) => {
    setCurrentFood(foodId);
    setPopoverOpen(true);
  };

  const handlePopoverClose = () => {
    setPopoverOpen(false);
  };

  const handleFoodPreferenceChange = (event) => {
    const score = event.target.value;
    setFormData((prev) => ({
      ...prev,
      foodPreferences: {
        ...prev.foodPreferences,
        [currentFood]: score
      }
    }));

    handlePopoverClose();
  };

  const handleAutocompleteChange = (event, newValue) => {
    const newFoodPreferences = newValue.reduce((acc, item) => {
      if (formData.foodPreferences[item.id]) {
        acc[item.id] = formData.foodPreferences[item.id];
      }
      return acc;
    }, {});

    setFormData((prev) => ({
      ...prev,
      foodPreferences: newFoodPreferences
    }));

    if (newValue.length > Object.keys(newFoodPreferences).length) {
      const addedItem = newValue.find((item) => !Object.prototype.hasOwnProperty.call(newFoodPreferences, item.id));
      handlePopoverOpen(addedItem.id);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'weight':
        if (value < 40 || value > 150) error = 'Weight must be between 40 and 150 kg.';
        break;
      case 'height':
        if (value < 1.5 || value > 2.0) error = 'Height must be between 1.5 and 2.0 meters.';
        break;
      case 'sugar_level':
        if (value < 70 || value > 200) error = 'Sugar levels must be between 70 and 200 mg/dL.';
        break;
      case 'hbA1c':
        if (value < 4.0 || value > 9.0) error = 'HbA1c Score must be between 4.0% and 9.0%.';
        break;
      case 'activity_level':
        if (!value) error = 'Activity level is required.';
        break;
      case 'diabetes_type':
        if (!value) error = 'Diabetes type is required.';
        break;
    }
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    return error === '';
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (validateField(name, value)) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const isValid = Object.keys(formData).every((key) => validateField(key, formData[key]));
    if (!isValid) {
      console.error('Form validation errors:', formErrors);
      return;
    }
    setUpdating(true);
    const admin_id = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/user/healthprofile/update/${admin_id}`, formData, {
        headers: { Authorization: `${token}` }
      });

      console.log('Health Profile Updated Successfully:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div className="mb-5 ml-1">
        <Typography variant="h4" component="h1" gutterBottom>
          Health Profile
        </Typography>
      </div>

      {loading ? (
        <CircularProgress />
      ) : (
        <MainCard>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
              Enter Latest Values
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Weight (KGs)"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleFormChange}
                error={!!formErrors.weight}
                helperText={formErrors.weight}
                sx={{ flex: '1 1 48%' }}
                inputProps={{ min: 40, max: 150, step: 0.1 }}
              />
              <TextField
                fullWidth
                label="Height (m)"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleFormChange}
                error={!!formErrors.height}
                helperText={formErrors.height}
                sx={{ flex: '1 1 48%' }}
                inputProps={{ min: 1.5, max: 2.0, step: 0.01 }}
              />
              <TextField
                fullWidth
                label="Sugar Levels (mg/dL)"
                name="sugar_level"
                type="number"
                value={formData.sugar_level}
                onChange={handleFormChange}
                error={!!formErrors.sugar_level}
                helperText={formErrors.sugar_level}
                sx={{ flex: '1 1 48%' }}
                inputProps={{ min: 70, max: 200, step: 0.1 }}
              />
              <TextField
                fullWidth
                label="HbA1c Score (%)"
                name="hbA1c"
                type="number"
                value={formData.hbA1c}
                onChange={handleFormChange}
                error={!!formErrors.hbA1c}
                helperText={formErrors.hbA1c}
                sx={{ flex: '1 1 48%' }}
                inputProps={{ min: 4.0, max: 9.0, step: 0.1 }}
              />
              <TextField
                fullWidth
                select
                label="Activity Level"
                name="activity_level"
                value={formData.activity_level}
                onChange={handleFormChange}
                error={!!formErrors.activity_level}
                helperText={formErrors.activity_level}
                sx={{ flex: '1 1 48%' }}
              >
                <MenuItem value="Sedentary">Sedentary</MenuItem>
                <MenuItem value="Lightly Active">Lightly Active</MenuItem>
                <MenuItem value="Moderately Active">Moderately Active</MenuItem>
                <MenuItem value="Very Active">Very Active</MenuItem>
                <MenuItem value="Extra Active">Extra Active</MenuItem>
              </TextField>
              <TextField
                fullWidth
                select
                label="Diabetes Type"
                name="diabetes_type"
                value={formData.diabetes_type}
                onChange={handleFormChange}
                error={!!formErrors.diabetes_type}
                helperText={formErrors.diabetes_type}
                sx={{ flex: '1 1 100%' }}
              >
                <MenuItem value="Type-1">Type-1</MenuItem>
                <MenuItem value="Type-2">Type-2</MenuItem>
              </TextField>
              <Autocomplete
                fullWidth
                multiple
                options={foodItems}
                getOptionLabel={(option) => option.label}
                value={foodItems.filter((item) => item.id in formData.foodPreferences)}
                onChange={handleAutocompleteChange}
                renderInput={(params) => <TextField {...params} label="Likes" placeholder="Add foods you like" />}
                sx={{ flex: '1 1 100%' }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>

            <Popover
              open={popoverOpen}
              anchorEl={popoverOpen ? document.body : null}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'center',
                horizontal: 'center'
              }}
              PaperProps={{
                style: {
                  padding: '20px',
                  width: '300px', // Adjust width as needed
                  height: '180px' // Adjust height as needed
                }
              }}
            >
              <Box p={4}>
                <Typography variant="h6">Rate your preference (1-5):</Typography>
                <TextField
                  fullWidth
                  select
                  label="Preference"
                  value={formData.foodPreferences[currentFood] || ''}
                  onChange={handleFoodPreferenceChange}
                >
                  {[1, 2, 3, 4, 5].map((score) => (
                    <MenuItem key={score} value={score}>
                      {score}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Popover>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={updating}
                sx={{ backgroundColor: '#6ea393', '&:hover': { backgroundColor: '#5b887a' } }}
              >
                {updating ? <CircularProgress size={24} color="inherit" /> : 'Save'}
              </Button>
            </Box>
          </Box>
        </MainCard>
      )}
    </>
  );
}

export default Profile;
