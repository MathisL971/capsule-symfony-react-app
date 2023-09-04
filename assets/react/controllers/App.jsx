import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import store from "../reducers/main";
import { Provider } from "react-redux";

import { ThemeProvider } from "styled-components";

import ChatApp from "./Chat/ChatApp";
import LoginForm from "./Forms/LoginForm/LoginForm";
import SignupForm from "./Forms/SignupForm/SignupForm";

import theme from "./theme";

const App = ({ userObj, userRole }) => {
  const user = JSON.parse(userObj);
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </Provider>
  );
};

export default App;
