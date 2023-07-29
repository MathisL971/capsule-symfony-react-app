const initialState = {
  user: null,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload,
        error: null,
      };
    case "LOGOUT":
      return {
        user: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
