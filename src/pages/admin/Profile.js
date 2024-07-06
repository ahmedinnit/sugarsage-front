import React, { useState, useEffect } from 'react';
import { Typography, Button, TextField, Box, IconButton, MenuItem, InputAdornment } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Delete';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import MainCard from 'components/MainCard';
import { countries, cities } from 'utils/places'; // Assuming you have a utility file for countries and cities
import axios from 'axios';

function Profile() {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    dob: null,
    gender: '',
    country: '',
    city: '',
    password: '',
    phoneNumber: ''
  });

  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const admin_id = localStorage.getItem('id');
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/profile/get/${admin_id}`,
        {},
        {
          headers: {
            Authorization: `${token}`
          }
        }
      )
      .then((response) => {
        const data = response.data.data[0];
        // console.log('Fetched data:', data); // Debugging
        setFormData({
          fname: data.fname,
          lname: data.lname,
          email: data.email,
          dob: data.dob,
          gender: ['male', 'female', 'other'].includes(data.gender.toLowerCase()) ? data.gender.toLowerCase() : '',
          country: countries.map((country) => country.name).includes(data.country) ? data.country : '',
          city: cities[data.country]?.includes(data.city) ? data.city : '',
          password: data.password,
          phoneNumber: data.phoneNumber
        });
        setProfileImage(data.profile_picture);
      })
      .catch((error) => {
        console.error('Error fetching admin data:', error.response || error.message || error);
      });
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dob: date
    });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onDrop = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
  };

  const removeImage = () => {
    setImage(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    multiple: false
  });

  const handleSubmit = () => {
    const admin_id = localStorage.getItem('id');
    const updateData = {
      ...formData,
      profile_picture: profileImage
    };

    if (image) {
      const imageFormData = new FormData();
      imageFormData.append('file', image);
      imageFormData.append('upload_preset', 'nqmfgirq');
      const token = localStorage.getItem('token');
      axios
        .post('https://api.cloudinary.com/v1_1/dqem8pi4b/image/upload', imageFormData)
        .then((res) => {
          updateData.profile_picture = res.data.secure_url;
          return axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/admin/profile/update/${admin_id}`, updateData, {
            headers: {
              Authorization: `${token}`
            }
          });
        })
        .then((response) => {
          console.log('Check:', response.data.data.fname);
          localStorage.setItem('username', response.data.data.fname + ' ' + response.data.data.lname);
          localStorage.setItem('pp', response.data.data.profile_picture);
          console.log('Profile updated successfully:', response.data);
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
        });
    } else {
      const token = localStorage.getItem('token');
      axios
        .put(`${process.env.REACT_APP_BACKEND_URL}/api/admin/profile/update/${admin_id}`, updateData, {
          headers: {
            Authorization: `${token}`
          }
        })
        .then((response) => {
          console.log('Check:', response.data.data.fname);
          localStorage.setItem('username', response.data.data.fname + ' ' + response.data.data.lname);
          localStorage.setItem('pp', response.data.data.profile_picture);
          window.location.reload();
          console.log('Profile updated successfully:', response.data);
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
        });
    }
  };

  const handleDeleteAccount = () => {
    const admin_id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/profile/delete/${admin_id}`, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then((response) => {
        console.log('Account deleted successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error deleting account:', error);
      });
  };

  return (
    <>
      <div className="mb-5 ml-1">
        <Typography variant="h2" className="font-roboto">
          Profile
        </Typography>
      </div>

      <MainCard style={{ boxShadow: '2' }}>
        <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            Basic Information
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
            <Box
              {...getRootProps()}
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                border: '2px solid #ccc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                position: 'relative',
                backgroundColor: '#f0f0f0',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                '&:hover .upload-icon': {
                  opacity: 1
                }
              }}
            >
              <input {...getInputProps()} />
              {profileImage || image ? (
                <img
                  src={image ? URL.createObjectURL(image) : profileImage}
                  alt="Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Typography>Upload Image</Typography>
              )}
              <Box
                className="upload-icon"
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '50%',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <CameraAltIcon sx={{ color: '#fff', fontSize: 40 }} />
              </Box>
            </Box>
            {(profileImage || image) && (
              <IconButton sx={{ position: 'absolute', top: 10, right: 10 }} onClick={removeImage}>
                <DeleteIcon color="error" />
              </IconButton>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <TextField
              id="fname"
              label="First Name"
              name="fname"
              value={formData.fname || ''}
              onChange={handleFormChange}
              sx={{ flex: '1 1 30%' }}
            />
            <TextField
              id="lname"
              label="Last Name"
              name="lname"
              value={formData.lname || ''}
              onChange={handleFormChange}
              sx={{ flex: '1 1 30%' }}
            />
            <TextField
              id="email"
              label="Email Address"
              name="email"
              value={formData.email || ''}
              onChange={handleFormChange}
              sx={{ flex: '1 1 30%' }}
              disabled
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                id="dob"
                label="DOB"
                value={formData.dob || ''}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} sx={{ flex: '1 1 30%' }} />}
              />
            </LocalizationProvider>
            <TextField
              id="gender"
              label="Gender"
              name="gender"
              select
              value={formData.gender || ''}
              onChange={handleFormChange}
              sx={{ flex: '1 1 30%' }}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </TextField>
            <TextField
              id="country"
              label="Country"
              name="country"
              select
              value={formData.country || ''}
              onChange={handleFormChange}
              sx={{ flex: '1 1 30%' }}
            >
              {countries.map((country) => (
                <MenuItem key={country.code} value={country.name}>
                  {country.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="city"
              label="City"
              name="city"
              select
              value={formData.city || ''}
              onChange={handleFormChange}
              sx={{ flex: '1 1 30%' }}
            >
              {(cities[formData.country] || []).map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="password"
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password || ''}
              onChange={handleFormChange}
              sx={{ flex: '1 1 30%' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleFormChange}
              sx={{ flex: '1 1 30%' }}
              InputProps={{
                startAdornment: <InputAdornment position="start">+92</InputAdornment>
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#6ea393', marginLeft: 2, '&:hover': { backgroundColor: '#5b887a' } }}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Delete Account
          </Typography>
          <Typography sx={{ mb: 2 }}>Delete your account and all of your source data. This is irreversible.</Typography>
          <Button variant="outlined" color="error" onClick={handleDeleteAccount}>
            Delete account
          </Button>
        </Box>
      </MainCard>
    </>
  );
}

export default Profile;
