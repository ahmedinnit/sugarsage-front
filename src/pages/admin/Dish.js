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

function Dish() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDishId, setCurrentDishId] = useState(null);
  const [formData, setFormData] = useState({
    dish_name: '',
    category: '',
    season: '',
    total_calories: '',
    fats: '',
    proteins: '',
    carbs: '',
    GL: ''
    // ingredients: '',
    // recipe: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:3001/api/admin/dish/getall', {
        headers: {
          Authorization: `${token}`
        }
      })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the Dishes!', error);
      });
  }, []);

  const handleClickOpen = (dish = null) => {
    if (dish) {
      setFormData(dish);
      setIsEditing(true);
      setCurrentDishId(dish.dish_id);
    } else {
      setFormData({
        dish_name: '',
        category: '',
        season: '',
        total_calories: '',
        fats: '',
        proteins: '',
        carbs: '',
        GL: ''
        // ingredients: '',
        // recipe: ''
      });
      setIsEditing(false);
      setCurrentDishId(null);
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
    if (!formData.dish_name) errors.dish_name = 'Dish Name is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.season) errors.season = 'Season is required';
    if (!formData.total_calories) errors.total_calories = 'Total Calories is required';
    if (!formData.fats) errors.fats = 'Fats are required';
    if (!formData.proteins) errors.proteins = 'Proteins are required';
    if (!formData.carbs) errors.carbs = 'Carbs are required';
    if (!formData.GL) errors.GL = 'GL is required';
    // if (!formData.ingredients) errors.ingredients = 'Ingredients is required';
    // if (!formData.recipe) errors.recipe = 'Recipe is required';
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
    const apiEndpoint = isEditing
      ? `http://localhost:3001/api/admin/dish/update/${currentDishId}`
      : 'http://localhost:3001/api/admin/dish/add';
    const requestMethod = isEditing ? axios.put : axios.post;

    requestMethod(apiEndpoint, formData, {
      headers: {
        Authorization: `${token}`
      }
    })
      .then((response) => {
        console.log('Dish Item Submitted Successfully:', response.data);
        if (isEditing) {
          const updatedData = data.map((dish) => (dish.dish_id === currentDishId ? formData : dish));
          setData(updatedData);
        } else {
          setData([...data, formData]);
        }
        handleClose();
        setSnackbarMessage('Dish Item submitted successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error('There was an error submitting the Dish Item!', error);
        setSnackbarMessage('Failed to submit Dish Item');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDeleteClick = (dish) => {
    setDishToDelete(dish);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setDishToDelete(null);
  };

  const handleDeleteConfirm = () => {
    const token = localStorage.getItem('token');
    axios
      .delete(`http://localhost:3001/api/admin/dish/delete/${dishToDelete.dish_id}`, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then((response) => {
        console.log('Dish Item Deleted Successfully:', response.data);
        setData(data.filter((dish) => dish.dish_id !== dishToDelete.dish_id));
        handleDeleteClose();
        setSnackbarMessage('Dish Item deleted successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error('There was an error deleting the Dish Item!', error);
        setSnackbarMessage('Failed to delete Dish');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const dishCols = [
    {
      accessorKey: 'dish_id',
      header: 'Dish ID',
      enableSorting: true,
      enableFiltering: false
    },
    {
      accessorKey: 'dish_name',
      header: 'Dish Name',
      enableSorting: false,
      enableFiltering: false
    },
    {
      accessorKey: 'category',
      header: 'Category',
      enableSorting: false,
      enableFiltering: true
    },
    {
      accessorKey: 'season',
      header: 'Season',
      enableSorting: false,
      enableFiltering: true
    },
    {
      accessorKey: 'total_calories',
      header: 'Total Calories (100g)',
      enableSorting: true,
      enableFiltering: true
    },
    {
      accessorKey: 'fats',
      header: 'Fats (G)',
      enableSorting: true,
      enableFiltering: true
    },
    {
      accessorKey: 'proteins',
      header: 'Proteins (G)',
      enableSorting: true,
      enableFiltering: true
    },
    {
      accessorKey: 'carbs',
      header: 'Carbs (G)',
      enableSorting: true,
      enableFiltering: true
    },
    {
      accessorKey: 'GL',
      header: 'GL',
      enableSorting: true,
      enableFiltering: true
    },
    // {
    //   accessorKey: 'ingredients',
    //   header: 'Ingredients',
    //   enableSorting: true,
    //   enableFiltering: true
    // },
    // {
    //   accessorKey: 'recipe',
    //   header: 'Recipe',
    //   enableSorting: true,
    //   enableFiltering: true
    // },
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
        onClick={handleClickOpen}
      >
        Add Dish
      </Button>
    )
  };

  return (
    <>
      <div className="mb-5 ml-1">
        <Typography variant="h2" className="font-roboto">
          Dish Table
        </Typography>
      </div>
      <Card style={{ boxShadow: '2', maxWidth: '1211px' }}>
        <CardContent style={{ padding: 0 }}>
          <div style={{ overflowX: 'hidden', maxWidth: '1211px' }}>
            <MaterialReactTable columns={dishCols} data={data} {...options} />
          </div>
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{isEditing ? 'Edit Dish' : 'Add Dish'}</Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off" onSubmit={handleFormSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 2 }}>
              <TextField
                label="Dish Name"
                name="dish_name"
                required
                value={formData.dish_name}
                onChange={handleFormChange}
                error={Boolean(formErrors.dish_name)}
                helperText={formErrors.dish_name}
                fullWidth
              />
              <TextField
                label="Category"
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
                label="Season"
                name="season"
                required
                value={formData.season}
                onChange={handleFormChange}
                error={Boolean(formErrors.season)}
                helperText={formErrors.season}
                fullWidth
              />
              <TextField
                label="Total Calories (100g)"
                name="total_calories"
                required
                type="number"
                value={formData.total_calories}
                onChange={handleFormChange}
                error={Boolean(formErrors.total_calories)}
                helperText={formErrors.total_calories}
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Fats (G)"
                name="fats"
                required
                type="number"
                value={formData.fats}
                onChange={handleFormChange}
                error={Boolean(formErrors.fats)}
                helperText={formErrors.fats}
                fullWidth
              />
              <TextField
                label="Proteins (G)"
                name="proteins"
                required
                type="number"
                value={formData.proteins}
                onChange={handleFormChange}
                error={Boolean(formErrors.proteins)}
                helperText={formErrors.proteins}
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Carbs (G)"
                name="carbs"
                required
                type="number"
                value={formData.carbs}
                onChange={handleFormChange}
                error={Boolean(formErrors.carbs)}
                helperText={formErrors.carbs}
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
            {/* <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Ingredients"
                name="ingredients"
                required
                value={formData.ingredients}
                onChange={handleFormChange}
                error={Boolean(formErrors.ingredients)}
                helperText={formErrors.ingredients}
                fullWidth
              />
              <TextField
                label="Recipe"
                name="recipe"
                required
                value={formData.recipe}
                onChange={handleFormChange}
                error={Boolean(formErrors.recipe)}
                helperText={formErrors.recipe}
                fullWidth
              />
            </Box> */}
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
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem', pt: 1 }}>Confirm Delete</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this Dish Item?</Typography>
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

export default Dish;
