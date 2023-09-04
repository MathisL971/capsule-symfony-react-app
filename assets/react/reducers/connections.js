import connectionService from "../services/connections";
import userService from "../services/user";

const initialState = {
  connections: [],
  error: null,
};

const connectionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        ...state,
        connections: state.connections.concat(action.payload),
        error: null,
      };
    case "FAILURE":
      return {
        ...state,
        connections: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const connectionFetchAction = (userId) => async (dispatch) => {
  try {
    const users = await userService.getAll();
    const actualUsers = users["hydra:member"].filter((u) => {
      return u.id !== userId;
    });
    dispatch({ type: "FETCH_SUCCESS", payload: actualUsers });
  } catch (e) {
    dispatch({ type: "FAILURE", payload: e.message });
  }
};

export default connectionsReducer;
