import React, { useState, useContext, createContext } from "react";

const BotDomainContext = createContext();
const UpdateBotDomainContext = createContext();

export const useBotDomainContext = () => {
  return useContext(BotDomainContext);
};

export const useUpdateBotDomainContext = () => {
  return useContext(UpdateBotDomainContext);
};

export const BotDomainProvider = ({ children }) => {
  const isProduction = process.env.NODE_ENV !== "development";
  const [botDomain, setBotDomain] = useState(
    isProduction ? window.location.origin : process.env.REACT_APP_DEVELOPMENT_BOT_DOMAIN
  );
  return (
    <BotDomainContext.Provider value={botDomain}>
      <UpdateBotDomainContext.Provider value={setBotDomain}>
        {children}
      </UpdateBotDomainContext.Provider>
    </BotDomainContext.Provider>
  );
};
