import {useState, useContext, createContext, } from "react";

const OptimizerEditorCounterContext = createContext();
const UpdateOptimizerEditorCounterContext = createContext();

export const useOptimizerEditorCounterContext = () => {
  return useContext(OptimizerEditorCounterContext);
};

export const useUpdateOptimizerEditorCounterContext = () => {
  return useContext(UpdateOptimizerEditorCounterContext);
};

export const OptimizerEditorProvider = ({ children }) => {
  const [optimizerEditorCounter, setOptimizerEditorCounter] = useState(0);
  return (
    <OptimizerEditorCounterContext.Provider value={optimizerEditorCounter}>
      <UpdateOptimizerEditorCounterContext.Provider value={setOptimizerEditorCounter}>
        {children}
      </UpdateOptimizerEditorCounterContext.Provider>
    </OptimizerEditorCounterContext.Provider>
  );
};
