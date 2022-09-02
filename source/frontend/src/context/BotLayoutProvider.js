import React, { useState, useContext, createContext } from "react";
import { defaultBotTemplate } from "../constants/LayoutTemplate";

const BotLayoutContext = createContext();
const UpdateBotLayoutContext = createContext();

export const useBotLayoutContext = () => {
  return useContext(BotLayoutContext);
};

export const useUpdateBotLayoutContext = () => {
  return useContext(UpdateBotLayoutContext);
};

export const BotLayoutProvider = ({children }) => {
  const [botLayout, setBotLayout] = useState(defaultBotTemplate);
  return (
    <BotLayoutContext.Provider value={botLayout}>
      <UpdateBotLayoutContext.Provider value={setBotLayout}>
        {children}
      </UpdateBotLayoutContext.Provider>
    </BotLayoutContext.Provider>
  );
};
