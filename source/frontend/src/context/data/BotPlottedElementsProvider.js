import React, {
    useState,
    useContext,
    createContext,
    useEffect,
    useCallback
} from "react";
import {fetchPlotlyPlotData} from "../../api/data";
import {userInputKey} from "../../components/Tables/w2ui/RunDataTable";
import {ID_SEPARATOR} from "../../constants/backendConstants";
import {useBotDomainContext} from "../config/BotDomainProvider";
import {useUiConfigContext} from "../config/UiConfigProvider";
import {useVisibleExchangesContext} from "../config/VisibleExchangesProvider";
import {useVisiblePairsContext} from "../config/VisiblePairProvider";
import {useVisibleTimeFramesContext} from "../config/VisibleTimeFrameProvider";
import {useBotInfoContext} from "./BotInfoProvider";
import { useCurrentTentacleConfig } from "../../widgets/AppWidgets/Configuration/TentaclesConfig";


const BotPlottedElementsContext = createContext();
const UpdateBotPlottedElementsContext = createContext();
const HiddenBacktestingMetadataColumnsContext = createContext();
const UpdateHiddenBacktestingMetadataColumnsContext = createContext();
const DisplayedRunIdsContext = createContext();
const UpdateDisplayedRunIdsContext = createContext();

export const useBotPlottedElementsContext = () => {
    return useContext(BotPlottedElementsContext);
};
export const useUpdateBotPlottedElementsContext = () => {
    return useContext(UpdateBotPlottedElementsContext);
};
export const useHiddenBacktestingMetadataColumnsContext = () => {
    return useContext(HiddenBacktestingMetadataColumnsContext);
};
export const useUpdateHiddenBacktestingMetadataColumnsContext = () => {
    return useContext(UpdateHiddenBacktestingMetadataColumnsContext);
};
export const useDisplayedRunIdsContext = () => {
    return useContext(DisplayedRunIdsContext);
};
export const useUpdateDisplayedRunIdsContext = () => {
    return useContext(UpdateDisplayedRunIdsContext);
};

export const useFetchPlotData = () => {
    const botInfo = useBotInfoContext();
    const botDomain = useBotDomainContext();
    const visiblePairs = useVisiblePairsContext();
    const visibleTimeframes = useVisibleTimeFramesContext();
    const setBotPlottedElements = useUpdateBotPlottedElementsContext();
    const setHiddenBacktestingMetadataColumns = useUpdateHiddenBacktestingMetadataColumnsContext();
    const visibleExchanges = useVisibleExchangesContext();

    const logic = useCallback((isLive = true) => {
        fetchPlotlyPlotData(visiblePairs, visibleTimeframes, botInfo.ids_by_exchange_name[visibleExchanges], visibleExchanges, botDomain, setBotPlottedElements, botInfo, (elements) => setHiddenMetadataFromInputs(elements, setHiddenBacktestingMetadataColumns));
    }, [
        visiblePairs,
        visibleTimeframes,
        botDomain,
        setBotPlottedElements,
        botInfo,
        setHiddenBacktestingMetadataColumns,
        visibleExchanges
    ]);
    return logic;
};

function clearUnselectedRuns(displayedRunIds, botPlottedElements, setBotPlottedElements, visiblePairs, visibleTimeframes) { // clear not selected runs
    const newPlottedElements = {
        ... botPlottedElements
    }
    const backtesting = newPlottedElements ?. backtesting
    if (displayedRunIds.backtesting ?. length) {
        backtesting && displayedRunIds ?. backtesting && Object.keys(backtesting).forEach(thisCampaign => {
            if (displayedRunIds.backtesting.some(runId => runId.endsWith(thisCampaign))) {
                const thisCampaignData = backtesting ?. [thisCampaign]
                thisCampaignData && Object.keys(thisCampaignData).forEach(thisOptimizerId => {
                    if (displayedRunIds.backtesting.some(runId => (runId.endsWith(thisOptimizerId + ID_SEPARATOR + thisCampaign)))) {
                        const thisOptimizerData = thisCampaignData ?. [thisOptimizerId]
                        thisOptimizerData && Object.keys(thisOptimizerData).forEach(thisBacktestingId => {
                            if (displayedRunIds.backtesting.some(runId => (runId === thisBacktestingId + ID_SEPARATOR + thisOptimizerId + ID_SEPARATOR + thisCampaign))) {
                                const thisBacktestingData = thisOptimizerData[thisBacktestingId]
                                thisBacktestingData && Object.keys(thisBacktestingData).forEach(thisPair => {
                                    if (thisPair === visiblePairs) {
                                        const thisPairData = thisOptimizerData[thisBacktestingId]
                                        thisPairData && Object.keys(thisPairData).forEach(thisTimeframe => {
                                            if (thisTimeframe !== visibleTimeframes) {
                                                delete thisPairData[thisTimeframe]
                                            }
                                        })
                                    } else {
                                        delete thisBacktestingData[thisPair]
                                    }
                                })
                            } else {
                                delete thisOptimizerData[thisBacktestingId]
                            }
                        })
                    } else {
                        delete thisCampaignData[thisOptimizerId]
                    }
                })
            } else {
                delete backtesting[thisCampaign]
            }
        })
    } else {
        delete newPlottedElements.backtesting
    }
    if (JSON.stringify(botPlottedElements) !== JSON.stringify(newPlottedElements)) {
        setBotPlottedElements(newPlottedElements)
    }
}

function loadMissingRuns(displayedRunIds, botPlottedElements, visiblePairs, visibleTimeframes, visibleExchangeIds, visibleExchanges, botDomain, setBotPlottedElements, botInfo) { // load missing runs
    displayedRunIds ?. backtesting && displayedRunIds.backtesting.forEach(runIdentifier => {
        const [backtesting_id, optimizer_id, optimization_campaign] = runIdentifier.split(ID_SEPARATOR)
        if (! botPlottedElements ?. backtesting ?. [optimization_campaign] ?. [optimizer_id] ?. [backtesting_id] ?. [visiblePairs] ?. [visibleTimeframes]) {
            fetchPlotlyPlotData(visiblePairs, visibleTimeframes, visibleExchangeIds, visibleExchanges, botDomain, setBotPlottedElements, botInfo, undefined, false, optimization_campaign, backtesting_id, optimizer_id,);
        }
    })
}

function setHiddenMetadataFromInputs(elements, setHiddenBacktestingMetadataColumns) {
    const hiddenBacktestingMetadataColumns = []
    function addIfHidden(properties, tentacle) {
        Object.keys(properties).forEach(input => {
            if (properties[input] ?. options ?. in_summary === false) {
                hiddenBacktestingMetadataColumns.push(userInputKey(input.replaceAll("_", " "), tentacle))
            }
            if (properties[input].properties) {
                addIfHidden(properties[input].properties, tentacle)
            }
        })
    }
    elements.forEach(element => {
        addIfHidden(element.schema.properties, element.tentacle)
    })
    setHiddenBacktestingMetadataColumns(hiddenBacktestingMetadataColumns)
}

export const BotPlottedElementsProvider = ({children}) => {
    const [botPlottedElements, setBotPlottedElements] = useState({});
    const [hiddenBacktestingMetadataColumns, setHiddenBacktestingMetadataColumns] = useState();
    const [displayedRunIds, setDisplayedRunIds] = useState({live: [], backtesting: []});
    const botInfo = useBotInfoContext();
    const botDomain = useBotDomainContext();
    const currentTentacleConfig = useCurrentTentacleConfig();
    const visiblePairs = useVisiblePairsContext();
    const visibleTimeframes = useVisibleTimeFramesContext();
    const visibleExchanges = useVisibleExchangesContext();
    const uiConfig = useUiConfigContext();
    useEffect(() => { // backtestings
        if (displayedRunIds && botInfo && visibleTimeframes && visiblePairs && visibleExchanges) {
            clearUnselectedRuns(displayedRunIds, botPlottedElements, setBotPlottedElements, visiblePairs, visibleTimeframes)
            loadMissingRuns(displayedRunIds, botPlottedElements, visiblePairs, visibleTimeframes, botInfo.ids_by_exchange_name[visibleExchanges], visibleExchanges, botDomain, setBotPlottedElements, botInfo)
        }
    }, [
        displayedRunIds,
        visiblePairs,
        visibleTimeframes,
        visibleExchanges,
        botDomain,
        botInfo,
        botPlottedElements
    ]);

    useEffect(() => { // live
        if (botInfo && visibleTimeframes && visiblePairs && visibleExchanges) {
            fetchPlotlyPlotData(visiblePairs, visibleTimeframes, botInfo.ids_by_exchange_name[visibleExchanges], visibleExchanges, botDomain, setBotPlottedElements, botInfo, (elements) => setHiddenMetadataFromInputs(elements, setHiddenBacktestingMetadataColumns));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        botInfo ?. exchange_id,
        botDomain,
        visibleTimeframes,
        visiblePairs,
        visibleExchanges,
        uiConfig,
        currentTentacleConfig
    ]);
    return (
        <DisplayedRunIdsContext.Provider value={displayedRunIds}>
            <UpdateDisplayedRunIdsContext.Provider value={setDisplayedRunIds}>
                <HiddenBacktestingMetadataColumnsContext.Provider value={hiddenBacktestingMetadataColumns}>
                    <UpdateHiddenBacktestingMetadataColumnsContext.Provider value={setHiddenBacktestingMetadataColumns}>
                        <BotPlottedElementsContext.Provider value={botPlottedElements}>
                            <UpdateBotPlottedElementsContext.Provider value={setBotPlottedElements}>
                                {children} </UpdateBotPlottedElementsContext.Provider>
                        </BotPlottedElementsContext.Provider>
                    </UpdateHiddenBacktestingMetadataColumnsContext.Provider>
                </HiddenBacktestingMetadataColumnsContext.Provider>
            </UpdateDisplayedRunIdsContext.Provider>
        </DisplayedRunIdsContext.Provider>
    );
};
