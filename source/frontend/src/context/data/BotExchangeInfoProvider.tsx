import {
  useState,
  useContext,
  createContext,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { fetchExchangeInfo } from "../../api/data";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { useBotInfoContext } from "./BotInfoProvider";
import { updateConfig } from "../../api/actions";
import { parseSymbol } from "../../helpers/SymbolsUtil";
import { backendRoutes } from "../../constants/backendConstants";
import fetchAndStoreFromBot from "../../api/fetchAndStoreFromBot";

export type ExchangeConfigSettingNameType =
  | "api-key"
  | "api-password"
  | "api-secret"
  | "enabled"
  | "exchange-type"
  | "sandboxed";

export type ExchangeConfigType = {
  "api-key"?: string;
  "api-password"?: string;
  "api-secret"?: string;
  enabled?: boolean;
  "exchange-type"?: "spot" | "future";
  sandboxed?: boolean;
};
type ExchangesConfigType = {
  [exchange: string]: ExchangeConfigType;
};

export type ConfigSymbolsType = {
  [currency: string]: {
    enabled: boolean;
    pairs: string[];
  };
};

export type ExchangeInfoType = {
  config_exchanges: ExchangesConfigType;
  config_symbols: ConfigSymbolsType;
  symbols_by_exchanges: {
    [exchange: string]: string[];
  };
  currency_name_info: {
    [curency: string]: {
      n: string;
      s: string;
      i: string;
    };
  };
};

const ExchangeInfoContext = createContext<ExchangeInfoType | undefined>(
  undefined
);
const UpdateExchangeInfoContext = createContext<
  Dispatch<SetStateAction<ExchangeInfoType | undefined>>
>((_value) => {});

export type CurrencyListType = string[];

const UpdateToSaveCurrencySettingsContext = createContext<
  Dispatch<SetStateAction<ConfigSymbolsType | undefined>>
>((_value) => {});
const CurrentCurrencyListContext = createContext<CurrencyListType | undefined>(
  undefined
);
const UnsavedCurrencyListContext = createContext<CurrencyListType | undefined>(
  undefined
);

export interface PairSelectorMenuOpenType {
  open: boolean;
  wantsClose: boolean;
}

const defaultMenuIsOpenState: PairSelectorMenuOpenType = {
  open: false,
  wantsClose: false,
};

const PairSelectorMenuOpenContext = createContext<PairSelectorMenuOpenType>(
  defaultMenuIsOpenState
);
const UpdatePairSelectorMenuOpenContext = createContext<
  Dispatch<SetStateAction<PairSelectorMenuOpenType>>
>((_value) => {});
const NewConfigExchangesContext = createContext<
  ExchangesConfigType | undefined
>(undefined);
const UpdateNewConfigExchangesContext = createContext<
  Dispatch<SetStateAction<ExchangesConfigType | undefined>>
>((_value) => {});

export const useExchangeInfoContext = () => {
  return useContext(ExchangeInfoContext);
};

const useUpdateToSaveCurrencySettings = () => {
  return useContext(UpdateToSaveCurrencySettingsContext);
};

export const useNewConfigExchangesContext = () => {
  return useContext(NewConfigExchangesContext);
};

export const useUpdateNewConfigExchangesContext = () => {
  return useContext(UpdateNewConfigExchangesContext);
};

export const usePairSelectorMenuOpenContext = () => {
  return useContext(PairSelectorMenuOpenContext);
};

export const useUpdatePairSelectorMenuOpenContext = () => {
  return useContext(UpdatePairSelectorMenuOpenContext);
};

export const useUpdateExchangeInfoContext = () => {
  return useContext(UpdateExchangeInfoContext);
};

export const useCurrentCurrencyListContext = () => {
  return useContext(CurrentCurrencyListContext);
};

export const useUnsavedCurrencyListContext = () => {
  return useContext(UnsavedCurrencyListContext);
};

export type SericesExchangeInfoType = {
  enabled?: boolean;
  is_tested_simulated: boolean;
  is_tested: boolean;
  has_websockets: boolean;
  "api-key"?: string;
  "api-password"?: string;
  "api-secret"?: string;
  "exchange-type"?: "spot" | "future";
  sandboxed?: boolean;
  configurable?: boolean;
  exchange?: string;
  auth_success?: boolean;
  compatible_account?: boolean;
  supporter_account?: boolean;
  configured_account?: boolean;
  supporting_exchange?: boolean;
  error_message?: string | null;
  supported_exchange_types: ("spot" | "future")[];
  default_exchange_type: "spot" | "future";
};

export type SericesInfoType = {
  exchanges: {
    [exchange: string]: SericesExchangeInfoType;
  };
};

const ServicesInfoContext = createContext<SericesInfoType | undefined>(
  undefined
);
const UpdateServicesInfoContext = createContext<
  Dispatch<SetStateAction<SericesInfoType | undefined>>
>((_value) => {});

const initialExchangeConfigUpdate: ExchangeConfigUpdateType = {
  global_config: {},
  removed_elements: [],
};

export type ExchangeConfigUpdateType = {
  global_config: {
    [configKey: string]: boolean | string[] | string | number;
  };
  removed_elements: string[];
  restart_after_save?: boolean;
};

const ExchangeConfigUpdateContext = createContext<ExchangeConfigUpdateType>(
  initialExchangeConfigUpdate
);
const UpdateExchangeConfigUpdateContext = createContext<
  Dispatch<SetStateAction<ExchangeConfigUpdateType>>
>((_value) => {});

export const useServicesInfoContext = () => {
  return useContext(ServicesInfoContext);
};

export const useUpdateServicesInfoContext = () => {
  return useContext(UpdateServicesInfoContext);
};
export const useExchangeConfigUpdateContext = () => {
  return useContext(ExchangeConfigUpdateContext);
};

export const useUpdateExchangeConfigUpdateContext = () => {
  return useContext(UpdateExchangeConfigUpdateContext);
};

export const useFetchExchangeInfo = () => {
  const setExchangeInfo = useUpdateExchangeInfoContext();
  const botDomain = useBotDomainContext();
  return useCallback(
    (
      successNotification?: boolean,
      setIsFinished?: Dispatch<SetStateAction<boolean>>
    ) => {
      setIsFinished?.(false);
      fetchExchangeInfo(
        botDomain,
        setExchangeInfo,
        successNotification,
        setIsFinished
      );
    },
    [setExchangeInfo, botDomain]
  );
};

export const useFetchExchangesList = () => {
  const setServicesInfo = useUpdateServicesInfoContext();
  const botDomain = useBotDomainContext();
  return useCallback(
    (
      successNotification?: boolean,
      setIsFinished?: Dispatch<SetStateAction<boolean>>
    ) => {
      setIsFinished?.(false);
      fetchAndStoreFromBot({
        url: botDomain + backendRoutes.exchangesList,
        setBotDataFunction: setServicesInfo,
        successNotification,
        keepPreviousValues: false,
        setIsFinished,
      });
    },
    [setServicesInfo, botDomain]
  );
};

export const useHandleProfileUpdate = () => {
  const botDomain = useBotDomainContext();
  const botInfo = useBotInfoContext();
  const currentCurrencyList = useCurrentCurrencyListContext();
  const unsavedCurrencyList = useUnsavedCurrencyListContext();
  const exchangeInfo = useExchangeInfoContext();
  const currencySettings: ConfigSymbolsType =
    botInfo?.current_profile?.config?.["crypto-currencies"];
  const exchangeConfigUpdate = useExchangeConfigUpdateContext();

  return useCallback(
    (restartAfterSave?: boolean) => {
      handleProfileUpdate({
        currentCurrencyList,
        unsavedCurrencyList,
        exchangeConfigUpdate,
        exchangeInfo,
        botDomain,
        currencySettings,
        restartAfterSave,
      });
    },
    [
      currentCurrencyList,
      unsavedCurrencyList,
      exchangeConfigUpdate,
      exchangeInfo,
      botDomain,
      currencySettings,
    ]
  );
};

export const useHandleSettingChange = () => {
  const setToSaveCurrencySettings = useUpdateToSaveCurrencySettings();
  return useCallback(
    (enabled: boolean, exchange: string, symbol: string) => {
      setToSaveCurrencySettings((prevSettings) => {
        const newSettings = {
          ...prevSettings,
        };
        if (enabled) {
          newSettings[symbol] = {
            enabled: true,
            pairs: [symbol],
            // currency: exchangeInfo ?. currency_name_info ?. [parseSymbol(symbol).base] ?. n
          };
        } else {
          delete newSettings[symbol];
        }
        return newSettings;
      });
    },
    [setToSaveCurrencySettings]
  );
};

export const useHandleExchangeSettingChange = () => {
  const setNewConfigExchanges = useUpdateNewConfigExchangesContext();
  const setExchangeConfigUpdate = useUpdateExchangeConfigUpdateContext();
  return useCallback(
    (
      exchangeName: string,
      inputName: ExchangeConfigSettingNameType,
      newSetting: string | boolean | string[]
    ) => {
      setNewConfigExchanges((prevExchanges) => {
        const newExchanges = {
          ...prevExchanges,
        };
        if (!newExchanges?.[exchangeName]) {
          newExchanges[exchangeName] = {};
        }
        (newExchanges[exchangeName][inputName] as any) = newSetting;
        return newExchanges;
      });
      setExchangeConfigUpdate((prevSettings) => {
        const newSettings: ExchangeConfigUpdateType = {
          ...prevSettings,
        };
        newSettings.global_config[
          `exchanges_${exchangeName}_${inputName}`
        ] = newSetting;
        return newSettings;
      });
    },
    [setExchangeConfigUpdate, setNewConfigExchanges]
  );
};

export const BotExchangeInfoProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const [exchangeInfo, setExchangeInfo] = useState<ExchangeInfoType>();
  const [servicesInfo, setServicesInfo] = useState<SericesInfoType>();
  const [menuIsOpen, setMenuIsOpen] = useState(defaultMenuIsOpenState);
  const botInfo = useBotInfoContext();
  const currencySettings: ConfigSymbolsType =
    botInfo?.current_profile?.config?.["crypto-currencies"];
  const [toSaveCurrencySettings, setToSaveCurrencySettings] = useState<
    ConfigSymbolsType
  >();
  const [currentCurrencyList, setCurrentCurrencyList] = useState<
    CurrencyListType
  >();
  const [unsavedCurrencyList, setUnsavedCurrencyList] = useState<
    CurrencyListType
  >();
  const [exchangeConfigUpdate, setExchangeConfigUpdate] = useState(
    initialExchangeConfigUpdate
  );
  const [newConfigExchanges, setNewConfigExchanges] = useState<
    ExchangesConfigType
  >();

  useEffect(() => {
    const {
      currencySettings: currentCurrencySettings,
    } = convertSymbolSettingsToNewFormat(currencySettings, exchangeInfo);
    const currentCurrencySettingsJson: string = JSON.stringify(
      currentCurrencySettings
    );
    setToSaveCurrencySettings(JSON.parse(currentCurrencySettingsJson));
  }, [currencySettings, exchangeInfo]);
  useEffect(() => {
    const {
      currencyList: _currentCurrencyList,
    } = convertSymbolSettingsToNewFormat(currencySettings, exchangeInfo);
    const {
      currencyList: _unsavedCurrencyList,
    } = convertSymbolSettingsToNewFormat(toSaveCurrencySettings, exchangeInfo);
    const currentCurrencyListJson: string = JSON.stringify(
      _currentCurrencyList
    );
    const unsavedCurrencyListJson: string = JSON.stringify(
      _unsavedCurrencyList
    );
    setUnsavedCurrencyList(JSON.parse(unsavedCurrencyListJson));
    setCurrentCurrencyList(JSON.parse(currentCurrencyListJson));
  }, [currencySettings, exchangeInfo, toSaveCurrencySettings]);

  const configExchanges = servicesInfo?.exchanges
    ? Object.keys(servicesInfo.exchanges)
    : [];
  useEffect(() => {
    setExchangeConfigUpdate({ global_config: {}, removed_elements: [] });
    setNewConfigExchanges({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(configExchanges)]);

  return (
    <ExchangeInfoContext.Provider value={exchangeInfo}>
      <UpdateExchangeInfoContext.Provider value={setExchangeInfo}>
        <PairSelectorMenuOpenContext.Provider value={menuIsOpen}>
          <UpdatePairSelectorMenuOpenContext.Provider value={setMenuIsOpen}>
            <ServicesInfoContext.Provider value={servicesInfo}>
              <UpdateServicesInfoContext.Provider value={setServicesInfo}>
                <NewConfigExchangesContext.Provider value={newConfigExchanges}>
                  <UpdateNewConfigExchangesContext.Provider
                    value={setNewConfigExchanges}
                  >
                    <ExchangeConfigUpdateContext.Provider
                      value={exchangeConfigUpdate}
                    >
                      <UpdateExchangeConfigUpdateContext.Provider
                        value={setExchangeConfigUpdate}
                      >
                        <CurrentCurrencyListContext.Provider
                          value={currentCurrencyList}
                        >
                          <UnsavedCurrencyListContext.Provider
                            value={unsavedCurrencyList}
                          >
                            <UpdateToSaveCurrencySettingsContext.Provider
                              value={setToSaveCurrencySettings}
                            >
                              {children}
                            </UpdateToSaveCurrencySettingsContext.Provider>
                          </UnsavedCurrencyListContext.Provider>
                        </CurrentCurrencyListContext.Provider>
                      </UpdateExchangeConfigUpdateContext.Provider>
                    </ExchangeConfigUpdateContext.Provider>
                  </UpdateNewConfigExchangesContext.Provider>
                </NewConfigExchangesContext.Provider>
              </UpdateServicesInfoContext.Provider>
            </ServicesInfoContext.Provider>
          </UpdatePairSelectorMenuOpenContext.Provider>
        </PairSelectorMenuOpenContext.Provider>
      </UpdateExchangeInfoContext.Provider>
    </ExchangeInfoContext.Provider>
  );
};

function handleProfileUpdate({
  currentCurrencyList,
  unsavedCurrencyList,
  exchangeInfo,
  botDomain,
  currencySettings,
  restartAfterSave,
  exchangeConfigUpdate,
}: {
  currentCurrencyList: CurrencyListType | undefined;
  unsavedCurrencyList: CurrencyListType | undefined;
  exchangeInfo: ExchangeInfoType | undefined;
  botDomain: string;
  currencySettings: ConfigSymbolsType;
  restartAfterSave?: boolean;
  exchangeConfigUpdate: ExchangeConfigUpdateType;
}) {
  const hasUnsavedChanges =
    unsavedCurrencyList &&
    currentCurrencyList &&
    JSON.stringify(unsavedCurrencyList) !== JSON.stringify(currentCurrencyList);
  const exchangeConfigUpdateHasChanged = Boolean(
    exchangeConfigUpdate.global_config &&
      Object.keys(exchangeConfigUpdate.global_config).length
  );
  const configUpdate: ExchangeConfigUpdateType = {
    ...exchangeConfigUpdate,
    restart_after_save: restartAfterSave,
  };
  if (hasUnsavedChanges) {
    getProfileCurrencyUpdate({
      configUpdate,
      currentCurrencyList,
      currencySettings,
      unsavedCurrencyList,
      exchangeInfo,
    });
  }
  if (exchangeConfigUpdateHasChanged || hasUnsavedChanges) {
    const onFail = () => {
      // setIsloading(false)
    };
    updateConfig(botDomain, configUpdate, "current profile", onFail);
  }
}

export function getProfileCurrencyUpdate({
  configUpdate,
  currentCurrencyList,
  currencySettings,
  unsavedCurrencyList,
  exchangeInfo,
}: {
  configUpdate: ExchangeConfigUpdateType;
  currentCurrencyList: CurrencyListType;
  currencySettings: ConfigSymbolsType;
  unsavedCurrencyList: CurrencyListType;
  exchangeInfo: ExchangeInfoType | undefined;
}) {
  new Set([...currentCurrencyList, ...unsavedCurrencyList]).forEach(
    (symbol) => {
      if (
        currentCurrencyList.includes(symbol) &&
        !unsavedCurrencyList.includes(symbol)
      ) {
        let pairKey;
        if (currencySettings?.[symbol]) {
          pairKey = symbol;
        } else {
          const currencyName =
            exchangeInfo?.currency_name_info?.[parseSymbol(symbol).base]?.n;
          if (
            currencyName &&
            currencySettings[currencyName]?.pairs?.includes(symbol)
          ) {
            pairKey = currencyName;
          } else {
            for (const currency in currencySettings) {
              if (currencySettings[currency].pairs?.includes(symbol)) {
                pairKey = currency;
                break;
              }
            }
          }
        }
        pairKey &&
          !configUpdate.removed_elements.includes(
            `crypto-currencies_${pairKey}`
          ) &&
          configUpdate.removed_elements.push(`crypto-currencies_${pairKey}`);
        return;
      }
      if (
        !currentCurrencyList.includes(symbol) &&
        unsavedCurrencyList.includes(symbol)
      ) {
        configUpdate.global_config[`crypto-currencies_${symbol}_pairs`] = [
          symbol,
        ];
        configUpdate.global_config[
          `crypto-currencies_${symbol}_enabled`
        ] = true;
      }
    }
  );
}

function convertSymbolSettingsToNewFormat(
  originalCurrencySettings: ConfigSymbolsType | undefined,
  exchangeInfo: ExchangeInfoType | undefined
): {
  currencyList: CurrencyListType;
  currencySettings: ConfigSymbolsType;
} {
  const currencyList: CurrencyListType = [];
  const currencySettings: ConfigSymbolsType = {};
  originalCurrencySettings &&
    Object.keys(originalCurrencySettings).forEach((currency) => {
      if (originalCurrencySettings[currency]?.enabled !== false) {
        originalCurrencySettings[currency]?.pairs?.forEach((pair) => {
          currencyList.push(pair);
          if (!currencySettings[pair]) {
            currencySettings[pair] = {
              enabled: true,
              pairs: [],
            };
          }
          currencySettings[pair].pairs.push(pair);
        });
      }
    });
  return {
    currencyList: currencyList?.sort((a, b) => a?.localeCompare(b)),
    currencySettings,
  };
}
