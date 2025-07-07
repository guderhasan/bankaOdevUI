import { createContext, useState } from "react";
import AccountCreate from "./AccountCreate";
import Transfer from "./Transfer";

export const Context = createContext("602ac65b-43d2-4e10-9120-af99b300bf48");
export const ContextAccountNumber = createContext("45345345345");

function GlobalContext() {
  const [id] = useState("602ac65b-43d2-4e10-9120-af99b300bf48");
  const [accountNumber] = useState("45345345345");

  return (
    <>
      <Context.Provider value={id}>
        <AccountCreate />
      </Context.Provider>
      <Context.Provider value={accountNumber}>
        <Transfer />
      </Context.Provider>
    </>
  );
}
export default GlobalContext;
