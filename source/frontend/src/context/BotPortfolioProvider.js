import React, { useState, useContext, createContext } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { fetchBotPortfolio } from "../api/botData";
import { useBotDomainContext } from "./BotDomainProvider";

const BotPortfolioContext = createContext();
const UpdateBotPortfolioContext = createContext();

export const useSaveBotPortfolioContext = () => {
  return useContext(UpdateBotPortfolioContext);
};

export const useBotPortfolioContext = () => {
  return useContext(BotPortfolioContext);
};

export const useFetchBotPortfolio = () => {
  const _saveBotPortfolio = useSaveBotPortfolioContext();
  const botDomain = useBotDomainContext();
  const logic = useCallback(() => {
    fetchBotPortfolio(_saveBotPortfolio, botDomain);
  }, [_saveBotPortfolio, botDomain]);
  return logic;
};

export const BotPortfolioProvider = ({ children }) => {
  const [botPortfolio, setBotPortfolio] = useState({});
  const botDomain = useBotDomainContext();
  useEffect(() => {
    fetchBotPortfolio(setBotPortfolio, botDomain);
  }, [botDomain]);
  return (
    <BotPortfolioContext.Provider value={botPortfolio}>
      <UpdateBotPortfolioContext.Provider value={setBotPortfolio}>
        {children}
      </UpdateBotPortfolioContext.Provider>
    </BotPortfolioContext.Provider>
  );
};
