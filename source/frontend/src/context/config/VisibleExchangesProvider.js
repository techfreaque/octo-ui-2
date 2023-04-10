import React, { useState, useContext, createContext } from "react";

const VisibleExchangesContext = createContext();
const UpdateVisibleExchangesContext = createContext();

export const useVisibleExchangesContext = () => {
  return useContext(VisibleExchangesContext);
};

export const useUpdateVisibleExchangesContext = () => {
  return useContext(UpdateVisibleExchangesContext);
};

export const VisibleExchangesProvider = ({ children }) => {
  const [visibleExchanges, setVisibleExchanges] = useState();
  return (
    <VisibleExchangesContext.Provider value={visibleExchanges}>
      <UpdateVisibleExchangesContext.Provider value={setVisibleExchanges}>
        {children}
      </UpdateVisibleExchangesContext.Provider>
    </VisibleExchangesContext.Provider>
  );
};
