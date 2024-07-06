import React, { useState, useEffect } from 'react';
import {
  Typography,
  IconButton,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import axios from 'axios';
import { styled } from '@mui/system';

function Users() {
  const [profileType, setProfileType] = useState('User Profile');
  const [userData, setUserData] = useState([]);
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '',
    fname: '',
    lname: '',
    email: '',
    dob: '',
    gender: '',
    country: '',
    city: '',
    status: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/admin/user/getall', {
          headers: {
            Authorization: `${token}`
          }
        });
        if (response.data.success) {
          setUserData(response.data.user_data);
          setHealthData(response.data.health_data);
        } else {
          console.error('Failed to fetch data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProfileChange = (newProfile) => {
    setProfileType(newProfile);
  };

  const handleEdit = (rowIndex) => {
    const user = userData[rowIndex];
    setFormData(user);
    setIsEditing(true);
    setCurrentUserId(user.user_id);
    setOpen(true);
  };

  const handleDelete = (rowIndex) => {
    const user = userData[rowIndex];
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormErrors({});
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fname) errors.fname = 'First Name is required';
    if (!formData.lname) errors.lname = 'Last Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.dob) errors.dob = 'Date of Birth is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.country) errors.country = 'Country is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.status) errors.status = 'Status is required';
    return errors;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const token = localStorage.getItem('token');
    const apiEndpoint = `http://localhost:3001/api/admin/user/update/${currentUserId}`;
    const requestMethod = axios.put;

    try {
      await requestMethod(apiEndpoint, formData, {
        headers: {
          Authorization: `${token}`
        }
      });
      const updatedData = userData.map((user) => (user.user_id === currentUserId ? formData : user));
      setUserData(updatedData);
      handleClose();
      setSnackbarMessage('User details submitted successfully');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('There was an error submitting the user details!', error);
      setSnackbarMessage('Failed to submit user details');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3001/api/admin/user/delete/${userToDelete.user_id}`, {
        headers: {
          Authorization: `${token}`
        }
      });
      setUserData(userData.filter((user) => user.user_id !== userToDelete.user_id));
      handleDeleteClose();
      setSnackbarMessage('User deleted successfully');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('There was an error deleting the user!', error);
      setSnackbarMessage('Failed to delete user');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const getUserColumns = () => [
    { accessorKey: 'user_id', header: 'User ID' },
    { accessorKey: 'fname', header: 'First Name' },
    { accessorKey: 'lname', header: 'Last Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'dob', header: 'Date of Birth' },
    { accessorKey: 'gender', header: 'Gender' },
    { accessorKey: 'country', header: 'Country' },
    { accessorKey: 'city', header: 'City' },
    { accessorKey: 'status', header: 'Active Status' },
    {
      accessorKey: 'action',
      header: 'Action',
      Cell: ({ cell }) => (
        <>
          <IconButton aria-label="edit" onClick={() => handleEdit(cell.row.index)}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => handleDelete(cell.row.index)}>
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
  ];

  const getHealthColumns = () => [
    { accessorKey: 'user_id', header: 'User ID' },
    { accessorKey: 'diabetes_type', header: 'Diabetes Type' },
    { accessorKey: 'weight', header: 'Weight (kgs)' },
    { accessorKey: 'height', header: 'Height (m)' },
    { accessorKey: 'hbA1c', header: 'HbA1c Score' },
    { accessorKey: 'activity_level', header: 'Activity Level' }
  ];

  const columns = profileType === 'User Profile' ? getUserColumns() : getHealthColumns();
  const tableData = profileType === 'User Profile' ? userData : healthData;

  const StyledButton = styled(Button)(({ active }) => ({
    position: 'relative',
    marginRight: '20px',
    paddingBottom: '5px',
    color: active ? 'green' : 'inherit',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '2px',
      backgroundColor: 'green',
      transform: active ? 'scaleX(1)' : 'scaleX(0)',
      transition: 'transform 0.3s ease'
    },
    '&:hover::after': {
      transform: 'scaleX(1)'
    },
    '&:hover': {
      color: 'green'
    }
  }));

  return (
    <>
      <div className="mb-5 ml-1">
        <Typography variant="h2" className="font-roboto">
          User Table
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <StyledButton variant="text" onClick={() => handleProfileChange('User Profile')} active={profileType === 'User Profile'}>
            User Profile
          </StyledButton>
          <StyledButton variant="text" onClick={() => handleProfileChange('Health Profile')} active={profileType === 'Health Profile'}>
            Health Profile
          </StyledButton>
        </div>
      </div>

      <Card style={{ boxShadow: '2', maxWidth: '1211px' }}>
        <CardContent style={{ padding: 0 }}>
          {loading ? (
            <Typography variant="h6" align="center" sx={{ mt: 4 }}>
              Loading...
            </Typography>
          ) : (
            <div style={{ overflowX: 'hidden', maxWidth: '1211px' }}>
              <MaterialReactTable
                columns={columns}
                data={tableData}
                enableColumnFilters
                enableSorting
                enablePagination
                initialState={{ pagination: { pageSize: 5 } }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{isEditing ? 'Edit User' : 'Add User'}</Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off" onSubmit={handleFormSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 2 }}>
              <TextField
                label="First Name"
                name="fname"
                required
                value={formData.fname}
                onChange={handleFormChange}
                error={Boolean(formErrors.fname)}
                helperText={formErrors.fname}
                fullWidth
              />
              <TextField
                label="Last Name"
                name="lname"
                required
                value={formData.lname}
                onChange={handleFormChange}
                error={Boolean(formErrors.lname)}
                helperText={formErrors.lname}
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Email"
                name="email"
                required
                value={formData.email}
                onChange={handleFormChange}
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
                fullWidth
              />
              <TextField
                label="Date of Birth"
                name="dob"
                required
                type="date"
                InputLabelProps={{
                  shrink: true
                }}
                value={formData.dob}
                onChange={handleFormChange}
                error={Boolean(formErrors.dob)}
                helperText={formErrors.dob}
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Gender"
                name="gender"
                required
                value={formData.gender}
                onChange={handleFormChange}
                error={Boolean(formErrors.gender)}
                helperText={formErrors.gender}
                fullWidth
              />
              <TextField
                label="Country"
                name="country"
                required
                value={formData.country}
                onChange={handleFormChange}
                error={Boolean(formErrors.country)}
                helperText={formErrors.country}
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="City"
                name="city"
                required
                value={formData.city}
                onChange={handleFormChange}
                error={Boolean(formErrors.city)}
                helperText={formErrors.city}
                fullWidth
              />
              <TextField
                label="Status"
                name="status"
                required
                value={formData.status}
                onChange={handleFormChange}
                error={Boolean(formErrors.status)}
                helperText={formErrors.status}
                fullWidth
              />
            </Box>
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: '#6ea393',
                  '&:hover': {
                    backgroundColor: '#5b887a'
                  }
                }}
              >
                Submit
              </Button>
              <Button
                variant="contained"
                onClick={handleClose}
                sx={{ backgroundColor: '#c36b6a', '&:hover': { backgroundColor: '#a95a5a' } }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem', pt: 1 }}>Confirm Delete</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions className="flex justify-center pb-5">
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#6ea393',
              '&:hover': {
                backgroundColor: '#5b887a'
              }
            }}
            onClick={handleDeleteConfirm}
          >
            Confirm
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#c36b6a', '&:hover': { backgroundColor: '#a95a5a' } }}
            onClick={handleDeleteClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Users;
