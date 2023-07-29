const initialState = {
  connection: null,
  error: null,
};

const socketReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET":
      return {
        connection: action.payload,
        error: null,
      };
    case "RESET":
      return {
        connection: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default socketReducer;
