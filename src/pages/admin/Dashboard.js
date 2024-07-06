import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  //   MainCard,
  CardContent,
  CardHeader,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
  //   LinearProgress
} from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
} from 'chart.js';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import MainCard from 'components/MainCard';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

const DashboardPage = () => {
  const [selectedOption, setSelectedOption] = useState('city');

  // Dummy data
  //   const totalUsers = 150;
  //   const totalAdmins = 10;
  //   const newUsers = 25;
  const userGrowthRate = 5.6;
  //   const monthlyActiveUsers = [20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100];
  const userDemographics = {
    city: {
      'New York': 30,
      'Los Angeles': 20,
      Chicago: 15,
      Houston: 25,
      Phoenix: 10,
      Philadelphia: 5,
      'San Antonio': 10,
      'San Diego': 15,
      Dallas: 20
    },
    country: {
      USA: 120,
      Canada: 15,
      UK: 10,
      Germany: 5
    }
  };
  // const userRoles = {
  //   User: 140,
  //   Admin: 10
  // };

  //   const recentActivities = [
  //     { user: 'John Doe', action: 'Logged in', date: '2024-06-28 10:30' },
  //     { user: 'Jane Smith', action: 'Added a new post', date: '2024-06-28 11:00' },
  //     { user: 'Mike Johnson', action: 'Updated profile', date: '2024-06-28 11:30' },
  //     { user: 'Sarah Williams', action: 'Logged out', date: '2024-06-28 12:00' }
  //   ];

  const recentFeedbacks = [
    { user: 'John Doe', feedback: 'Great service!', date: '2024-06-28 10:30' },
    { user: 'Jane Smith', feedback: 'Very helpful.', date: '2024-06-28 11:00' },
    { user: 'Mike Johnson', feedback: 'Could be improved.', date: '2024-06-28 11:30' },
    { user: 'Sarah Williams', feedback: 'Loved it!', date: '2024-06-28 12:00' }
  ];

  const pendingApprovals = [
    { item: 'New Blog Post', user: 'John Doe', date: '2024-06-28 10:30' },
    { item: 'New Comment', user: 'Jane Smith', date: '2024-06-28 11:00' },
    { item: 'Profile Update', user: 'Mike Johnson', date: '2024-06-28 11:30' }
  ];

  //   const customerSatisfaction = 85; // Percentage

  const topUsers = [
    { user: 'John Doe', contributions: 50 },
    { user: 'Jane Smith', contributions: 45 },
    { user: 'Mike Johnson', contributions: 40 }
  ];

  const systemNotifications = [
    { message: 'Server maintenance scheduled at 2:00 AM.', type: 'info' },
    { message: 'New version of the app is available.', type: 'info' },
    { message: 'Disk space is running low.', type: 'warning' }
  ];

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const userChartData = {
    labels: Object.keys(userDemographics[selectedOption] || {}),
    datasets: [
      {
        label: 'Users',
        data: Object.values(userDemographics[selectedOption] || {}),
        backgroundColor: 'rgba(110, 163, 147, 0.6)',
        borderColor: 'rgba(110, 163, 147, 1)',
        borderWidth: 1
      }
    ]
  };

  const userGrowthData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'New Users',
        data: [5, 10, 15, 20, 25, 30],
        fill: false,
        backgroundColor: 'rgba(110, 163, 147, 0.6)',
        borderColor: 'rgba(110, 163, 147, 1)'
      }
    ]
  };

  //   const monthlyActiveUsersData = {
  //     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  //     datasets: [
  //       {
  //         label: 'Active Users',
  //         data: monthlyActiveUsers,
  //         backgroundColor: 'rgba(110, 163, 147, 0.6)',
  //         borderColor: 'rgba(110, 163, 147, 1)',
  //         fill: false
  //       }
  //     ]
  //   };

  // const userRolesData = {
  //   labels: Object.keys(userRoles),
  //   datasets: [
  //     {
  //       data: Object.values(userRoles),
  //       backgroundColor: ['rgba(110, 163, 147, 0.6)', 'rgba(200, 50, 50, 0.6)'],
  //       borderColor: ['rgba(110, 163, 147, 1)', 'rgba(200, 50, 50, 1)']
  //     }
  //   ]
  // };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Total Users */}
        {/* <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{totalUsers}</Typography>
              <Box display="flex" alignItems="center">
                <ArrowUpwardIcon color="success" />
                <Typography color="success.main" variant="subtitle2" sx={{ ml: 0.5 }}>
                  {newUsers} new this month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid> */}

        {/* Total Admins */}
        {/* <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Admins</Typography>
              <Typography variant="h4">{totalAdmins}</Typography>
            </CardContent>
          </Card>
        </Grid> */}

        {/* User Growth */}
        <Grid item xs={12} md={6}>
          <MainCard>
            <CardContent>
              <Typography variant="h6">User Growth Rate</Typography>
              <Box display="flex" alignItems="center">
                {userGrowthRate > 0 ? <ArrowUpwardIcon color="success" /> : <ArrowDownwardIcon color="error" />}
                <Typography color={userGrowthRate > 0 ? 'success.main' : 'error.main'} variant="subtitle2" sx={{ ml: 0.5 }}>
                  {userGrowthRate}%
                </Typography>
              </Box>
              <Line data={userGrowthData} />
            </CardContent>
          </MainCard>
        </Grid>

        {/* User Demographics */}
        <Grid item xs={12} md={8}>
          <MainCard>
            <CardHeader title="User Demographics" />
            <CardContent>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Filter By</InputLabel>
                <Select value={selectedOption} onChange={handleOptionChange}>
                  <MenuItem value="city">City</MenuItem>
                  <MenuItem value="country">Country</MenuItem>
                </Select>
              </FormControl>
              <Bar data={userChartData} />
            </CardContent>
          </MainCard>
        </Grid>

        {/* User Roles */}
        {/* <Grid item xs={12} md={4}>
            <MainCard>
              <CardHeader title="User Roles" />
              <CardContent>
                <Pie data={userRolesData} />
              </CardContent>
            </MainCard>
          </Grid> */}

        {/* Customer Satisfaction */}
        {/* <Grid item xs={12} md={6}>
          <MainCard>
            <CardContent>
              <Typography variant="h6">Customer Satisfaction</Typography>
              <Box display="flex" alignItems="center" mt={2}>
                <Typography variant="h4" color="textPrimary" sx={{ mr: 2 }}>
                  {customerSatisfaction}%
                </Typography>
                <LinearProgress variant="determinate" value={customerSatisfaction} sx={{ flexGrow: 1 }} />
              </Box>
            </CardContent>
          </MainCard>
        </Grid> */}

        {/* Recent Feedbacks */}
        <Grid item xs={12} md={6}>
          <MainCard>
            <CardHeader title="Recent User Feedbacks" />
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Feedback</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentFeedbacks.map((feedback, index) => (
                    <TableRow key={index}>
                      <TableCell>{feedback.user}</TableCell>
                      <TableCell>{feedback.feedback}</TableCell>
                      <TableCell>{feedback.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </MainCard>
        </Grid>

        {/* Pending Approvals */}
        <Grid item xs={12} md={6}>
          <MainCard>
            <CardHeader title="Pending Approvals" />
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingApprovals.map((approval, index) => (
                    <TableRow key={index}>
                      <TableCell>{approval.item}</TableCell>
                      <TableCell>{approval.user}</TableCell>
                      <TableCell>{approval.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </MainCard>
        </Grid>

        {/* Top Users */}
        <Grid item xs={12} md={6}>
          <MainCard>
            <CardHeader title="Top Performing Users" />
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Contributions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topUsers.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.user}</TableCell>
                      <TableCell>{user.contributions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </MainCard>
        </Grid>

        {/* System Notifications */}
        <Grid item xs={12}>
          <MainCard>
            <CardHeader title="System Notifications" />
            <CardContent>
              {systemNotifications.map((notification, index) => (
                <Box key={index} display="flex" alignItems="center" my={1}>
                  {notification.type === 'info' && <CheckCircleIcon color="info" />}
                  {notification.type === 'warning' && <ErrorIcon color="warning" />}
                  {notification.type === 'pending' && <PendingIcon color="action" />}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {notification.message}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </MainCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
