import React from "react";
import { Route, Routes } from "react-router";
import { AuthProvider } from "./AuthContext";
import Home from "./pages/Home";
import AccountCreate from "./pages/AccountCreate";
import Accounts from "./pages/Accounts";
import Transfer from "./pages/Transfer";
import UserRegister from "./pages/UserRegister";
import Login from "./pages/Login";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userRegister" element={<UserRegister />} />
        <Route path="/createAccount" element={<AccountCreate />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
