import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import conversationsReducer from "./conversations";
import connectionsReducer from "./connections";
import userReducer from "./user";
import socketReducer from "./socket";

const mainReducer = combineReducers({
  conversations: conversationsReducer,
  connections: connectionsReducer,
  user: userReducer,
  socket: socketReducer,
});

const store = createStore(mainReducer, applyMiddleware(thunk));

export default store;
