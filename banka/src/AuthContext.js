import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userName, setUserName] = useState(null);
  //dummy data (Oturum açan user bilgilerinden de alabiliyorum)
  const [userId, setUserId] = useState("7d2f6407-d336-459b-8fe5-07c9c5e016ae");

  const logout = () => {
    setUserName(null);
    setUserId(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ userName, userId, setUserId, setUserName, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
