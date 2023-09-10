import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import store from "../reducers/main";
import { Provider } from "react-redux";

import ChatApp from "./Chat/ChatApp";
import LoginForm from "./Forms/Login/LoginForm";
import SignupForm from "./Forms/SignUp/SignupForm";
import Subscription from "./Forms/Payment/Subscription";
import Completion from "./Forms/Payment/Completion";

const App = ({ userObj, userRole }) => {
  const user = JSON.parse(userObj);
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<LoginForm user={user} role={userRole} />}
          />
          <Route
            path="/signup"
            element={<SignupForm user={user} role={userRole} />}
          />
          <Route
            path="/subscription"
            element={<Subscription user={user} role={userRole} />}
          />
          <Route
            path="/completion"
            element={<Completion user={user} role={userRole} />}
          />
          <Route
            path="/ado/messages"
            element={<ChatApp user={user} role={userRole} />}
          />
          <Route
            path="/parent/messages"
            element={<ChatApp user={user} role={userRole} />}
          />
          <Route
            path="/pro/messages"
            element={<ChatApp user={user} role={userRole} />}
          />
          <Route
            path="/admin/messages"
            element={<ChatApp user={user} role={userRole} />}
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
