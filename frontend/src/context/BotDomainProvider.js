import { useState, useContext, createContext } from "react";

const BotDomainContext = createContext();
const UpdateBotDomainContext = createContext();

export const useBotDomainContext = () => {
  return useContext(BotDomainContext);
};

export const useUpdateBotDomainContext = () => {
  return useContext(UpdateBotDomainContext);
};

export const BotDomainProvider = ({ defaultDomain, children }) => {
  const [botDomain, setBotDomain] = useState(defaultDomain);
  return (
    <BotDomainContext.Provider value={botDomain}>
      <UpdateBotDomainContext.Provider value={setBotDomain}>
        {children}
      </UpdateBotDomainContext.Provider>
    </BotDomainContext.Provider>
  );
};
