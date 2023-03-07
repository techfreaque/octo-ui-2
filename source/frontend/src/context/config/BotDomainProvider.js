import React, { useState, useContext, createContext } from "react";

const BotDomainContext = createContext();
const UpdateBotDomainContext = createContext();

export const useBotDomainContext = () => {
  return useContext(BotDomainContext);
};

export const useUpdateBotDomainContext = () => {
  return useContext(UpdateBotDomainContext);
};

export function getIsProduction() {
  return process.env.NODE_ENV !== "development";
}

export const BotDomainProvider = ({ children }) => {
  const isProduction = getIsProduction()
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
