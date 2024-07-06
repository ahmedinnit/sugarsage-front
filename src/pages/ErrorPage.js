import React from 'react';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ErrorOutline } from '@mui/icons-material';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md text-center p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-4">
          <ErrorOutline style={{ fontSize: 80, color: '#6ea393' }} />
        </div>
        <Typography variant="h4" component="h1" className="text-gray-800 mb-2">
          Oops! Page Not Found
        </Typography>
        <Typography variant="body1" className="text-gray-600 mb-6">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          className="#c36b6a hover:#a95a5a"
          sx={{
            bgcolor: '#6ea393',
            '&:hover': {
              bgcolor: '#5b887a'
            },
            color: 'white'
          }}
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
