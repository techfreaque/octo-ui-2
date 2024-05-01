/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from "react";
import {
  useCurrentCurrencyListContext,
  useExchangeInfoContext,
  useFetchExchangeInfo,
  useHandleSettingChange,
  useUnsavedCurrencyListContext,
} from "../../../context/data/BotExchangeInfoProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { useUpdateVisibleExchangesContext } from "../../../context/config/VisibleExchangesProvider";
import {
  useUpdateVisiblePairsContext,
  useVisiblePairsContext,
} from "../../../context/config/VisiblePairProvider";
import { useVisibleExchangesContext } from "../../../context/config/VisibleExchangesProvider";
import "./pairsTable.css";
import AntTable, {
  AntTableColumnType,
  AntTableDataType,
  AntTableFiltersType,
  AntTableSorterType,
} from "../../../components/Tables/AntTable";
import EnablerSwitch from "../../../components/UserInputs/EnablerSwich";

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
    <AntTable
      onFilterChange={filterData}
      columns={(columns as unknown) as AntTableColumnType<AntTableDataType>[]}
      data={preSorteddata}
    />
  );
}

interface PairsTableDataType extends AntTableDataType {
  symbol: string;
  enabled: boolean;
  availableAfterRestart: boolean;
  exchange: string;
}
interface PairsTableColumnType extends AntTableColumnType<PairsTableDataType> {}

const columns: PairsTableColumnType[] = [
  {
    title: "Symbol",
    dataIndex: "symbolLabel",
    key: "symbol",
    width: "40%",
    sorter: (a: PairsTableDataType, b: PairsTableDataType) =>
      a.symbol.localeCompare(b.symbol),
    sortDirections: ["descend", "ascend"],
    searchColumnKey: "symbol",

    // (value: Key | boolean, record: RecordType) => boolean
  },
  {
    title: "Exchange",
    dataIndex: "exchange",
    width: "40%",
    key: "exchange",
    // ...getColumnSearchProps('exchange'),
    sorter: (a, b) => a.exchange.localeCompare(b.exchange),
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
    // ... getColumnSearchProps('enabledLabel'),
    sorter: (a, b) =>
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
  exchangeInfo;
  currentCurrencyList;
  unsavedCurrencyList;
  visibleExchanges;
  visiblePairs;
  handlePairSelection;
  handleSettingChange;
}): PairsTableDataType[] {
  const preSorteddata: PairsTableDataType[] = [];
  const enabledExchanges =
    exchangeInfo?.symbols_by_exchanges &&
    Object.keys(exchangeInfo.symbols_by_exchanges);
  enabledExchanges?.forEach((exchange) => {
    exchangeInfo?.symbols_by_exchanges?.[exchange]?.forEach((symbol) => {
      const isEnabled = currentCurrencyList.includes(symbol);
      const isSelected =
        visibleExchanges === exchange &&
        visiblePairs === symbol.replace("/", "|");
      const availableAfterRestart =
        unsavedCurrencyList.includes(symbol) && !isEnabled;

      preSorteddata.push({
        key: `${symbol}${exchange}`,
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
            exchange={exchange}
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
  exchange,
  symbol,
  isEnabled,
  handleSettingChange,
}: {
  availableAfterRestart;
  unsavedCurrencyList;
  exchange: string;
  symbol: string;
  isEnabled: boolean;
  handleSettingChange;
}) {
  const disabledAfterRestart =
    !unsavedCurrencyList.includes(symbol) && isEnabled;
  return (
    <EnablerSwitch
      availableAfterRestart={availableAfterRestart}
      title={symbol}
      isEnabled={isEnabled}
      disabledAfterRestart={disabledAfterRestart}
      onChange={(event) => handleSettingChange(event, exchange, symbol)}
    />
  );
}

function filterData(
  tableParams:
    | {
        filters: AntTableFiltersType;
        sorter: AntTableSorterType<PairsTableDataType>;
      }
    | undefined,
  data: PairsTableDataType[]
): PairsTableDataType[] {
  return (data as PairsTableDataType[]).filter((item) => {
    if (
      tableParams?.filters?.symbol?.every((symbol) => {
        return !item.symbol
          .replace("/", "")
          .replace(":", "")
          .toLowerCase()
          .includes(
            (symbol as string).replace("/", "").replace(":", "").toLowerCase()
          );
      })
    ) {
      return false;
    }
    if (
      tableParams?.filters?.exchange?.every(
        (exchange) => item.exchange !== exchange
      )
    ) {
      return false;
    }
    if (
      tableParams?.filters?.enabled &&
      !tableParams?.filters?.enabled?.includes(item.enabled)
    ) {
      return false;
    }
    return true;
  });
}
