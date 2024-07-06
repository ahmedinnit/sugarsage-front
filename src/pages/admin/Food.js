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

function Food() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFoodId, setCurrentFoodId] = useState(null);
  const [formData, setFormData] = useState({
    food_name: '',
    category: '',
    'energy (kCal)': '',
    'fats (g)': '',
    'proteins (g)': '',
    'carbs (g)': '',
    GI: '',
    GL: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getallfoods`, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the foods!', error);
      });
  }, []);

  const handleClickOpen = (food = null) => {
    if (food) {
      setFormData(food);
      setIsEditing(true);
      setCurrentFoodId(food.food_id);
    } else {
      setFormData({
        food_name: '',
        category: '',
        'energy (kCal)': '',
        'fats (g)': '',
        'proteins (g)': '',
        'carbs (g)': '',
        GI: '',
        GL: ''
      });
      setIsEditing(false);
      setCurrentFoodId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormErrors({});
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
    if (!formData.food_name) errors.food_name = 'Food Name is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData['energy (kCal)']) errors['energy (kCal)'] = 'Energy is required';
    if (!formData['fats (g)']) errors['fats (g)'] = 'Fats are required';
    if (!formData['proteins (g)']) errors['proteins (g)'] = 'Proteins are required';
    if (!formData['carbs (g)']) errors['carbs (g)'] = 'Carbs are required';
    if (!formData.GI) errors.GI = 'GI is required';
    if (!formData.GL) errors.GL = 'GL is required';
    return errors;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const token = localStorage.getItem('token');
    const apiEndpoint = isEditing ? `${process.env.REACT_APP_BACKEND_URL}/api/admin/editfood/${currentFoodId}` : `${process.env.REACT_APP_BACKEND_URL}/api/admin/addfood`;
    const requestMethod = isEditing ? axios.put : axios.post;

    requestMethod(apiEndpoint, formData, {
      headers: {
        Authorization: `${token}`
      }
    })
      .then((response) => {
        console.log('Food Item Submitted Successfully:', response.data);
        if (isEditing) {
          const updatedData = data.map((food) => (food.food_id === currentFoodId ? formData : food));
          setData(updatedData);
        } else {
          setData([...data, response.data.data]);
        }
        handleClose();
        setSnackbarMessage('Food submitted successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error('There was an error submitting the food item!', error);
        setSnackbarMessage('Failed to submit food');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDeleteClick = (food) => {
    setFoodToDelete(food);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setFoodToDelete(null);
  };

  const handleDeleteConfirm = () => {
    const token = localStorage.getItem('token');
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}PP_BACKEND_URL}/api/admin/deletefood/${foodToDelete.food_id}`, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then((response) => {
        console.log('Food Item Deleted Successfully:', response.data);
        setData(data.filter((food) => food.food_id !== foodToDelete.food_id));
        handleDeleteClose();
        setSnackbarMessage('Food deleted successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error('There was an error deleting the food item!', error);
        setSnackbarMessage('Failed to delete food');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const foodCols = [
    {
      accessorKey: 'food_id',
      header: 'Food ID',
      enableSorting: true,
      enableFiltering: false
    },
    {
      accessorKey: 'food_name',
      header: 'Food Name',
      enableSorting: false,
      enableFiltering: false
    },
    {
      accessorKey: 'category',
      header: 'Food Category',
      enableSorting: false,
      enableFiltering: true
    },
    {
      accessorKey: 'energy (kCal)',
      header: 'Energy (KCal)',
      enableSorting: true,
      enableFiltering: true
    },
    {
      accessorKey: 'fats (g)',
      header: 'Fats (G)',
      enableSorting: true,
      enableFiltering: true
    },
    {
      accessorKey: 'proteins (g)',
      header: 'Proteins (G)',
      enableSorting: true,
      enableFiltering: true
    },
    {
      accessorKey: 'carbs (g)',
      header: 'Carbs (G)',
      enableSorting: true,
      enableFiltering: true
    },
    {
      accessorKey: 'GI',
      header: 'GI',
      enableSorting: true,
      enableFiltering: true
    },
    {
      accessorKey: 'GL',
      header: 'GL',
      enableSorting: true,
      enableFiltering: true
    },
    {
      accessorKey: 'action',
      header: 'Action',
      enableSorting: false,
      enableFiltering: false,
      Cell: ({ row }) => (
        <>
          <IconButton aria-label="edit" onClick={() => handleClickOpen(row.original)}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => handleDeleteClick(row.original)}>
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
  ];

  const options = {
    enableColumnFilters: true,
    enableSorting: true,
    enablePagination: true,
    initialState: {
      pagination: {
        pageSize: 5
      }
    },
    muiTableContainerProps: {
      sx: {
        overflowX: 'auto'
      }
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#f5f5f5',
        fontWeight: 'bold',
        position: 'sticky',
        top: 0,
        zIndex: 1
      }
    },
    muiToolbarAlertBannerProps: {
      sx: {
        position: 'sticky',
        top: 0,
        zIndex: 2
      }
    },
    renderTopToolbarCustomActions: () => (
      <Button
        variant="contained"
        sx={{ backgroundColor: '#6ea393', marginLeft: 2, '&:hover': { backgroundColor: '#5b887a' } }}
        onClick={() => handleClickOpen()}
      >
        Add Food
      </Button>
    )
  };

  return (
    <>
      <div className="mb-5 ml-1">
        <Typography variant="h2" className="font-roboto">
          Food Table
        </Typography>
      </div>
      <Card style={{ boxShadow: '2', maxWidth: '1211px' }}>
        <CardContent style={{ padding: 0 }}>
          <div style={{ overflowX: 'hidden', maxWidth: '1211px' }}>
            <MaterialReactTable columns={foodCols} data={data} {...options} />
          </div>
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{isEditing ? 'Edit Food' : 'Add Food'}</Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off" onSubmit={handleFormSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 2 }}>
              <TextField
                label="Food Name"
                name="food_name"
                required
                value={formData.food_name}
                onChange={handleFormChange}
                error={Boolean(formErrors.food_name)}
                helperText={formErrors.food_name}
                fullWidth
              />
              <TextField
                label="Food Category"
                name="category"
                required
                value={formData.category}
                onChange={handleFormChange}
                error={Boolean(formErrors.category)}
                helperText={formErrors.category}
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Energy (KCal)"
                name="energy (kCal)"
                required
                type="number"
                value={formData['energy (kCal)']}
                onChange={handleFormChange}
                error={Boolean(formErrors['energy (kCal)'])}
                helperText={formErrors['energy (kCal)']}
                fullWidth
              />
              <TextField
                label="Fats (G)"
                name="fats (g)"
                required
                type="number"
                value={formData['fats (g)']}
                onChange={handleFormChange}
                error={Boolean(formErrors['fats (g)'])}
                helperText={formErrors['fats (g)']}
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Proteins (G)"
                name="proteins (g)"
                required
                type="number"
                value={formData['proteins (g)']}
                onChange={handleFormChange}
                error={Boolean(formErrors['proteins (g)'])}
                helperText={formErrors['proteins (g)']}
                fullWidth
              />
              <TextField
                label="Carbs (G)"
                name="carbs (g)"
                required
                type="number"
                value={formData['carbs (g)']}
                onChange={handleFormChange}
                error={Boolean(formErrors['carbs (g)'])}
                helperText={formErrors['carbs (g)']}
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="GI"
                name="GI"
                required
                type="number"
                value={formData.GI}
                onChange={handleFormChange}
                error={Boolean(formErrors.GI)}
                helperText={formErrors.GI}
                fullWidth
              />
              <TextField
                label="GL"
                name="GL"
                required
                type="number"
                value={formData.GL}
                onChange={handleFormChange}
                error={Boolean(formErrors.GL)}
                helperText={formErrors.GL}
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
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose} maxWidth="md">
        <DialogTitle>
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem', pt: 1 }}>Confirm Delete</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this food item?</Typography>
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

export default Food;
