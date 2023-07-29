import connectionService from "../services/connections";

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
    const connections = await connectionService.getUserConnections(userId);
    dispatch({ type: "FETCH_SUCCESS", payload: connections });
  } catch (e) {
    dispatch({ type: "FAILURE", payload: e.message });
  }
};

export default connectionsReducer;
