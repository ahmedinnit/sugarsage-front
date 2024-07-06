import React, { useState } from 'react';
import {
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MainCard from 'components/MainCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MealPlan() {
  const [open, setOpen] = useState(false);
  const [FBS, setFBS] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (value < 72 || value > 130) {
      setError('Value must be between 72 and 130');
    } else {
      setError('');
    }
    setFBS(value);
  };

  const handleSubmit = () => {
    if (!FBS) {
      setError('Please enter your fasting blood sugar');
      return;
    }
    setLoading(true); // Start loading
    const user_id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    axios
      .post(
        `http://localhost:3001/api/user/mealplans/generate/${user_id}`,
        { FBS },
        {
          headers: {
            Authorization: `${token}`
          }
        }
      )
      .then((response) => {
        console.log('Meal plan generated:', response.data);
        setOpen(false);
        setLoading(false); // Stop loading
        navigate('/user/mealplan/choose', { state: { data: response.data } }); // Replace with your target route
      })
      .catch((error) => {
        console.error('Error generating meal plan:', error);
        setLoading(false); // Stop loading in case of error
      });
  };

  const MealPlanButton = ({ title, onClick }) => {
    return (
      <Card variant="outlined" sx={{ borderRadius: 4, mb: 5, minWidth: { xs: '100%', sm: 600 }, boxShadow: 3 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ color: '#6ea393' }} fontSize="large" />
            <Typography variant="h5" sx={{ ml: 2, fontWeight: 'bold' }}>
              {title}
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{
              borderRadius: 20,
              backgroundColor: '#6ea393',
              color: 'white',
              '&:hover': { backgroundColor: '#5d8c7f' },
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              px: 3,
              py: 1.5
            }}
            onClick={onClick}
          >
            View Now
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 4 } }}>
      <Typography variant="h3" component="h1" sx={{ mb: 4 }}>
        Meal Planning
      </Typography>

      <MainCard elevation={3} sx={{ p: { xs: 2, sm: 10 } }}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <MealPlanButton title="Generate Meal Plan" onClick={handleClickOpen} />
          </Grid>
          <Grid item xs={12}>
            <MealPlanButton title="View Meal Plan" />
          </Grid>
        </Grid>
      </MainCard>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { width: { xs: '100%', sm: '500px' }, maxWidth: '500px' } }}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <TextField
            label="Fasting Blood Sugar"
            type="number"
            value={FBS}
            onChange={handleInputChange}
            error={Boolean(error)}
            helperText={error}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#6ea393', color: 'white', '&:hover': { backgroundColor: '#5d8c7f' } }}
            onClick={handleSubmit}
            disabled={loading} // Disable the button when loading
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
