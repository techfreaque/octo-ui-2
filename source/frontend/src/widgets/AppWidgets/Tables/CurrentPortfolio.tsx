import { Chip } from "@mui/material";
import { useEffect } from "react";
import ReactTables from "../../../components/Tables/ReactTables";
import {
  useBotPortfolioContext,
  useFetchBotPortfolio,
} from "../../../context/data/BotPortfolioProvider";

export default function CurrentPortfolioTable() {
  const fetchBotPortfolio = useFetchBotPortfolio();
  const botPortfolio = useBotPortfolioContext();
  useEffect(() => {
    fetchBotPortfolio();
  }, [fetchBotPortfolio]);

  if (botPortfolio?.displayed_portfolio_value) {
    const currentHoldings: {
      id: number;
      asset: string;
      total: number;
      available: number;
      lockedIn: number;
      valueIn: number;
    }[] = [];
    Object.keys(botPortfolio.displayed_portfolio).forEach((symbol, id) => {
      currentHoldings.push({
        id,
        asset: symbol,
        total: botPortfolio.displayed_portfolio[symbol].total,
        available: botPortfolio.displayed_portfolio[symbol].free,
        lockedIn: botPortfolio.displayed_portfolio[symbol].locked,
        valueIn: botPortfolio.symbols_values[symbol],
      });
    });

    return (
      <div>
        <h2>
          <Chip
            label={`${
              botPortfolio.has_real_trader
                ? "Real Trading Portfolio:"
                : "Simulated Trading Portfolio:"
            } ${botPortfolio.displayed_portfolio_value} ${
              botPortfolio.reference_unit
            }`}
            color="primary"
            variant="outlined"
          />
        </h2>
        <ReactTables
          nodes={currentHoldings}
          cells={[
            { title: "Asset", key: "asset" },
            { title: "Total", key: "total" },
            {
              title: `Value in ${botPortfolio.reference_unit}`,
              key: "valueIn",
            },
            { title: "Available", key: "available" },
            { title: "Locked in orders", key: "lockedIn" },
          ]}
        />
      </div>
    );
  }
}
