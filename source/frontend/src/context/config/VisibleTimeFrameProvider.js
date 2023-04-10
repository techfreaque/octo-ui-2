import React, { useState, useContext, createContext } from "react";

const VisibleTimeFramesContext = createContext();
const UpdateVisibleTimeFramesContext = createContext();

export const useVisibleTimeFramesContext = () => {
  return useContext(VisibleTimeFramesContext);
};

export const useUpdateVisibleTimeFramesContext = () => {
  return useContext(UpdateVisibleTimeFramesContext);
};

export const VisibleTimeFramesProvider = ({ children }) => {
  const [visibleTimeFrames, setVisibleTimeFrames] = useState();
  return (
    <VisibleTimeFramesContext.Provider value={visibleTimeFrames}>
      <UpdateVisibleTimeFramesContext.Provider value={setVisibleTimeFrames}>
        {children}
      </UpdateVisibleTimeFramesContext.Provider>
    </VisibleTimeFramesContext.Provider>
  );
};
