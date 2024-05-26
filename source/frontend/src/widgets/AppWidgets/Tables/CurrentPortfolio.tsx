import { ReloadOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import { useEffect, useState } from "react";

import AntButton, {
  buttonTypes,
  buttonVariants,
} from "../../../components/Buttons/AntButton";
import type {
  AntTableColumnType,
  AntTableDataType,
} from "../../../components/Tables/AntTable";
import AntTable from "../../../components/Tables/AntTable";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import {
  useBotPortfolioContext,
  useFetchBotPortfolio,
} from "../../../context/data/BotPortfolioProvider";
import { objectEntries } from "../../../helpers/helpers";

export default function CurrentPortfolioTable() {
  const [isDoneLoading, setIsDoneLoading] = useState<boolean>(true);
  const fetchBotPortfolio = useFetchBotPortfolio();
  const botPortfolio = useBotPortfolioContext();
  const botColors = useBotColorsContext();
  useEffect(() => {
    fetchBotPortfolio();
  }, [fetchBotPortfolio]);

  if (botPortfolio?.displayed_portfolio_value) {
    const currentHoldings: PortfolioTableDataType[] = [];
    objectEntries(botPortfolio.displayed_portfolio).forEach(
      ([symbol, symbolPortfolio]) => {
        currentHoldings.push({
          id: `${symbol}`,
          key: `${symbol}`,
          asset: `${symbol}`,
          total: symbolPortfolio.total,
          available: symbolPortfolio.free,
          lockedIn: symbolPortfolio.locked,
          valueIn: botPortfolio.symbols_values[symbol],
        });
      }
    );

    return (
      <div>
        <AntTable<PortfolioTableDataType, PortfolioTableColumnType>
          data={currentHoldings}
          columns={getColumns(botPortfolio.reference_unit)}
          maxWidth="100%"
          header={
            <>
              <AntButton
                antIconComponent={ReloadOutlined}
                colorType={
                  isDoneLoading ? buttonTypes.fontActive : buttonTypes.font
                }
                buttonVariant={buttonVariants.text}
                onClick={() => {
                  setIsDoneLoading(false);
                  fetchBotPortfolio(setIsDoneLoading, true);
                }}
                spin={!isDoneLoading}
              />
              <Tag
                style={{
                  color: botColors.fontActive,
                  fontSize: "130%",
                  padding: "5px",
                  cursor: "pointer",
                }}
                bordered={false}
              >
                {`${
                  botPortfolio.has_real_trader
                    ? "Real Trading Portfolio:"
                    : "Simulated Trading Portfolio:"
                } ${botPortfolio.displayed_portfolio_value} ${
                  botPortfolio.reference_unit
                }`}
              </Tag>
            </>
          }
        />
      </div>
    );
  }
  return <></>;
}

function getColumns(referenceUnit: string): PortfolioTableColumnType[] {
  return [
    {
      title: "Asset",
      key: "asset",
      dataIndex: "asset",
      dsorter: "string",
    },
    {
      title: "Total",
      key: "total",
      dataIndex: "total",
      dsorter: "number",
      disableSearch: true,
    },
    {
      title: `Value in ${referenceUnit}`,
      key: "valueIn",
      dataIndex: "valueIn",
      dsorter: "number",
      disableSearch: true,
    },
    {
      title: "Available",
      key: "available",
      dataIndex: "available",
      dsorter: "number",
      disableSearch: true,
    },
    {
      title: "Locked in orders",
      key: "lockedIn",
      dataIndex: "lockedIn",
      dsorter: "number",
      disableSearch: true,
    },
  ];
}

interface PortfolioTableDataType extends AntTableDataType {
  asset: string;
  total: number;
  available: number;
  lockedIn: number;
  valueIn: number | undefined;
}
type PortfolioTableColumnType = AntTableColumnType<PortfolioTableDataType>;
