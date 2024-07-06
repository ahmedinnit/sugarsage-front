import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Routes from 'routes/index';
import ThemeCustomization from 'themes';
import { useDispatch } from 'react-redux';
import { activeItem } from 'store/reducers/menu';
// import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token); // Correct function usage
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.clear(); // Clear storage
        dispatch(activeItem({ openItem: ['dashboard'] }));
        navigate('/login'); // Redirect to login
      }
    }
  }, [navigate]);

  return (
    <ThemeCustomization>
      {/* <ScrollTop> */}
      <Routes />
      {/* </ScrollTop> */}
    </ThemeCustomization>
  );
};

export default App;
