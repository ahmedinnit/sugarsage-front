import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, CircularProgress, FormControl, Select, MenuItem } from '@mui/material';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Area,
  AreaChart
  // BarChart,
  // Bar
} from 'recharts';
import MainCard from 'components/MainCard';
import axios from 'axios';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const dummyWeightData = [
  { name: 'January', YourWeight: 100, IdealWeight: 65 },
  { name: 'February', YourWeight: 102, IdealWeight: 65 },
  { name: 'March', YourWeight: 104, IdealWeight: 65 },
  { name: 'April', YourWeight: 106, IdealWeight: 64 },
  { name: 'May', YourWeight: 108, IdealWeight: 64 },
  { name: 'June', YourWeight: 100, IdealWeight: 63 },
  { name: 'July', YourWeight: 95, IdealWeight: 63 },
  { name: 'August', YourWeight: 90, IdealWeight: 62 },
  { name: 'September', YourWeight: 61, IdealWeight: 80 },
  { name: 'October', YourWeight: 61, IdealWeight: 81 },
  { name: 'November', YourWeight: 60, IdealWeight: 85 },
  { name: 'December', YourWeight: 59, IdealWeight: 85 }
];


const dummyBloodSugarData = [];
for (let i = 1; i <= 12; i++) {
  for (let j = 1; j <= 30; j++) {
    const month = i.toString().padStart(2, '0');
    const day = j.toString().padStart(2, '0');
    const bloodSugar = Math.floor(Math.random() * (180 - 100 + 1) + 100);
    dummyBloodSugarData.push({
      date: `2023-${month}-${day}`,
      bloodSugar
    });
  }
}

const colors = ['#6ea393', '#92c2ad', '#7ad0b6'];

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledText = styled.text`
  animation: ${fadeIn} 0.5s ease-in-out;
  font-size: 0.9em;
  font-weight: bold;
  fill: #333;
`;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = 25 + innerRadius + (outerRadius - innerRadius);
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <StyledText x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${name}: ${(percent * 100).toFixed(2)}%`}
    </StyledText>
  );
};

export default function HealthTracker() {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [stepsCompletion, setStepsCompletion] = useState(0);
  const [year, setYear] = useState(2023);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealthData = async () => {
      const user_id = localStorage.getItem('id');
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}PP_BACKEND_URL}/api/user/healthtracker/${user_id}`,
          {},
          {
            headers: {
              Authorization: `${token}`
            }
          }
        );
        setUserData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data');
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  useEffect(() => {
    if (userData) {
      const completion = Math.min(100, (userData.consumed_calories / userData.total_calories) * 100);
      const stepsProgress = Math.min(100, (userData.steps_taken / userData.total_steps) * 100);
      setAnimatedValue(completion);
      setStepsCompletion(stepsProgress);
    }
  }, [userData]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const nutritionData = [
    {
      name: 'Fats',
      grams: parseFloat(userData.nutrition.fats.grams),
      calories: parseFloat(userData.nutrition.fats.calories),
      percentage: parseFloat(userData.nutrition.fats.percentage)
    },
    {
      name: 'Proteins',
      grams: parseFloat(userData.nutrition.proteins.grams),
      calories: parseFloat(userData.nutrition.proteins.calories),
      percentage: parseFloat(userData.nutrition.proteins.percentage)
    },
    {
      name: 'Carbs',
      grams: parseFloat(userData.nutrition.carbs.grams),
      calories: parseFloat(userData.nutrition.carbs.calories),
      percentage: parseFloat(userData.nutrition.carbs.percentage)
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Health Tracking
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <MainCard elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Calories Track
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress variant="determinate" value={100} size={200} thickness={3} sx={{ color: 'rgba(0, 0, 0, 0.1)' }} />
                <CircularProgress
                  variant="determinate"
                  value={animatedValue}
                  size={200}
                  thickness={3}
                  sx={{ position: 'absolute', color: '#6ea393' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="h3" component="div">
                    {`${Math.round(animatedValue)}%`}
                  </Typography>
                  <Typography variant="h6">{`${userData.consumed_calories}/${userData.total_calories} Cals`}</Typography>
                </Box>
              </Box>
            </ResponsiveContainer>
          </MainCard>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <MainCard elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Nutrition Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={nutritionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="calories"
                  nameKey="name"
                  label={renderCustomizedLabel}
                >
                  {nutritionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) =>
                    `${props.payload.grams.toFixed(2)}g, ${value.toFixed(0)} cal (${props.payload.percentage.toFixed(2)}%)`
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </MainCard>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <MainCard elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Steps
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress variant="determinate" value={100} size={200} thickness={3} sx={{ color: 'rgba(0, 0, 0, 0.1)' }} />
                <CircularProgress
                  variant="determinate"
                  value={stepsCompletion}
                  size={200}
                  thickness={3}
                  sx={{ position: 'absolute', color: '#6ea393' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="h3" component="div">
                    {`${Math.round(stepsCompletion)}%`}
                  </Typography>
                  <Typography variant="h6">{`${userData.steps_taken}/${userData.total_steps} Steps`}</Typography>
                </Box>
              </Box>
            </ResponsiveContainer>
          </MainCard>
        </Grid>

        <Grid item xs={12}>
          <MainCard elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Ideal Weight
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dummyWeightData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradYourWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradIdealWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" stackId="1" dataKey="YourWeight" stroke="#8884d8" fill="url(#gradYourWeight)" />
                <Area type="monotone" stackId="1" dataKey="IdealWeight" stroke="#82ca9d" fill="url(#gradIdealWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </MainCard>
        </Grid>

        <Grid item xs={12}>
          <MainCard elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 5 }} gutterBottom>
              Blood Sugar History
            </Typography>
            <Box sx={{ marginBottom: 2, textAlign: 'right' }}>
              <FormControl>
                <Select value={year} onChange={(e) => setYear(e.target.value)} inputProps={{ 'aria-label': 'Without label' }}>
                  {[2021, 2022, 2023].map((yr) => (
                    <MenuItem key={yr} value={yr}>
                      {yr}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={dummyBloodSugarData.filter((item) => new Date(item.date).getFullYear() === year)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip />
                <Line type="monotone" dataKey="bloodSugar" stroke="#82ca9d" fill="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </MainCard>
        </Grid>

        {/* <Grid item xs={12}>
          <MainCard elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 5 }} gutterBottom>
              Sleep Patterns
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dummySleepData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} /> 
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="25%" stopColor="#6ea393" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <Bar dataKey="Hours" fill="url(#colorUv)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </MainCard>
        </Grid> */}
      </Grid>
    </Box>
  );
}
