import type {
  Dispatch,
  SetStateAction} from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  fetchPlotlyBacktestingPlotData,
  fetchPlotlyLivePlotData,
} from "../../api/data";
import type { PlotSourceType } from "../../constants/backendConstants";
import { ID_SEPARATOR } from "../../constants/backendConstants";
import { emptyValueFunction } from "../../helpers/helpers";
import type { ChartType } from "../../widgets/AppWidgets/Charts/ChartTablePieCombo";
import type {
  ChartLocationType,
  NonChartLocationTypes,
} from "../../widgets/AppWidgets/Charts/MainCharts/Plotly";
import type { MarkerAttributesType } from "../../widgets/AppWidgets/Charts/MainCharts/PlotlyGenerateData";
import { useCurrentTentacleConfig } from "../../widgets/AppWidgets/Configuration/TentaclesConfig";
import type {
  DataTableColumnType,
  DataTableDataType,
} from "../../widgets/AppWidgets/Tables/DataTable";
import {
  mergeRunIdentifiers,
  splitRunIdentifiers,
} from "../../widgets/AppWidgets/Tables/RunDataTable/AntRunDataTable";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { useUiConfigContext } from "../config/UiConfigProvider";
import { useVisibleExchangesContext } from "../config/VisibleExchangesProvider";
import { useVisiblePairsContext } from "../config/VisiblePairProvider";
import { useVisibleTimeFramesContext } from "../config/VisibleTimeFrameProvider";
import { useBotInfoContext } from "./BotInfoProvider";

export type ChartDetailsType = {
  own_yaxis?: boolean;
  own_xaxis?: boolean;
  x_type?: "date";
  y_type?: "date" | null;
  labels?: null | string[];
  text?: null;
  values?: null | number[];
  value?: null;
  columns?: DataTableColumnType[];
  rows?: DataTableDataType[];
  kind?: "candlestick" | "scattergl" | "pie";
  mode?: "lines";
  title: string;
  config?: {
    antIcon?: string;
    faIcon?: string;
  };
  hole?: number | null;
  line_shape?: "linear";
} & {
  [candleSource in PlotSourceType]: number[] | null;
} &
  {
    [markerAtribute in MarkerAttributesType]:
      | null
      | string[]
      | number[]
      | undefined;
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
>(emptyValueFunction);
const HiddenBacktestingMetadataColumnsContext = createContext<
  string[] | undefined
>(undefined);
const UpdateHiddenBacktestingMetadataColumnsContext = createContext<
  Dispatch<SetStateAction<string[] | undefined>>
>(emptyValueFunction);

export interface DisplayedRunIdsType {
  live: string[];
  backtesting: string[];
}

export const defaultDisplayedRunIds: DisplayedRunIdsType = {
  live: [],
  backtesting: [],
};

const DisplayedRunIdsContext = createContext<DisplayedRunIdsType>(
  defaultDisplayedRunIds
);
const UpdateDisplayedRunIdsContext = createContext<
  Dispatch<SetStateAction<DisplayedRunIdsType>>
>(emptyValueFunction);

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
  const visibleExchanges = useVisibleExchangesContext();
  const visibleExchangeIds =
    botInfo &&
    visibleExchanges &&
    botInfo.ids_by_exchange_name[visibleExchanges];
  return useCallback(
    (onDone?: () => void) => {
      if (visiblePairs && visibleTimeframes && visibleExchangeIds) {
        fetchPlotlyLivePlotData({
          symbol: visiblePairs,
          timeFrame: visibleTimeframes,
          exchangeId: visibleExchangeIds,
          exchangeName: visibleExchanges,
          botDomain,
          optimizationCampaign: botInfo.optimization_campaign,
          setBotPlottedElements,
          liveId: botInfo.live_id,
          onDone,
        });
      }
    },
    [
      visiblePairs,
      visibleTimeframes,
      visibleExchangeIds,
      visibleExchanges,
      botDomain,
      botInfo,
      setBotPlottedElements,
    ]
  );
};

function clearUnselectedRuns(
  displayedRunIds: DisplayedRunIdsType,
  botPlottedElements:
    | PlottedElementsType<PlottedElementBacktestingNameType>
    | undefined,
  setBotPlottedElements: Dispatch<
    SetStateAction<PlottedElementsType<PlottedElementNameType> | undefined>
  >,
  visiblePairs: string,
  visibleTimeframes: string
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
                            mergeRunIdentifiers(
                              thisBacktestingId,
                              thisOptimizerId,
                              thisCampaign
                            )
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
  displayedRunIds: DisplayedRunIdsType,
  botPlottedElements:
    | PlottedElementsType<PlottedElementBacktestingNameType>
    | undefined,
  visiblePairs: string,
  visibleTimeframes: string,
  visibleExchangeIds: string,
  visibleExchanges: string,
  botDomain: string,
  setBotPlottedElements: Dispatch<
    SetStateAction<PlottedElementsType<PlottedElementNameType> | undefined>
  >
) {
  // load missing runs
  displayedRunIds?.backtesting?.forEach((runIdentifier) => {
    const { backtestingId, optimizerId, campaignName } = splitRunIdentifiers(
      runIdentifier
    );
    if (
      !botPlottedElements?.backtesting?.[campaignName]?.[optimizerId]?.[
        backtestingId
      ]?.[visiblePairs]?.[visibleTimeframes]
    ) {
      fetchPlotlyBacktestingPlotData({
        symbol: visiblePairs,
        timeFrame: visibleTimeframes,
        exchangeId: visibleExchangeIds,
        exchangeName: visibleExchanges,
        botDomain,
        setBotPlottedElements,
        optimizationCampaign: campaignName,
        backtestingId: String(backtestingId),
        optimizerId: String(optimizerId),
      });
    }
  });
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
  const visibleExchangeIds =
    botInfo &&
    visibleExchanges &&
    botInfo.ids_by_exchange_name[visibleExchanges];
  useEffect(() => {
    // backtesting
    if (
      displayedRunIds &&
      visibleTimeframes &&
      visiblePairs &&
      visibleExchangeIds
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
        visibleExchangeIds,
        visibleExchanges,
        botDomain,
        setBotPlottedElements
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
    if (
      visibleExchangeIds &&
      visibleTimeframes &&
      visiblePairs &&
      visibleExchanges
    ) {
      fetchPlotlyLivePlotData({
        symbol: visiblePairs,
        timeFrame: visibleTimeframes,
        exchangeId: visibleExchangeIds,
        exchangeName: visibleExchanges,
        optimizationCampaign: botInfo.optimization_campaign,
        botDomain,
        setBotPlottedElements,
        liveId: botInfo.live_id,
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
