import { createContext, useState, useEffect } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const backendUrl = "http://localhost:4000";

  const [token, setToken] = useState("");

  const contextValue = {
    backendUrl,
    token,
    setToken,
  }

  useEffect(() => {
    setToken(localStorage.getItem("adminToken") || "");
  }, [token])

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  )
}


export default StoreContextProvider;
