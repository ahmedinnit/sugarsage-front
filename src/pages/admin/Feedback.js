import React, { useState, useEffect } from 'react';
import {
  Typography,
  IconButton,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Snackbar,
  Alert,
  Grid
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import axios from 'axios';

function Feedback() {
  const [data, setData] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:3001/api/admin/feedback/getall', {
        headers: {
          Authorization: `${token}`
        }
      })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the feedback data!', error);
      });
  }, []);

  const handleView = (rowIndex) => {
    setSelectedFeedback(data[rowIndex]);
    setViewDialogOpen(true);
  };

  const handleDelete = (rowIndex) => {
    setSelectedFeedback(data[rowIndex]);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    const token = localStorage.getItem('token');
    axios
      .delete(`http://localhost:3001/api/admin/feedback/delete/${selectedFeedback.feedback_id}`, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then(() => {
        setData(data.filter((feedback) => feedback.feedback_id !== selectedFeedback.feedback_id));
        setSnackbarMessage('Feedback deleted successfully');
        setSnackbarSeverity('success');
      })
      .catch((error) => {
        console.error('There was an error deleting the feedback!', error);
        setSnackbarMessage('Failed to delete feedback');
        setSnackbarSeverity('error');
      })
      .finally(() => {
        setSnackbarOpen(true);
        setDeleteDialogOpen(false);
        setSelectedFeedback(null);
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const fbCols = [
    {
      accessorKey: 'feedback_id',
      header: 'Feedback ID',
      enableSorting: true,
      enableColumnFilter: false,
      minWidth: 50,
      width: 50,
      maxWidth: 50
    },
    {
      accessorKey: 'user_id',
      header: 'User ID',
      enableSorting: false,
      enableColumnFilter: false,
      minWidth: 50,
      width: 50,
      maxWidth: 50
    },
    {
      accessorKey: 'feedback_topic',
      header: 'Feedback Topic',
      enableSorting: false,
      enableColumnFilter: true,
      minWidth: 50,
      width: 50,
      maxWidth: 50
    },
    {
      accessorKey: 'feedback_type',
      header: 'Feedback Type',
      enableSorting: false,
      enableColumnFilter: true,
      minWidth: 50,
      width: 50,
      maxWidth: 50
    },
    {
      accessorKey: 'feedback_title',
      header: 'Feedback Title',
      enableSorting: false,
      enableColumnFilter: true,
      minWidth: 50,
      width: 50,
      maxWidth: 50
    },
    {
      accessorKey: 'description',
      header: 'Description',
      enableSorting: false,
      enableColumnFilter: true,
      minWidth: 50,
      width: 50,
      maxWidth: 50,
      Cell: ({ row }) => {
        const maxChar = 100; // Set maximum character limit
        const desc = row.original.description;
        return <Typography>{desc.length > maxChar ? `${desc.substring(0, maxChar)}...` : desc}</Typography>;
      }
    },
    {
      accessorKey: 'created_at',
      header: 'Time',
      enableSorting: true,
      enableColumnFilter: true,
      minWidth: 50,
      width: 50,
      maxWidth: 50
    },
    {
      accessorKey: 'date',
      header: 'Date',
      enableSorting: true,
      enableColumnFilter: true,
      minWidth: 50,
      width: 50,
      maxWidth: 50
    },
    {
      accessorKey: 'action',
      header: 'Action',
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <div style={{ display: 'flex' }}>
          <IconButton aria-label="view" onClick={() => handleView(row.index)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => handleDelete(row.index)}>
            <DeleteIcon />
          </IconButton>
        </div>
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
    }
  };

  return (
    <>
      <div className="mb-5 ml-1">
        <Typography variant="h2" className="font-roboto">
          Feedback Table
        </Typography>
      </div>

      <Card style={{ boxShadow: '2', maxWidth: '1211px' }}>
        <CardContent style={{ padding: 0 }}>
          <div style={{ overflowX: 'hidden', maxWidth: '1211px' }}>
            <MaterialReactTable columns={fbCols} data={data} {...options} />
          </div>
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm">
        <DialogTitle>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            View Feedback
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Feedback ID:</strong> {selectedFeedback.feedback_id}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>User ID:</strong> {selectedFeedback.user_id}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Feedback Topic:</strong> {selectedFeedback.feedback_topic}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Feedback Type:</strong> {selectedFeedback.feedback_type}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Feedback Title:</strong> {selectedFeedback.feedback_title}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Description:</strong> {selectedFeedback.description}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Time:</strong> {selectedFeedback.created_at}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Date:</strong> {selectedFeedback.date}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setViewDialogOpen(false)}
            variant="contained"
            sx={{
              backgroundColor: '#6ea393',
              '&:hover': {
                backgroundColor: '#5b887a'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to delete this feedback?</Typography>
        </DialogContent>
        <DialogActions className="flex justify-center">
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              backgroundColor: '#6ea393',
              '&:hover': {
                backgroundColor: '#5b887a'
              }
            }}
          >
            Confirm
          </Button>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="contained"
            sx={{ backgroundColor: '#c36b6a', '&:hover': { backgroundColor: '#a95a5a' } }}
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

export default Feedback;
