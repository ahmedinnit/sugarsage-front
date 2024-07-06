import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  TextField,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

const MealPlanDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || { data: { 'Top RecScore': {} } }; // Handle case where data might not be passed
  const { 'Top RecScore': topRecScore } = data.data || {
    'Top RecScore': { food_names: [], predictions: [], carbs: [], fats: [], Proteins: [], cal: [] }
  };

  const requiredBMR = parseFloat(localStorage.getItem('BMR')) || 0; // Assuming required BMR is stored in local storage
  const userId = localStorage.getItem('id');
  const [currentBMR, setCurrentBMR] = useState(0);
  const [mealTimes, setMealTimes] = useState(topRecScore.food_names.map(() => ''));
  const [portionSizes, setPortionSizes] = useState(topRecScore.food_names.map(() => '')); // Default to empty string
  const [totalPortionSize, setTotalPortionSize] = useState(0);
  const [error, setError] = useState('');
  const [submissionError, setSubmissionError] = useState('');

  const handleMealTimeChange = (index, event) => {
    const newMealTimes = [...mealTimes];
    newMealTimes[index] = event.target.value;
    setMealTimes(newMealTimes);
    updateCurrentBMR(newMealTimes, portionSizes);
  };

  const handlePortionSizeChange = (index, event) => {
    const newPortionSizes = [...portionSizes];
    const portionSize = parseFloat(event.target.value);
    newPortionSizes[index] = portionSize > 0 ? portionSize : 0; // Ensure positive portion size
    setPortionSizes(newPortionSizes);
    updateCurrentBMR(mealTimes, newPortionSizes);
  };

  const calculateTotalCalories = (mealTimes, portionSizes) => {
    let totalCalories = 0;
    mealTimes.forEach((mealTime, index) => {
      if (mealTime && portionSizes[index] > 0) {
        const portionSize = portionSizes[index];
        const caloriesPer100g = topRecScore.cal[index];
        totalCalories += (caloriesPer100g / 100) * portionSize;
      }
    });
    return totalCalories;
  };

  const updateCurrentBMR = (mealTimes, portionSizes) => {
    const totalCalories = calculateTotalCalories(mealTimes, portionSizes);
    if (totalCalories <= requiredBMR * 1.05) {
      setCurrentBMR(totalCalories);
      setError(''); // Clear any existing error
      updateTotalPortionSize(portionSizes);
    } else {
      setError('Current BMR exceeds 105% of the required BMR. Cannot add more meals.');
    }
  };

  const updateTotalPortionSize = (portionSizes) => {
    const total = portionSizes.reduce((acc, size) => acc + size, 0);
    setTotalPortionSize(total);
  };

  const handleConfirm = async () => {
    const mealDetails = topRecScore.food_names.map((food, index) => ({
      food_name: food,
      score: topRecScore.predictions[index],
      carbs: topRecScore.carbs[index],
      fats: topRecScore.fats[index],
      protein: topRecScore.Proteins[index],
      portion_size: portionSizes[index],
      meal_time: mealTimes[index],
      calories: (topRecScore.cal[index] / 100) * portionSizes[index]
    }));

    try {
      await axios.post(`http://localhost:3001/api/user/mealplans/store/${userId}`, { mealDetails });
      alert('Meal plan saved successfully!');
      navigate('/'); // Redirect to home or another page after saving
    } catch (error) {
      console.error('Error saving meal plan:', error);
      setSubmissionError(error.response?.data?.message || 'Failed to save meal plan.');
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const isBMRExceeded = currentBMR > requiredBMR * 1.05;

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 4 } }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        sx={{ mb: 4, p: 3, border: '1px solid #ddd', borderRadius: 4, boxShadow: 3, backgroundColor: '#fff' }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#6ea393' }}>
          BMR Information
        </Typography>
        <Typography variant="body1" sx={{ mb: 0.5 }}>
          Required BMR: <strong>{requiredBMR} kCal</strong>
        </Typography>
        <Typography variant="body1" sx={{ color: isBMRExceeded ? 'red' : 'inherit' }}>
          Current BMR: <strong>{currentBMR.toFixed(2)} kCal</strong>
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Total Portion Size: <strong>{totalPortionSize} g</strong>
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {submissionError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {submissionError}
          </Alert>
        )}
      </Box>
      <Typography variant="h3" component="h1" sx={{ mb: 4, textAlign: 'center', color: '#6ea393', fontWeight: 'bold' }}>
        Top Recommended Foods
      </Typography>
      <Grid container spacing={3}>
        {topRecScore.food_names.map((food, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div initial="hidden" animate="visible" variants={cardVariants} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <Card variant="outlined" sx={{ borderRadius: 4, boxShadow: 3, p: 2, backgroundColor: '#fff', borderColor: '#6ea393' }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', position: 'relative', pb: 1, mb: 2, color: '#6ea393' }}>
                    {food}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '3px',
                        backgroundColor: '#6ea393'
                      }}
                    />
                  </Typography>
                  <Typography sx={{ mb: 1, color: '#555' }}>Score: {topRecScore.predictions[index]}</Typography>
                  <Typography sx={{ mb: 1, color: '#555' }}>Carbs: {topRecScore.carbs[index]} g</Typography>
                  <Typography sx={{ mb: 1, color: '#555' }}>Fats: {topRecScore.fats[index]} g</Typography>
                  <Typography sx={{ mb: 1, color: '#555' }}>Proteins: {topRecScore.Proteins[index]} g</Typography>
                  <Typography sx={{ mb: 2, color: '#555' }}>Calories: {topRecScore.cal[index]} kCal</Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id={`meal-time-label-${index}`}>Meal Time</InputLabel>
                    <Select
                      labelId={`meal-time-label-${index}`}
                      id={`meal-time-select-${index}`}
                      value={mealTimes[index]}
                      label="Meal Time"
                      onChange={(event) => handleMealTimeChange(index, event)}
                      sx={{ textAlign: 'left' }}
                      disabled={isBMRExceeded}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="breakfast">Breakfast</MenuItem>
                      <MenuItem value="lunch">Lunch</MenuItem>
                      <MenuItem value="supper">Supper</MenuItem>
                      <MenuItem value="snack">Snack</MenuItem>
                      <MenuItem value="dinner">Dinner</MenuItem>
                    </Select>
                  </FormControl>
                  {mealTimes[index] && (
                    <TextField
                      label="Portion Size (g)"
                      type="number"
                      value={portionSizes[index]}
                      onChange={(event) => handlePortionSizeChange(index, event)}
                      inputProps={{ min: 1, max: 500 }} // Set realistic range for portion size
                      fullWidth
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button variant="contained" color="primary" onClick={handleConfirm} disabled={isBMRExceeded}>
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default MealPlanDisplay;
