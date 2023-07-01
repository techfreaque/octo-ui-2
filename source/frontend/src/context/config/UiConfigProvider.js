import {
    useState,
    useContext,
    createContext,
    useCallback,
    useEffect
} from "react";
import {fetchUIConfig, saveUIConfig} from "../../api/configs";
import {useBotDomainContext} from "./BotDomainProvider";
import {useBotInfoContext} from "../data/BotInfoProvider";

const UiConfigContext = createContext();
const UpdateUiConfigContext = createContext();

export const useUiConfigContext = () => {
    return useContext(UiConfigContext);
};

export const useUpdateUiConfigContext = () => {
    return useContext(UpdateUiConfigContext);
};

export const useFetchUiConfig = () => {
    const setUiConfig = useUpdateUiConfigContext();
    const botDomain = useBotDomainContext();
    const botInfo = useBotInfoContext()
    const exchangeNames = botInfo?.ids_by_exchange_name && Object.keys(botInfo.ids_by_exchange_name)
    const logic = useCallback(() => {
        fetchUIConfig(botDomain, setUiConfig, exchangeNames);
    }, [setUiConfig, botDomain, exchangeNames]);
    return logic;
};

export const useSaveUiConfig = () => {
    const setUiConfig = useUpdateUiConfigContext();
    const botDomain = useBotDomainContext();
    const logic = useCallback((newConfig, callbackSucces, callbackFail, overwriteConfig = false) => {
        setUiConfig(prevConfig => {
            const _newConfig = {
                ...(overwriteConfig ? {} : prevConfig),
                ...newConfig
            }
            saveUIConfig(botDomain, _newConfig, callbackSucces, callbackFail);
            return _newConfig
        })
    }, [setUiConfig, botDomain]);
    return logic;
};

export const UiConfigProvider = ({children}) => {
    const [uiConfig, setUiConfig] = useState();
    const botDomain = useBotDomainContext();
    const botInfo = useBotInfoContext()
    const exchangeNamesStr = JSON.stringify(botInfo?.ids_by_exchange_name && Object.keys(botInfo.ids_by_exchange_name))
    useEffect(() => {
        if (exchangeNamesStr) {
            const exchangeNames = JSON.parse(exchangeNamesStr)
            fetchUIConfig(botDomain, setUiConfig, exchangeNames);
        }
    }, [botDomain, exchangeNamesStr]);
    return (<UiConfigContext.Provider value={uiConfig}>
        <UpdateUiConfigContext.Provider value={setUiConfig}> {children} </UpdateUiConfigContext.Provider>
    </UiConfigContext.Provider>);
};
