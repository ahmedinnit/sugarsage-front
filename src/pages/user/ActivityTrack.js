import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import MainCard from 'components/MainCard';

// Sample Data
const activityData = [
  { name: '00:00', Calories: 200 },
  { name: '06:00', Calories: 400 },
  { name: '12:00', Calories: 300 },
  { name: '18:00', Calories: 280 },
  { name: '23:59', Calories: 500 }
];

const sleepData = [
  { day: 'Sunday', Hours: 7 },
  { day: 'Monday', Hours: 6 },
  { day: 'Tuesday', Hours: 8 },
  { day: 'Wednesday', Hours: 5 },
  { day: 'Thursday', Hours: 7 },
  { day: 'Friday', Hours: 6 },
  { day: 'Saturday', Hours: 9 }
];

function ActivityTracker() {
  const [animatedValue, setAnimatedValue] = useState(0);
  const steps = 9500;
  const goal = 10000;
  const completion = Math.min(100, (steps / goal) * 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(completion); // Gradually set the value to match completion
    }, 250); // Starts animation 500ms after component mounts

    return () => clearTimeout(timer); // Clean up the timer
  }, [completion]);

  // const normalizedSteps = (steps / goal) * 100;

  // const open = Boolean(anchorEl);
  // const id = open ? 'simple-popover' : undefined;
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Activity Tracking
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <MainCard elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Activity
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              {' '}
              {/* Increased height from 150 to 300 */}
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '10px' }}
                />
                <Legend />
                <Bar dataKey="Calories" fill="#6ea393" radius={[10, 10, 0, 0]} barSize={30}>
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </MainCard>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <MainCard elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Sleep Stats
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Deep Sleep', value: 6 },
                    { name: 'Light Sleep', value: 8 },
                    { name: 'REM Sleep', value: 2 },
                    { name: 'Awake', value: 1 }
                  ]}
                  cx="50%"
                  cy="55%"
                  innerRadius={50}
                  outerRadius={100} // Increased outer radius
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  isAnimationActive={true}
                  labelLine={true} // Ensure label lines are visible
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="black"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        fontSize={'0.75rem'} // Smaller font size to fit text
                      >
                        {`${(percent * 100).toFixed(0)}% ${name}`}
                      </text>
                    );
                  }}
                >
                  {[
                    '#6ea393', // Deep Sleep
                    '#92c2ad', // Light Sleep
                    '#7ad0b6', // REM Sleep
                    '#d1f7dd' // Awake
                  ].map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} hours`, name]} />
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
                {/* Background Circle */}
                <CircularProgress variant="determinate" value={100} size={200} thickness={3} sx={{ color: 'rgba(0, 0, 0, 0.1)' }} />
                {/* Foreground Circle (Actual Progress) */}
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
                    {`${Math.round(completion)}%`}
                  </Typography>
                  <Typography variant="h6">{`${steps}/${goal} Steps`}</Typography>
                </Box>
              </Box>
            </ResponsiveContainer>
          </MainCard>
        </Grid>

        <Grid item xs={12}>
          <MainCard elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 5 }} gutterBottom>
              Sleep Patterns
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} /> {/* Lighter grid lines */}
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
        </Grid>
      </Grid>
    </Box>
  );
}

export default ActivityTracker;
