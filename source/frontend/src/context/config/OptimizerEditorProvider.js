import {
    useState,
    useContext,
    createContext,
    useCallback,
    useEffect
} from "react";
import {useBotDomainContext} from "./BotDomainProvider";
import {fetchProConfig, saveProConfig} from "../../api/configs";
import {getOptimizerSettingsValues} from "../../widgets/AppWidgets/Configuration/OptimizerConfigForm/OptimizerConfigForm";
import {OPTIMIZER_INPUTS_KEY, backendRoutes} from "../../constants/backendConstants";
import createNotification from "../../components/Notifications/Notification";
import { sendAndInterpretBotUpdate } from "../../api/fetchAndStoreFromBot";

const OptimizerEditorCounterContext = createContext();
const UpdateOptimizerEditorCounterContext = createContext();
const OptimizerEditorContext = createContext();
const UpdateOptimizerEditorContext = createContext();

export const useOptimizerEditorCounterContext = () => {
    return useContext(OptimizerEditorCounterContext);
};

export const useUpdateOptimizerEditorCounterContext = () => {
    return useContext(UpdateOptimizerEditorCounterContext);
};

export const useOptimizerEditorContext = () => {
    return useContext(OptimizerEditorContext);
};

export const useUpdateOptimizerEditorContext = () => {
    return useContext(UpdateOptimizerEditorContext);
};

export const useFetchProConfig = () => {
    const setOptimizerEditor = useUpdateOptimizerEditorContext();
    const botDomain = useBotDomainContext();
    return useCallback((onFinished) => {
        const success = (updated_data, update_url, result, msg, status) => {
            setOptimizerEditor(msg)
            onFinished?.(msg)
        }
        sendAndInterpretBotUpdate({}, botDomain + backendRoutes.proConfig, success, undefined, "get")
    }, [setOptimizerEditor, botDomain]);
};

export const useGetAndSaveOptimizerForm = () => {
    const setOptimizerEditor = useUpdateOptimizerEditorContext();
    const botDomain = useBotDomainContext();
    const logic = useCallback((saveForm = true) => {
        const optimizerForm = getOptimizerSettingsValues()
        if (!Object.keys(optimizerForm).length) {
            createNotification("Optimizer form not ready yet", "danger")
        }
        saveForm && optimizerForm && setOptimizerEditor(prevConfig => {
            const _newConfig = {
                ...prevConfig
            }
            _newConfig[OPTIMIZER_INPUTS_KEY] = {
                ...(_newConfig[OPTIMIZER_INPUTS_KEY] || {}),
                ...optimizerForm
            }
            saveProConfig(botDomain, _newConfig);
            return _newConfig
        })
        return optimizerForm
    }, [botDomain, setOptimizerEditor]);
    return logic;
};

export const OptimizerEditorProvider = ({children}) => {
    const [optimizerEditorCounter, setOptimizerEditorCounter] = useState(0);
    const [optimizerEditor, setOptimizerEditor] = useState();
    const inputs = optimizerEditor?.optimizer_inputs?.user_inputs
    useEffect(() => {
        inputs && setOptimizerEditorCounter(getOptimizerEditorCounter(inputs))
    }, [inputs])

    return (<OptimizerEditorCounterContext.Provider value={optimizerEditorCounter}>
        <UpdateOptimizerEditorCounterContext.Provider value={setOptimizerEditorCounter}>
            <OptimizerEditorContext.Provider value={optimizerEditor}>
                <UpdateOptimizerEditorContext.Provider value={setOptimizerEditor}> {children} </UpdateOptimizerEditorContext.Provider>
            </OptimizerEditorContext.Provider>
        </UpdateOptimizerEditorCounterContext.Provider>
    </OptimizerEditorCounterContext.Provider>);
};


function getOptimizerEditorCounter(userInputs) {
    let runsCount = 0;
    Object.values(userInputs).forEach(userInput => {
        if (userInput.enabled) {
            if (runsCount === 0) {
                runsCount = 1;
            }
            const value = userInput.value;
            if (value instanceof Array) {
                runsCount *= value.length;
            } else if (typeof value.step !== "undefined") {
                if (value.step > 0) {
                    const window = value.max - value.min;
                    runsCount *= Math.floor(window / value.step + 1);
                }
            } else {
                console.log("Unhandled user input type to compute optimizer runs count: ", value);
            }
        }
    });
    return runsCount;
    // $("#backtesting-computations-count").text(runsCount * new Number($("#backtesting-candles-counts").text()));
}
