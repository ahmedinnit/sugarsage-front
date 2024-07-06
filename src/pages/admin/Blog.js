import React, { useState, useEffect } from 'react';
import {
  Typography,
  IconButton,
  Card,
  CardContent,
  TextField,
  Button,
  DialogActions,
  Alert,
  DialogTitle,
  Dialog,
  Snackbar,
  DialogContent,
  Box,
  CircularProgress
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

function Blog() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    blog_author: '',
    blog_title: '',
    blog_description: '',
    source_url: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('${process.env.}/api/admin/blog/getall', {
        headers: {
          Authorization: `${token}`
        }
      });
      setData(response.data.data);
    } catch (error) {
      console.error('There was an error fetching the Blogs!', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClickOpen = (blog = null) => {
    if (blog) {
      setFormData({
        blog_author: blog.blog_author,
        blog_title: blog.blog_title,
        blog_description: blog.blog_description,
        source_url: blog.source_url
      });
      setImage(blog.image || null);
      setIsEditing(true);
      setCurrentBlogId(blog.blog_id);
    } else {
      setFormData({
        blog_author: '',
        blog_title: '',
        blog_description: '',
        source_url: ''
      });
      setImage(null);
      setIsEditing(false);
      setCurrentBlogId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      blog_author: '',
      blog_title: '',
      blog_description: '',
      source_url: ''
    });
    setImage(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = async () => {
    setLoading(true); // Set loading to true when the request starts
    try {
      let imageUrl = image;
      if (image && typeof image !== 'string') {
        const imageFormData = new FormData();
        imageFormData.append('file', image);
        imageFormData.append('upload_preset', 'nqmfgirq'); // Replace with your upload preset

        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/dqem8pi4b/image/upload', // Replace with your cloud name
          imageFormData
        );
        imageUrl = res.data.secure_url;
      }

      const blogFormData = new FormData();
      blogFormData.append('blog_author', formData.blog_author);
      blogFormData.append('blog_title', formData.blog_title);
      blogFormData.append('blog_description', formData.blog_description);
      blogFormData.append('source_url', formData.source_url);
      blogFormData.append('image', imageUrl);

      const apiEndpoint = isEditing
        ? `${process.env.REACT_APP_BACKEND_URL}/api/admin/blog/update/${currentBlogId}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/admin/blog/add`;

      console.log('Is Editing:', isEditing);
      const requestMethod = isEditing ? axios.put : axios.post;
      const token = localStorage.getItem('token');

      console.log('Blog Author:', formData.blog_author);
      console.log('Blog Title:', formData.blog_title);
      console.log('Blog Description:', formData.blog_description);
      console.log('Source URL:', formData.source_url);
      console.log('Image URL:', imageUrl);
      const response = await requestMethod(apiEndpoint, blogFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`
        }
      });

      console.log('Blog added/updated successfully:', response.data);
      fetchData();
      handleClose();
      setSnackbarMessage('Blog added/updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('There was an error adding/updating the blog post!', error);
      setSnackbarMessage('Failed to add/update blog');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false); // Set loading to false when the request finishes
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const onDrop = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
    setFormData({
      ...formData,
      image: acceptedFiles[0].name
    });
  };

  const removeImage = () => {
    setImage(null);
    setFormData({
      ...formData,
      image: ''
    });
  };

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    }
  });

  // Handle rejected files
  useEffect(() => {
    if (fileRejections.length > 0) {
      fileRejections.forEach((rejection) => {
        rejection.errors.forEach((err) => {
          console.error(`Error code ${err.code}: ${err.message}`);
          setSnackbarMessage(`File rejected: ${err.message}`);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        });
      });
    }
  }, [fileRejections]);

  const blogCols = [
    {
      accessorKey: 'blog_id',
      header: 'Blog ID',
      enableSorting: true,
      enableColumnFilter: false,
      minWidth: 50,
      width: 50,
      maxWidth: 50
    },
    {
      accessorKey: 'blog_author',
      header: 'Author',
      enableSorting: true,
      enableColumnFilter: false,
      minWidth: 50,
      width: 50,
      maxWidth: 50
    },
    {
      accessorKey: 'blog_title',
      header: 'Title',
      enableSorting: false,
      enableColumnFilter: true,
      minWidth: 50,
      width: 50,
      maxWidth: 50
    },
    {
      accessorKey: 'blog_description',
      header: 'Description',
      enableSorting: false,
      enableColumnFilter: true,
      minWidth: 50,
      width: 50,
      maxWidth: 50,
      Cell: ({ row }) => {
        const maxChar = 50; // Set maximum character limit
        const desc = row.original.blog_description || '';
        return <Typography>{desc.length > maxChar ? `${desc.substring(0, maxChar)}...` : desc}</Typography>;
      }
    },
    {
      accessorKey: 'source_url',
      header: 'Source',
      enableSorting: true,
      enableColumnFilter: true,
      minWidth: 50,
      width: 50,
      maxWidth: 50,
      Cell: ({ row }) => {
        const maxChar = 25; // Set maximum character limit
        const desc = row.original.source_url || '';
        return <Typography>{desc.length > maxChar ? `${desc.substring(0, maxChar)}...` : desc}</Typography>;
      }
    },
    // {
    //   accessorKey: 'image',
    //   header: 'Image',
    //   enableSorting: true,
    //   enableColumnFilter: true,
    //   minWidth: 50,
    //   width: 50,
    //   maxWidth: 50,
    //   Cell: ({ row }) => {
    //     const maxChar = 25; // Set maximum character limit
    //     const desc = row.original.image || '';
    //     return <Typography>{desc.length > maxChar ? `${desc.substring(0, maxChar)}...` : desc}</Typography>;
    //   }
    // },
    {
      accessorKey: 'action',
      header: 'Action',
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <div style={{ display: 'flex' }}>
          <IconButton aria-label="view" onClick={() => handleView(row.original)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton aria-label="edit" onClick={() => handleClickOpen(row.original)}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => handleDeleteClick(row.original)}>
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
      <>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#6ea393', marginLeft: 2, '&:hover': { backgroundColor: '#5b887a' } }}
          onClick={() => handleClickOpen(null)}
        >
          Add Blog
        </Button>
        {/* <IconButton aria-label="refresh" onClick={fetchData}>
          <RefreshIcon />
        </IconButton> */}
      </>
    )
  };

  const handleView = (rowIndex) => {
    // Implement your view logic here
    console.log('View row:', rowIndex);
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setBlogToDelete(null);
  };

  const handleDeleteConfirm = () => {
    const token = localStorage.getItem('token');
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/blog/delete/${blogToDelete.blog_id}`, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then((response) => {
        console.log('Blog deleted successfully:', response.data);
        fetchData();
        handleDeleteClose();
        setSnackbarMessage('Blog deleted successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error('There was an error deleting the blog!', error);
        setSnackbarMessage('Failed to delete blog');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  return (
    <>
      <div className="mb-5 ml-1">
        <Typography variant="h2" className="font-roboto">
          Blogs Table
        </Typography>
      </div>

      <Card style={{ boxShadow: '2', maxWidth: '1211px' }}>
        <CardContent style={{ padding: 0 }}>
          <div style={{ overflowX: 'hidden', maxWidth: '1211px' }}>
            <MaterialReactTable columns={blogCols} data={data} {...options} />
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ paddingLeft: 3.2, paddingTop: 4, paddingBottom: 3 }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{isEditing ? 'Edit Blog' : 'Add Blog'}</Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            <TextField
              label="Author"
              name="blog_author"
              value={formData.blog_author || ''}
              onChange={handleFormChange}
              sx={{ flex: '1 1 45%' }}
            />
            <TextField
              label="Title"
              name="blog_title"
              value={formData.blog_title || ''}
              onChange={handleFormChange}
              sx={{ flex: '1 1 45%' }}
            />
            <TextField
              label="Description"
              name="blog_description"
              value={formData.blog_description || ''}
              onChange={handleFormChange}
              sx={{ flex: '1 1 45%' }}
            />
            <TextField
              label="Source URL"
              name="source_url"
              value={formData.source_url || ''}
              onChange={handleFormChange}
              sx={{ flex: '1 1 45%' }}
            />
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 1,
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                flex: '1 1 100%',
                mt: 2
              }}
            >
              <input {...getInputProps()} />
              {image ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <Typography>{typeof image === 'string' ? image : image.name}</Typography>
                  <IconButton onClick={removeImage}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CloudUploadIcon sx={{ fontSize: 48, mb: 1 }} />
                  <Typography>Drop image here or click to browse through your machine</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'center', pb: 2.5 }}>
          <Button
            variant="contained"
            onClick={handleFormSubmit}
            sx={{
              backgroundColor: '#6ea393',
              '&:hover': {
                backgroundColor: '#5b887a'
              }
            }}
            // disabled={loading}
          >
            {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Submit'}
          </Button>
          <Button variant="contained" onClick={handleClose} sx={{ backgroundColor: '#c36b6a', '&:hover': { backgroundColor: '#a95a5a' } }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem', pt: 1 }}>Confirm Delete</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this Blog?</Typography>
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

export default Blog;
