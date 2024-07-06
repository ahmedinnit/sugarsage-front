// third-party
import { configureStore } from '@reduxjs/toolkit';

// project import
import reducers from './reducers';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const store = configureStore({
  reducer: reducers
});

// const { dispatch } = store;

export { store };

// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import menuReducer from './reducers';
// // import authReducer from './authReducer';

// // ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

// const rootReducer = combineReducers({
//   // auth: authReducer,
//   reducer: menuReducer
// });

// const store = configureStore({
//   reducer: rootReducer
// });

// const { dispatch } = store;
// export { store, dispatch };
