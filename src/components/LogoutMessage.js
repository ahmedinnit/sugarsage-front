import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { activeItem } from 'store/reducers/menu';

function LogoutDialog({ open, handleClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    // Handle logout
    localStorage.clear();
    dispatch(activeItem({ openItem: ['dashboard'] }));
    navigate('/login');
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
      sx={{
        '& .MuiDialog-paper': {
          minWidth: '300px', // Minimum width
          maxWidth: '600px', // Maximum width for larger screens
          borderRadius: '8px', // Consistent border radius
          boxShadow: '0 3px 10px rgba(0,0,0,0.2)', // Subtle shadow effect
          p: 1
        }
      }}
    >
      <DialogTitle id="logout-dialog-title">
        <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Logout Confirmation</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="logout-dialog-description">Are you sure you want to logout?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleLogout}
          variant="contained"
          sx={{ backgroundColor: '#6ea393', '&:hover': { backgroundColor: '#5b887a' } }} // Original green color
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LogoutDialog;
