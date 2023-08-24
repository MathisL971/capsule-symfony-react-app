import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import store from "../reducers/main";
import { Provider } from "react-redux";

import ChatApp from "./Chat/ChatApp";
import LoginForm from "./Forms/LoginForm/LoginForm";
import SignupForm from "./Forms/SignupForm/SignupForm";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/ado/messages" element={<ChatApp />} />
          <Route path="/parent/messages" element={<ChatApp />} />
          <Route path="/pro/messages" element={<ChatApp />} />
          <Route path="/admin/messages" element={<ChatApp />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
