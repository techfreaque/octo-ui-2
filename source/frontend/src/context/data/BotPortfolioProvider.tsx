import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";
import { createContext, useContext } from "react";

import { fetchBotPortfolio } from "../../api/data";
import { emptyValueFunction } from "../../helpers/helpers";
import { useBotDomainContext } from "../config/BotDomainProvider";

export interface PortfolioType {
  displayed_portfolio_value: number;
  displayed_portfolio: {
    [symbol: string]: {
      total: number;
      free: number;
      locked: number;
    };
  };
  symbols_values: {
    [symbol: string]: number;
  };
  has_real_trader: boolean;
  reference_unit: string;
}

const BotPortfolioContext = createContext<PortfolioType | undefined>(undefined);
const UpdateBotPortfolioContext =
  createContext<Dispatch<SetStateAction<PortfolioType | undefined>>>(
    emptyValueFunction,
  );

export const useSaveBotPortfolioContext = () => {
  return useContext(UpdateBotPortfolioContext);
};

export const useBotPortfolioContext = () => {
  return useContext(BotPortfolioContext);
};

export const useFetchBotPortfolio = () => {
  const _saveBotPortfolio = useSaveBotPortfolioContext();
  const botDomain = useBotDomainContext();
  return useCallback(
    (
      setIsFinished?: Dispatch<SetStateAction<boolean>>,
      successNotification?: boolean,
    ) => {
      fetchBotPortfolio(
        _saveBotPortfolio,
        botDomain,
        setIsFinished,
        successNotification,
      );
    },
    [_saveBotPortfolio, botDomain],
  );
};

export const BotPortfolioProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [botPortfolio, setBotPortfolio] = useState<PortfolioType | undefined>(
    undefined,
  );
  return (
    <BotPortfolioContext.Provider value={botPortfolio}>
      <UpdateBotPortfolioContext.Provider value={setBotPortfolio}>
        {children}
      </UpdateBotPortfolioContext.Provider>
    </BotPortfolioContext.Provider>
  );
};
