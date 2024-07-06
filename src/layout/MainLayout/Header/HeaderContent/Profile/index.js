import { useRef, useState } from 'react';
// import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, CardContent, ClickAwayListener, Grid, Paper, Popper, Stack, Typography, Button } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import LogoutDialog from 'components/LogoutMessage'; // Ensure this path is correct

// assets
import { LogoutOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const theme = useTheme();
  // const navigate = useNavigate();

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  // Get the profile picture URL from localStorage
  const profilePicture = localStorage.getItem('pp');

  // const handleLogout = async () => {
  //   // Handle logout
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('username');
  //   localStorage.removeItem('role');
  //   localStorage.removeItem('id');
  //   navigate('/login');
  // };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleLogoutConfirmation = () => {
    setOpenLogoutDialog(false);
    // if (confirm) {
    //   handleLogout();
    // }
  };

  const iconBackColorOpen = 'grey.300';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' }
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
          <Avatar alt="profile user" src={profilePicture} sx={{ width: 32, height: 32 }} />
          <Typography variant="subtitle1">{localStorage.getItem('username')}</Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open && (
              <Paper
                sx={{
                  boxShadow: theme.customShadows.z1,
                  width: 290,
                  minWidth: 240,
                  maxWidth: 290,
                  [theme.breakpoints.down('md')]: {
                    maxWidth: 250
                  }
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard elevation={0} border={false} content={false}>
                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Avatar alt="profile user" src={profilePicture} sx={{ width: 32, height: 32 }} />
                            <Stack>
                              <Typography variant="h6">{localStorage.getItem('username')}</Typography>
                              <Typography variant="body2" color="textSecondary" className="capitalize">
                                {localStorage.getItem('role') + ' # ' + localStorage.getItem('id')}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardContent sx={{ px: 2.5, pb: 3 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<LogoutOutlined />}
                        onClick={handleLogoutClick}
                        sx={{
                          color: theme.palette.grey[700],
                          borderColor: theme.palette.grey[300],
                          '&:hover': {
                            backgroundColor: theme.palette.grey[100],
                            borderColor: theme.palette.grey[400]
                          },
                          '& .MuiButton-startIcon': {
                            color: theme.palette.grey[700]
                          }
                        }}
                      >
                        Logout
                      </Button>
                    </CardContent>
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper>
      <LogoutDialog open={openLogoutDialog} handleClose={handleLogoutConfirmation} />
    </Box>
  );
};

export default Profile;
