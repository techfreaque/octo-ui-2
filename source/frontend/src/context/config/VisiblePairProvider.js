import React, { useState, useContext, createContext } from "react";

const VisiblePairsContext = createContext();
const UpdateVisiblePairsContext = createContext();

export const useVisiblePairsContext = () => {
  return useContext(VisiblePairsContext);
};

export const useUpdateVisiblePairsContext = () => {
  return useContext(UpdateVisiblePairsContext);
};

export const VisiblePairsProvider = ({ children }) => {
  const [visiblePairs, setVisiblePairs] = useState();
  return (
    <VisiblePairsContext.Provider value={visiblePairs}>
      <UpdateVisiblePairsContext.Provider value={setVisiblePairs}>
        {children}
      </UpdateVisiblePairsContext.Provider>
    </VisiblePairsContext.Provider>
  );
};
