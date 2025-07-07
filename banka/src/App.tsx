import React from "react";
import { Route, Routes } from "react-router";
import UserRegister from "./pages/UserRegister";
import AccountCreate from "./pages/AccountCreate";
import Accounts from "./pages/Accounts";
import Transfer from "./pages/Transfer";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Transfer />} />
    </Routes>
  );
};

export default App;
