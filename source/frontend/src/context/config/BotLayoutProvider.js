import React, { useState, useContext, createContext } from "react";
import { defaultBotTemplate } from "../../constants/LayoutTemplate";

const BotLayoutContext = createContext();
const UpdateBotLayoutContext = createContext();
const UiDimensionsContext = createContext();
const UpdateUiDimensionsContext = createContext();

export const useBotLayoutContext = () => {
  return useContext(BotLayoutContext);
};
export const useUpdateBotLayoutContext = () => {
  return useContext(UpdateBotLayoutContext);
};
export const useUiDimensionsContext = () => {
  return useContext(UiDimensionsContext);
};
export const useUpdateUiDimensionsContext = () => {
  return useContext(UpdateUiDimensionsContext);
};

export const BotLayoutProvider = ({ children }) => {
  const [botLayout, setBotLayout] = useState(defaultBotTemplate);
  const [uiDimensions, setUiDimensions] = useState({
    header: 50,
    main: window.innerHeight - 100,
    footer: 50,
  });
  return (
    <BotLayoutContext.Provider value={botLayout}>
      <UpdateBotLayoutContext.Provider value={setBotLayout}>
        <UiDimensionsContext.Provider value={uiDimensions}>
          <UpdateUiDimensionsContext.Provider value={setUiDimensions}>
            {children}
          </UpdateUiDimensionsContext.Provider>
        </UiDimensionsContext.Provider>
      </UpdateBotLayoutContext.Provider>
    </BotLayoutContext.Provider>
  );
};
