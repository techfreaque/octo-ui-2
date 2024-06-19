import "./pairsTable.css";

import type { FilterValue } from "antd/es/table/interface";
import { useEffect } from "react";

import type {
  AntTableColumnType,
  AntTableDataType,
} from "../../../components/Tables/AntTable";
import AntTable from "../../../components/Tables/AntTable";
import EnablerSwitch from "../../../components/UserInputs/EnablerSwich";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { useUpdateVisibleExchangesContext } from "../../../context/config/VisibleExchangesProvider";
import { useVisibleExchangesContext } from "../../../context/config/VisibleExchangesProvider";
import {
  useUpdateVisiblePairsContext,
  useVisiblePairsContext,
} from "../../../context/config/VisiblePairProvider";
import type {
  CurrencyListType,
  ExchangeInfoType,
} from "../../../context/data/BotExchangeInfoProvider";
import {
  useCurrentCurrencyListContext,
  useExchangeInfoContext,
  useFetchExchangeInfo,
  useHandleSettingChange,
  useUnsavedCurrencyListContext,
} from "../../../context/data/BotExchangeInfoProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";

export default function PairsTable() {
  const isOnline = useIsBotOnlineContext();
  const botDomain = useBotDomainContext();
  const setVisibleExchanges = useUpdateVisibleExchangesContext();
  const visibleExchanges = useVisibleExchangesContext();
  const setVisiblePairs = useUpdateVisiblePairsContext();
  const visiblePairs = useVisiblePairsContext();
  const exchangeInfo = useExchangeInfoContext();
  const handleSettingChange = useHandleSettingChange();
  const currentCurrencyList = useCurrentCurrencyListContext();
  const unsavedCurrencyList = useUnsavedCurrencyListContext();
  function handlePairSelection(symbol: string, exchange: string) {
    setVisibleExchanges(exchange);
    setVisiblePairs(symbol.replace("/", "|"));
  }

  const fetchExchangeInfo = useFetchExchangeInfo();
  useEffect(() => {
    if (isOnline) {
      fetchExchangeInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline, botDomain]);

  const preSorteddata = getData({
    exchangeInfo,
    currentCurrencyList,
    unsavedCurrencyList,
    visibleExchanges,
    visiblePairs,
    handlePairSelection,
    handleSettingChange,
  });
  return (
    <AntTable<PairsTableDataType, PairsTableColumnType>
      columns={columns}
      data={preSorteddata}
      maxHeight="calc(100vh - 200px)"
    />
  );
}

interface PairsTableDataType extends AntTableDataType {
  symbol: string;
  symbolLabel: string | JSX.Element;
  enabled: boolean | undefined;
  enabledLabel: JSX.Element;
  selected: boolean | undefined;
  availableAfterRestart: boolean | undefined;
  exchange: string;
}
type PairsTableColumnType = AntTableColumnType<PairsTableDataType>;

const columns: PairsTableColumnType[] = [
  {
    title: "Symbol",
    dataIndex: "symbolLabel",
    key: "symbol",
    width: "40%",
    dsorter: "string",
    sortDirections: ["descend", "ascend"],
    dfilter: (
      item: PairsTableDataType,
      symbolValueFilter: FilterValue,
    ): boolean => {
      return item.symbol
        .replace("/", "")
        .replace(":", "")
        .toLowerCase()
        .includes(
          (symbolValueFilter[0] as string)
            .replace("/", "")
            .replace(":", "")
            .toLowerCase(),
        );
    },
  },
  {
    title: "Exchange",
    dataIndex: "exchange",
    width: "40%",
    key: "exchange",
    dsorter: "string",
    sortDirections: ["descend", "ascend"],

    // filters: enabledExchanges?.map(exchange => ({text: exchange, value: exchange}))
  },
  {
    title: "Enabled",
    dataIndex: "enabledLabel",
    key: "enabled",
    width: "20%",
    filters: [
      {
        text: "Disabled",
        value: false,
      },
      {
        text: "Enabled",
        value: true,
      },
    ],
    dsorter: (a, b) =>
      (a.enabled ? 1 : 0) - (b.enabled ? 1 : 0) ||
      (a.availableAfterRestart ? 1 : 0) - (b.availableAfterRestart ? 1 : 0),

    sortDirections: ["descend", "ascend"],
  },
];

function getData({
  exchangeInfo,
  currentCurrencyList,
  unsavedCurrencyList,
  visibleExchanges,
  visiblePairs,
  handlePairSelection,
  handleSettingChange,
}: {
  exchangeInfo: ExchangeInfoType | undefined;
  currentCurrencyList: CurrencyListType | undefined;
  unsavedCurrencyList: CurrencyListType | undefined;
  visibleExchanges: string | undefined;
  visiblePairs: string | undefined;
  handlePairSelection: (symbol: string, exchange: string) => void;
  handleSettingChange: (enabled: boolean, symbol: string) => void;
}): PairsTableDataType[] {
  const preSorteddata: PairsTableDataType[] = [];
  const enabledExchanges =
    exchangeInfo?.symbols_by_exchanges &&
    Object.keys(exchangeInfo.symbols_by_exchanges);
  enabledExchanges?.forEach((exchange) => {
    exchangeInfo?.symbols_by_exchanges?.[exchange]?.forEach((symbol) => {
      const isEnabled = currentCurrencyList?.includes(symbol);
      const isSelected =
        visibleExchanges === exchange &&
        visiblePairs === symbol.replace("/", "|");
      const availableAfterRestart =
        unsavedCurrencyList?.includes(symbol) && !isEnabled;

      preSorteddata.push({
        key: `${symbol}${exchange}`,
        id: `${symbol}${exchange}`,
        exchange,
        symbolLabel:
          isEnabled && !isSelected ? (
            <a href="#" onClick={() => handlePairSelection(symbol, exchange)}>
              {symbol}
            </a>
          ) : (
            symbol
          ),
        symbol,
        enabledLabel: (
          <SymbolEnabler
            unsavedCurrencyList={unsavedCurrencyList}
            symbol={symbol}
            availableAfterRestart={availableAfterRestart}
            isEnabled={isEnabled}
            handleSettingChange={handleSettingChange}
          />
        ),
        enabled: isEnabled,
        availableAfterRestart,
        selected: isSelected,
      });
    });
  });
  // pre sort by enabled and symbol
  preSorteddata.sort((a, b) => {
    return (
      (b?.enabled ? 1 : 0) - (a?.enabled ? 1 : 0) ||
      (a.symbol as string).localeCompare(b.symbol as string)
    );
  });
  return preSorteddata;
}

function SymbolEnabler({
  availableAfterRestart,
  unsavedCurrencyList,
  symbol,
  isEnabled,
  handleSettingChange,
}: {
  availableAfterRestart: boolean | undefined;
  unsavedCurrencyList: CurrencyListType | undefined;
  symbol: string;
  isEnabled: boolean | undefined;
  handleSettingChange: (enabled: boolean, symbol: string) => void;
}) {
  const disabledAfterRestart =
    !unsavedCurrencyList?.includes(symbol) && isEnabled;
  return (
    <EnablerSwitch
      availableAfterRestart={availableAfterRestart}
      title={symbol}
      isEnabled={isEnabled}
      disabledAfterRestart={disabledAfterRestart}
      onChange={(event) => handleSettingChange(event, symbol)}
    />
  );
}
