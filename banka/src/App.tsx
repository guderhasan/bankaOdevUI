import React from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import AccountCreate from "./pages/AccountCreate";
import Accounts from "./pages/Accounts";
import Transfer from "./pages/Transfer";
import UserRegister from "./pages/UserRegister";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/userRegister" element={<UserRegister />} />
      <Route path="/createAccount" element={<AccountCreate />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/transfer" element={<Transfer />} />
    </Routes>
  );
};

export default App;
