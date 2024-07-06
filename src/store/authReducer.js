const initialState = {
  isAuthenticated: false,
  user: {},
  token: ''
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        role: action.payload.user.role,
        token: action.payload.token
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
