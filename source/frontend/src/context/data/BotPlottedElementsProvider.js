import React, { useState, useContext, createContext, useEffect, useCallback } from "react";
import { fetchPlotlyPlotData } from "../../api/data";
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
  const logic = useCallback((isLive = true) => {
    fetchPlotlyPlotData(
      visiblePairs,
      visibleTimeframes,
      botDomain,
      convertAnalysisSettings(isLive ? uiConfig.live_analysis_settings : uiConfig.backtesting_analysis_settings),
      setBotPlottedElements,
      botInfo,
    );
  }, [visiblePairs, visibleTimeframes, botDomain, uiConfig.backtesting_analysis_settings,
    uiConfig.live_analysis_settings, setBotPlottedElements, botInfo]);
  return logic;
};
// export const useFetchPlotData = () => {
//   const updateBotPlottedElements = useUpdateBotPlottedElementsContext()
//   const botInfo = useBotInfoContext();
//   const botDomain = useBotDomainContext();
//   const visiblePairs = useVisiblePairsContext();
//   const visibleTimeframes = useVisibleTimeFramesContext();
//   const logic = useCallback(() => {
//     fetchPlotData(
//       updateBotPlottedElements,
//       botInfo.exchange_id,
//       visiblePairs,
//       visibleTimeframes,
//       botDomain
//     );

//   }, [updateBotPlottedElements, botInfo, botDomain, visibleTimeframes, visiblePairs]);
//   return logic;
// };


function convertAnalysisSettings(analysis_settings, isLive = true) {
  if (isLive) {
    return {
      display_analysis_report: analysis_settings?.live_analysis_report_settings?.live_display_analysis_report,
      display_trades_and_positions: analysis_settings?.live_table_settings?.live_display_trades_and_positions,
      plot_best_case_growth_on_secondary_chart: analysis_settings?.live_plot_settings?.live_secondary_chart_settings?.live_plot_best_case_growth_on_secondary_chart,
      plot_funding_fees_on_secondary_chart: analysis_settings?.live_plot_settings?.live_secondary_chart_settings?.live_plot_funding_fees_on_secondary_chart,
      plot_portfolio_value_on_secondary_chart: analysis_settings?.live_plot_settings?.live_secondary_chart_settings?.live_plot_portfolio_value_on_secondary_chart,
      plot_pnl_on_secondary_chart: analysis_settings?.live_plot_settings?.live_secondary_chart_settings?.live_plot_pnl_on_secondary_chart,
      plot_pnl_on_main_chart: analysis_settings?.live_plot_settings?.live_main_chart_settings?.live_plot_pnl_on_main_chart,
      plot_portfolio_value_on_main_chart: analysis_settings?.live_plot_settings?.live_main_chart_settings?.live_plot_portfolio_value_on_main_chart,
      plot_trade_gains_on_secondary_chart: analysis_settings?.live_plot_settings?.live_secondary_chart_settings?.live_plot_trade_gains_on_secondary_chart,
      plot_trade_gains_on_main_chart: analysis_settings?.live_plot_settings?.live_main_chart_settings?.live_plot_trade_gains_on_main_chart,
      plot_win_rate_on_secondary_chart: analysis_settings?.live_plot_settings?.live_secondary_chart_settings?.live_plot_win_rate_on_secondary_chart,
      plot_wins_and_losses_count_on_secondary_chart: analysis_settings?.live_plot_settings?.live_secondary_chart_settings?.live_plot_wins_and_losses_count_on_secondary_chart,
      display_analysis_report_general: analysis_settings?.live_analysis_report_settings?.live_display_analysis_report_general,
      display_analysis_report_performances: analysis_settings?.live_analysis_report_settings?.live_display_analysis_report_performances,
      display_analysis_report_details: analysis_settings?.live_analysis_report_settings?.live_display_analysis_report_details,
      display_analysis_report_strategy_settings: analysis_settings?.live_analysis_report_settings?.live_display_analysis_report_strategy_settings,
    }
    //     
    // 
    // analysis_settings.live_plot_settings
    // 
  } else {
    return {
      display_analysis_report: analysis_settings.backtest_display_analysis_report,
      display_trades_and_positions: analysis_settings.backtest_display_trades_and_positions,
      plot_best_case_growth_on_secondary_chart: analysis_settings.backtest_plot_best_case_growth_on_secondary_chart,
      plot_funding_fees_on_secondary_chart: analysis_settings.backtest_plot_funding_fees_on_secondary_chart,
      plot_portfolio_value_on_secondary_chart: analysis_settings.backtest_plot_portfolio_value_on_secondary_chart,
      plot_pnl_on_secondary_chart: analysis_settings.backtest_plot_pnl_on_secondary_chart,
      plot_pnl_on_main_chart: analysis_settings.backtest_plot_pnl_on_main_chart,
      plot_portfolio_value_on_main_chart: analysis_settings.backtest_plot_portfolio_value_on_main_chart,
      plot_trade_gains_on_secondary_chart: analysis_settings.backtest_plot_trade_gains_on_secondary_chart,
      plot_trade_gains_on_main_chart: analysis_settings.backtest_plot_trade_gains_on_main_chart,
      plot_win_rate_on_secondary_chart: analysis_settings.backtest_plot_win_rate_on_secondary_chart,
      plot_wins_and_losses_count_on_secondary_chart: analysis_settings.backtest_plot_wins_and_losses_count_on_secondary_chart,
      display_analysis_report_general: analysis_settings.backtest_display_analysis_report_general,
      display_analysis_report_performances: analysis_settings.backtest_display_analysis_report_performances,
      display_analysis_report_details: analysis_settings.backtest_display_analysis_report_details,
      display_analysis_report_strategy_settings: analysis_settings.backtest_display_analysis_report_strategy_settings,
    }
  }
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

  // useEffect(() => {
  //   if (botInfo && visibleTimeframes && visiblePairs) {
  //     fetchPlotData(
  //       setBotPlottedElements,
  //       botInfo.exchange_id,
  //       visiblePairs,
  //       visibleTimeframes,
  //       botDomain
  //     );
  //   }
  // }, [botInfo, botDomain, visibleTimeframes, visiblePairs]);

  useEffect(() => {
    if (botInfo && visibleTimeframes && visiblePairs && uiConfig?.live_analysis_settings) {
      fetchPlotlyPlotData(
        visiblePairs,
        visibleTimeframes,
        botDomain,
        convertAnalysisSettings(uiConfig.live_analysis_settings),
        setBotPlottedElements,
        botInfo,
      );
    }
  }, [botInfo, botDomain, visibleTimeframes, visiblePairs, uiConfig?.live_analysis_settings]);
  return (
    <DisplayedRunIdsContext.Provider value={displayedRunIds}>
      <UpdateDisplayedRunIdsContext.Provider value={setDisplayedRunIds}>
        <HiddenBacktestingMetadataColumnsContext.Provider value={hiddenBacktestingMetadataColumns}>
          <UpdateHiddenBacktestingMetadataColumnsContext.Provider value={setHiddenBacktestingMetadataColumns}>
            <BotPlottedElementsContext.Provider value={botPlottedElements}>
              <UpdateBotPlottedElementsContext.Provider value={setBotPlottedElements}>
                {children}
              </UpdateBotPlottedElementsContext.Provider>
            </BotPlottedElementsContext.Provider>
          </UpdateHiddenBacktestingMetadataColumnsContext.Provider>
        </HiddenBacktestingMetadataColumnsContext.Provider>
      </UpdateDisplayedRunIdsContext.Provider>
    </DisplayedRunIdsContext.Provider>
  );
};
