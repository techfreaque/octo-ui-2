import {
  useState,
  useContext,
  createContext,
  useEffect,
  useCallback,
  SetStateAction,
  Dispatch,
} from "react";
import { fetchPlotlyPlotData } from "../../api/data";
import { userInputKey } from "../../components/Tables/w2ui/RunDataTable";
import { ID_SEPARATOR, PlotSourceType } from "../../constants/backendConstants";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { useUiConfigContext } from "../config/UiConfigProvider";
import { useVisibleExchangesContext } from "../config/VisibleExchangesProvider";
import { useVisiblePairsContext } from "../config/VisiblePairProvider";
import { useVisibleTimeFramesContext } from "../config/VisibleTimeFrameProvider";
import { useBotInfoContext } from "./BotInfoProvider";
import { useCurrentTentacleConfig } from "../../widgets/AppWidgets/Configuration/TentaclesConfig";
import {
  ChartLocationType,
  NonChartLocationTypes,
} from "../../widgets/AppWidgets/Charts/MainCharts/Plotly";
import { ChartType } from "../../widgets/AppWidgets/Charts/ChartTablePieCombo";
import { MarkerAttributesType } from "../../widgets/AppWidgets/Charts/MainCharts/PlotlyGenerateData";
import {
  DataTableColumnType,
  DataTableDataType,
} from "../../widgets/AppWidgets/Tables/DataTable";

export type ChartDetailsType = {
  own_yaxis?: boolean;
  own_xaxis?: boolean;
  x?;
  x_type?;
  y_type?: "date" | null;
  y?;
  labels?;
  text?;
  values?;
  value?;
  columns?: DataTableColumnType[];
  rows?: DataTableDataType[];
  kind?: "candlestick" | "scattergl";
  mode?: "line";
  title: string;
  config?: {
    antIcon?: string;
    faIcon?: string;
  };
  hole?;
  line_shape;
  color?: string[];
} & {
  [candleSource in PlotSourceType];
} &
  {
    [markerAtribute in MarkerAttributesType];
  };

export type PlottedSubSubElementType = {
  type: ChartType;
  name: ChartLocationType | NonChartLocationTypes;
  data?: {
    elements: ChartDetailsType[];
  };
};
export type PlottedSubElementType = {
  [pair: string]: {
    [timeframe: string]: {
      data?: {
        sub_elements?: PlottedSubSubElementType[];
      };
    };
  };
};
export type PlottedLiveElementType = {
  [liveId: string]: PlottedSubElementType;
};
export type PlottedBacktestingElementType = {
  [backtestingId: string]: {
    [optimizerId: string]: PlottedLiveElementType;
  };
};

export type PlottedElementLiveNameType = "live";
export type PlottedElementBacktestingNameType = "backtesting";
export type PlottedElementNameType =
  | PlottedElementLiveNameType
  | PlottedElementBacktestingNameType;

export type PlottedElementsType<TPlottedElementNameType> = {
  [liveOrBacktesting in PlottedElementNameType]?: TPlottedElementNameType extends PlottedElementLiveNameType
    ? PlottedLiveElementType
    : PlottedBacktestingElementType;
};

const BotPlottedElementsContext = createContext<
  PlottedElementsType<PlottedElementNameType> | undefined
>(undefined);
const UpdateBotPlottedElementsContext = createContext<
  Dispatch<
    SetStateAction<PlottedElementsType<PlottedElementNameType> | undefined>
  >
>((_value) => {});
const HiddenBacktestingMetadataColumnsContext = createContext<
  string[] | undefined
>(undefined);
const UpdateHiddenBacktestingMetadataColumnsContext = createContext<
  Dispatch<SetStateAction<string[] | undefined>>
>((_value) => {});

export interface DisplayedRunIdsType {
  live: never[];
  backtesting: never[];
}

const defaultDisplayedRunIds: DisplayedRunIdsType = {
  live: [],
  backtesting: [],
};

const DisplayedRunIdsContext = createContext<DisplayedRunIdsType>(
  defaultDisplayedRunIds
);
const UpdateDisplayedRunIdsContext = createContext<
  Dispatch<SetStateAction<DisplayedRunIdsType>>
>((_value) => {});

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

  const logic = useCallback(
    (isLive = true) => {
      visiblePairs &&
        visibleTimeframes &&
        visibleExchanges &&
        botInfo &&
        fetchPlotlyPlotData({
          symbol: visiblePairs,
          timeFrame: visibleTimeframes,
          exchange_id: botInfo.ids_by_exchange_name[visibleExchanges],
          exchange_name: visibleExchanges,
          botDomain,
          optimizationCampaign: botInfo.optimization_campaign,
          setBotPlottedElements,
          botInfo,
          setHiddenMetadataFromInputs: (elements) =>
            setHiddenMetadataFromInputs(
              elements,
              setHiddenBacktestingMetadataColumns
            ),
          isLive: true,
        });
    },
    [
      visiblePairs,
      visibleTimeframes,
      botDomain,
      setBotPlottedElements,
      botInfo,
      setHiddenBacktestingMetadataColumns,
      visibleExchanges,
    ]
  );
  return logic;
};

function clearUnselectedRuns(
  displayedRunIds,
  botPlottedElements,
  setBotPlottedElements,
  visiblePairs,
  visibleTimeframes
) {
  // clear not selected runs
  const newPlottedElements = {
    ...botPlottedElements,
  };
  const backtesting = newPlottedElements?.backtesting;
  if (displayedRunIds.backtesting?.length) {
    backtesting &&
      displayedRunIds?.backtesting &&
      Object.keys(backtesting).forEach((thisCampaign) => {
        if (
          displayedRunIds.backtesting.some((runId) =>
            runId.endsWith(thisCampaign)
          )
        ) {
          const thisCampaignData = backtesting?.[thisCampaign];
          thisCampaignData &&
            Object.keys(thisCampaignData).forEach((thisOptimizerId) => {
              if (
                displayedRunIds.backtesting.some((runId) =>
                  runId.endsWith(thisOptimizerId + ID_SEPARATOR + thisCampaign)
                )
              ) {
                const thisOptimizerData = thisCampaignData?.[thisOptimizerId];
                thisOptimizerData &&
                  Object.keys(thisOptimizerData).forEach(
                    (thisBacktestingId) => {
                      if (
                        displayedRunIds.backtesting.some(
                          (runId) =>
                            runId ===
                            thisBacktestingId +
                              ID_SEPARATOR +
                              thisOptimizerId +
                              ID_SEPARATOR +
                              thisCampaign
                        )
                      ) {
                        const thisBacktestingData =
                          thisOptimizerData[thisBacktestingId];
                        thisBacktestingData &&
                          Object.keys(thisBacktestingData).forEach(
                            (thisPair) => {
                              if (thisPair === visiblePairs) {
                                const thisPairData =
                                  thisOptimizerData[thisBacktestingId];
                                thisPairData &&
                                  Object.keys(thisPairData).forEach(
                                    (thisTimeframe) => {
                                      if (thisTimeframe !== visibleTimeframes) {
                                        delete thisPairData[thisTimeframe];
                                      }
                                    }
                                  );
                              } else {
                                delete thisBacktestingData[thisPair];
                              }
                            }
                          );
                      } else {
                        delete thisOptimizerData[thisBacktestingId];
                      }
                    }
                  );
              } else {
                delete thisCampaignData[thisOptimizerId];
              }
            });
        } else {
          delete backtesting[thisCampaign];
        }
      });
  } else {
    delete newPlottedElements.backtesting;
  }
  if (
    JSON.stringify(botPlottedElements) !== JSON.stringify(newPlottedElements)
  ) {
    setBotPlottedElements(newPlottedElements);
  }
}

function loadMissingRuns(
  displayedRunIds,
  botPlottedElements,
  visiblePairs,
  visibleTimeframes,
  visibleExchangeIds,
  visibleExchanges,
  botDomain,
  setBotPlottedElements,
  botInfo
) {
  // load missing runs
  displayedRunIds?.backtesting &&
    displayedRunIds.backtesting.forEach((runIdentifier) => {
      const [
        backtesting_id,
        optimizer_id,
        optimizationCampaign,
      ] = runIdentifier.split(ID_SEPARATOR);
      if (
        !botPlottedElements?.backtesting?.[optimizationCampaign]?.[
          optimizer_id
        ]?.[backtesting_id]?.[visiblePairs]?.[visibleTimeframes]
      ) {
        fetchPlotlyPlotData({
          symbol: visiblePairs,
          timeFrame: visibleTimeframes,
          exchange_id: visibleExchangeIds,
          exchange_name: visibleExchanges,
          botDomain,
          setBotPlottedElements,
          botInfo,
          setHiddenMetadataFromInputs: undefined,
          isLive: false,
          optimizationCampaign,
          backtesting_id,
          optimizer_id,
        });
      }
    });
}

function setHiddenMetadataFromInputs(
  elements,
  setHiddenBacktestingMetadataColumns
) {
  const hiddenBacktestingMetadataColumns: string[] = [];
  function addIfHidden(properties, tentacle) {
    Object.keys(properties).forEach((input) => {
      if (properties[input]?.options?.in_summary === false) {
        hiddenBacktestingMetadataColumns.push(
          userInputKey(input.replaceAll("_", " "), tentacle)
        );
      }
      if (properties[input].properties) {
        addIfHidden(properties[input].properties, tentacle);
      }
    });
  }
  elements.forEach((element) => {
    addIfHidden(element.schema.properties, element.tentacle);
  });
  setHiddenBacktestingMetadataColumns(hiddenBacktestingMetadataColumns);
}

export const BotPlottedElementsProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [botPlottedElements, setBotPlottedElements] = useState<
    PlottedElementsType<PlottedElementNameType> | undefined
  >();
  const [
    hiddenBacktestingMetadataColumns,
    setHiddenBacktestingMetadataColumns,
  ] = useState<string[]>();

  const [displayedRunIds, setDisplayedRunIds] = useState<DisplayedRunIdsType>(
    defaultDisplayedRunIds
  );
  const botInfo = useBotInfoContext();
  const botDomain = useBotDomainContext();
  const currentTentacleConfig = useCurrentTentacleConfig();
  const visiblePairs = useVisiblePairsContext();
  const visibleTimeframes = useVisibleTimeFramesContext();
  const visibleExchanges = useVisibleExchangesContext();
  const uiConfig = useUiConfigContext();
  useEffect(() => {
    // backtestings
    if (
      displayedRunIds &&
      botInfo &&
      visibleTimeframes &&
      visiblePairs &&
      visibleExchanges
    ) {
      clearUnselectedRuns(
        displayedRunIds,
        botPlottedElements,
        setBotPlottedElements,
        visiblePairs,
        visibleTimeframes
      );
      loadMissingRuns(
        displayedRunIds,
        botPlottedElements,
        visiblePairs,
        visibleTimeframes,
        botInfo.ids_by_exchange_name[visibleExchanges],
        visibleExchanges,
        botDomain,
        setBotPlottedElements,
        botInfo
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    displayedRunIds,
    visiblePairs,
    visibleTimeframes,
    visibleExchanges,
    botDomain,
    botInfo,
  ]);

  useEffect(() => {
    // live
    if (botInfo && visibleTimeframes && visiblePairs && visibleExchanges) {
      fetchPlotlyPlotData({
        symbol: visiblePairs,
        timeFrame: visibleTimeframes,
        exchange_id: botInfo.ids_by_exchange_name[visibleExchanges],
        exchange_name: visibleExchanges,
        optimizationCampaign: botInfo.optimization_campaign,
        botDomain,
        setBotPlottedElements,
        botInfo,
        setHiddenMetadataFromInputs: (elements) =>
          setHiddenMetadataFromInputs(
            elements,
            setHiddenBacktestingMetadataColumns
          ),
        isLive: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    botInfo?.exchange_id,
    botDomain,
    visibleTimeframes,
    visiblePairs,
    visibleExchanges,
    uiConfig,
    currentTentacleConfig,
  ]);
  return (
    <DisplayedRunIdsContext.Provider value={displayedRunIds}>
      <UpdateDisplayedRunIdsContext.Provider value={setDisplayedRunIds}>
        <HiddenBacktestingMetadataColumnsContext.Provider
          value={hiddenBacktestingMetadataColumns}
        >
          <UpdateHiddenBacktestingMetadataColumnsContext.Provider
            value={setHiddenBacktestingMetadataColumns}
          >
            <BotPlottedElementsContext.Provider value={botPlottedElements}>
              <UpdateBotPlottedElementsContext.Provider
                value={setBotPlottedElements}
              >
                {children}
              </UpdateBotPlottedElementsContext.Provider>
            </BotPlottedElementsContext.Provider>
          </UpdateHiddenBacktestingMetadataColumnsContext.Provider>
        </HiddenBacktestingMetadataColumnsContext.Provider>
      </UpdateDisplayedRunIdsContext.Provider>
    </DisplayedRunIdsContext.Provider>
  );
};
