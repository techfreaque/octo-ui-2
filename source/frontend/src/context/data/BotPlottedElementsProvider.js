import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  useCallback
} from "react";
import { fetchPlotlyPlotData } from "../../api/data";
import { userInputKey } from "../../components/Tables/w2ui/RunDataTable";
import { ID_SEPARATOR } from "../../constants/backendConstants";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { useUiConfigContext } from "../config/UiConfigProvider";
import { useVisiblePairsContext } from "../config/VisiblePairProvider";
import { useVisibleTimeFramesContext } from "../config/VisibleTimeFrameProvider";
import { useBotInfoContext } from "./BotInfoProvider";


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
  const uiConfig = useUiConfigContext();
  const setBotPlottedElements = useUpdateBotPlottedElementsContext();
  const setHiddenBacktestingMetadataColumns = useUpdateHiddenBacktestingMetadataColumnsContext();
  const logic = useCallback((isLive = true) => {
    fetchPlotlyPlotData(
      visiblePairs, visibleTimeframes,
      botDomain,
      convertAnalysisSettings(isLive ? uiConfig.live_analysis_settings : uiConfig.backtesting_analysis_settings),
      setBotPlottedElements, botInfo,
      (elements) => setHiddenMetadataFromInputs(elements, setHiddenBacktestingMetadataColumns)
    );
  }, [
    visiblePairs,
    visibleTimeframes,
    botDomain,
    uiConfig.backtesting_analysis_settings,
    uiConfig.live_analysis_settings,
    setBotPlottedElements,
    botInfo,
    setHiddenBacktestingMetadataColumns
  ]);
  return logic;
};
function convertAnalysisSettings(analysis_settings, isLive = true) {
  const key = isLive ? "live" : "backtesting"
  return {
    plot_unrealized_portfolio_value: analysis_settings?.[key + "_plot_settings"]?.plot_unrealized_portfolio || false,
    plot_unrealized_portfolio_value_for_each_asset: analysis_settings?.[key + "_plot_settings"]?.plot_unrealized_portfolio_value_for_each_asset || false,
    plot_unrealized_portfolio_amount_for_each_asset: analysis_settings?.[key + "_plot_settings"]?.plot_unrealized_portfolio_amount_for_each_asset || false,
    plot_realized_portfolio_value: analysis_settings?.[key + "_plot_settings"]?.plot_realized_portfolio || false,
    plot_realized_trade_gains: analysis_settings?.[key + "_plot_settings"]?.plot_trade_gains || false,
    plot_best_case_growth: analysis_settings?.[key + "_plot_settings"]?.plot_best_case_growth || false,
    plot_win_rate: analysis_settings?.[key + "_plot_settings"]?.plot_win_rate || false,
    plot_wins_and_losses_count: analysis_settings?.[key + "_plot_settings"]?.plot_wins_and_losses_count || false,
    plot_funding_fees: analysis_settings?.[key + "_plot_settings"]?.plot_funding_fees || false,
    plot_withdrawals: analysis_settings?.[key + "_plot_settings"]?.plot_withdrawals || false,
    chart_location_withdrawals: analysis_settings?.[key + "_plot_settings"]?.chart_location_withdrawals || false,
    chart_location_unrealized_portfolio_value: analysis_settings?.[key + "_plot_settings"]?.chart_location_unrealized_portfolio_value || false,
    chart_location_realized_portfolio_value: analysis_settings?.[key + "_plot_settings"]?.chart_location_realized_portfolio_value || false,
    chart_location_realized_trade_gains: analysis_settings?.[key + "_plot_settings"]?.chart_location_trade_gains || false,
    chart_location_best_case_growth: analysis_settings?.[key + "_plot_settings"]?.chart_location_best_case_growth || false,
    chart_location_win_rate: analysis_settings?.[key + "_plot_settings"]?.chart_location_win_rate || false,
    chart_location_wins_and_losses_count: analysis_settings?.[key + "_plot_settings"]?.chart_location_wins_and_losses_count || false,
    chart_location_funding_fees: analysis_settings?.[key + "_plot_settings"]?.chart_location_funding_fees || false,
    display_trades_and_positions: analysis_settings?.[key + "_table_settings"]?.display_trades_and_positions || false,
    display_withdrawals_table: analysis_settings?.[key + "_table_settings"]?.display_withdrawals_table || false,
  }
}

function clearUnselectedRuns(displayedRunIds, botPlottedElements, setBotPlottedElements, visiblePairs, visibleTimeframes) {
  // clear not selected runs
  const newPlottedElements = { ...botPlottedElements }
  const backtesting = newPlottedElements?.backtesting
  if (displayedRunIds.backtesting?.length) {
    backtesting && displayedRunIds?.backtesting && Object.keys(backtesting).forEach(thisCampaign => {
      if (displayedRunIds.backtesting.some(runId => runId.endsWith(thisCampaign))) {
        const thisCampaignData = backtesting?.[thisCampaign]
        thisCampaignData && Object.keys(thisCampaignData).forEach(thisOptimizerId => {
          if (displayedRunIds.backtesting.some(runId => (
            runId.endsWith(thisOptimizerId + ID_SEPARATOR + thisCampaign)
          ))) {
            const thisOptimizerData = thisCampaignData?.[thisOptimizerId]
            thisOptimizerData && Object.keys(thisOptimizerData).forEach(thisBacktestingId => {
              if (displayedRunIds.backtesting.some(runId => (
                runId === thisBacktestingId + ID_SEPARATOR + thisOptimizerId + ID_SEPARATOR + thisCampaign
              ))) {
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

function loadMissingRuns(
  displayedRunIds, botPlottedElements, visiblePairs, visibleTimeframes,
  botDomain, uiConfig, setBotPlottedElements, botInfo
) {
  // load missing runs
  displayedRunIds?.backtesting && displayedRunIds.backtesting.forEach(runIdentifier => {
    const [backtesting_id, optimizer_id, optimization_campaign] = runIdentifier.split(ID_SEPARATOR)
    if (!botPlottedElements?.backtesting?.[optimization_campaign]?.[optimizer_id]?.[backtesting_id]?.[visiblePairs]?.[visibleTimeframes]) {
      fetchPlotlyPlotData(
        visiblePairs,
        visibleTimeframes,
        botDomain,
        convertAnalysisSettings(uiConfig.backtesting_analysis_settings, false),
        setBotPlottedElements,
        botInfo,
        undefined,
        false,
        optimization_campaign,
        backtesting_id,
        optimizer_id,);
    }
  })
}

function setHiddenMetadataFromInputs(elements, setHiddenBacktestingMetadataColumns) {
  const hiddenBacktestingMetadataColumns = []
  function addIfHidden(properties, tentacle) {
    Object.keys(properties).forEach(input => {
      if (properties[input]?.options?.in_summary === false) {
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

export const BotPlottedElementsProvider = ({ children }) => {
  const [botPlottedElements, setBotPlottedElements] = useState({});
  const [hiddenBacktestingMetadataColumns, setHiddenBacktestingMetadataColumns] = useState();
  const [displayedRunIds, setDisplayedRunIds] = useState({ live: [], backtesting: [] });
  const botInfo = useBotInfoContext();
  const botDomain = useBotDomainContext();
  const visiblePairs = useVisiblePairsContext();
  const visibleTimeframes = useVisibleTimeFramesContext();
  const uiConfig = useUiConfigContext();

  useEffect(() => {
    // backtestings
    if (displayedRunIds && botInfo && visibleTimeframes && visiblePairs && uiConfig?.backtesting_analysis_settings) {
      clearUnselectedRuns(displayedRunIds, botPlottedElements, setBotPlottedElements, visiblePairs, visibleTimeframes)
      loadMissingRuns(
        displayedRunIds, botPlottedElements, visiblePairs, visibleTimeframes,
        botDomain, uiConfig, setBotPlottedElements, botInfo
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedRunIds, uiConfig?.backtesting_analysis_settings, visiblePairs, visibleTimeframes, botDomain, botInfo?.exchange_id]);

  useEffect(() => { // live
    if (uiConfig?.live_analysis_settings && botInfo && visibleTimeframes && visiblePairs) {
      fetchPlotlyPlotData(
        visiblePairs, visibleTimeframes, botDomain,
        convertAnalysisSettings(uiConfig.live_analysis_settings),
        setBotPlottedElements, botInfo,
        (elements) => setHiddenMetadataFromInputs(elements, setHiddenBacktestingMetadataColumns)
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    botInfo?.exchange_id,
    botDomain,
    visibleTimeframes,
    visiblePairs,
    uiConfig?.live_analysis_settings
  ]);
  return (<DisplayedRunIdsContext.Provider value={displayedRunIds}>
    <UpdateDisplayedRunIdsContext.Provider value={setDisplayedRunIds}>
      <HiddenBacktestingMetadataColumnsContext.Provider value={hiddenBacktestingMetadataColumns}>
        <UpdateHiddenBacktestingMetadataColumnsContext.Provider value={setHiddenBacktestingMetadataColumns}>
          <BotPlottedElementsContext.Provider value={botPlottedElements}>
            <UpdateBotPlottedElementsContext.Provider value={setBotPlottedElements}> {children} </UpdateBotPlottedElementsContext.Provider>
          </BotPlottedElementsContext.Provider>
        </UpdateHiddenBacktestingMetadataColumnsContext.Provider>
      </HiddenBacktestingMetadataColumnsContext.Provider>
    </UpdateDisplayedRunIdsContext.Provider>
  </DisplayedRunIdsContext.Provider>);
};
