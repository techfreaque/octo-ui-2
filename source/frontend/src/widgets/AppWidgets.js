import { createElement } from "react";
import { useMemo } from "react";

import DefaultLayout from "./LayoutWidgets/PageLayouts/DefaultLayout";
import SimpleLayout from "./LayoutWidgets/PageLayouts/SimpleLayout/SimpleLayout";
import MainCharts from "./AppWidgets/Charts/MainCharts";
import AppDrawerDropdown from "./AppWidgets/AppDrawerDropdown";
import ScrollableTabs from "./LayoutWidgets/Tabs/ScrollableTabs";
import Footer from "./LayoutWidgets/Footer";
import SplitMainContent from "./LayoutWidgets/SplitMainContent";
import CurrentPanelFullscreen from "./AppWidgets/Buttons/CurrentPanelFullscreen";
import CurrentPanelMinimize from "./AppWidgets/Buttons/CurrentPanelMinimize";
import Configuration from "./AppWidgets/Configuration/Form";
import Legend from "./AppWidgets/PlotSources/Legend";
import TimeFrameSelector from "./AppWidgets/TimeFrameSelector/TimeFrameSelector";
import Header from "./LayoutWidgets/Header";
import ColorModeSwitch from "./AppWidgets/Buttons/ColorModeSwitcher";
import AppStore from "./AppWidgets/AppStore/AppStore";
import CurrentPortfolioTable from "./AppWidgets/Tables/CurrentPortfolio";
import TradingConfig from "./AppWidgets/Configuration/TradingConfig";
import PairsSelector from "./AppWidgets/PairsSelector/PairsSelector";
import { BacktestingRunDataTable } from "./AppWidgets/Tables/RunDataTableW2UI";
import UIConfig from "./AppWidgets/Configuration/UIConfig";
import StartBacktestingButton from "./AppWidgets/Buttons/StartBacktestingButton";
import StopBacktestingButton from "./AppWidgets/Buttons/StopBacktestingButton";
import OptimizerQueueTable from "./AppWidgets/Tables/OptimizerQueue";
import OptimizerConfigForm from "./AppWidgets/Configuration/OptimizerConfigForm/OptimizerConfigForm";
import OptimizerRunsToBeAdded from "./AppWidgets/Stats/OptimizerRunsToBeAdded";
import StartOptimizerButton from "./AppWidgets/Buttons/StartOptimizerButton";
import StopOptimizerButton from "./AppWidgets/Buttons/StopOptimizerButton";
import AddToOptimizerQueueButton from "./AppWidgets/Buttons/AddToOptimizerQueueButton";
import PageBuilder from "./AppWidgets/PageBuilder/PageBuilder";
import ButtonWithModal from "./AppWidgets/Modals/ButtonWithModal";
import RealTradingSwitch from "./AppWidgets/Configuration/SwitchRealTrading/SwitchRealTrading";
import StopBotButton from "./AppWidgets/Buttons/StopBotButton";
import RestartBotButton from "./AppWidgets/Buttons/RestartBotButton";
import UpdateBotButton from "./AppWidgets/Buttons/UpdateBotButton";
import PowerMenu from "./AppWidgets/Modals/PowerMenu";
// import your custom widgets here

export const registeredComponents = {
  // define your custom widget here
  DefaultLayout: DefaultLayout,
  SimpleLayout: SimpleLayout,
  Header: Header,
  MainCharts: MainCharts,
  AppDrawerDropdown: AppDrawerDropdown,
  ScrollableTabs: ScrollableTabs,
  Footer: Footer,
  SplitMainContent: SplitMainContent,
  RestartBotButton: RestartBotButton,
  StopBotButton: StopBotButton,
  UpdateBotButton: UpdateBotButton,
  StartBacktestingButton: StartBacktestingButton,
  StopBacktestingButton: StopBacktestingButton,
  StartOptimizerButton: StartOptimizerButton,
  StopOptimizerButton: StopOptimizerButton,
  CurrentPanelFullscreen: CurrentPanelFullscreen,
  CurrentPanelMinimize: CurrentPanelMinimize,
  Configuration: Configuration,
  Legend: Legend,
  TimeFrameSelector: TimeFrameSelector,
  ColorModeSwitch: ColorModeSwitch,
  CurrentPortfolioTable: CurrentPortfolioTable,
  AppStore: AppStore,
  TradingConfig: TradingConfig,
  PairsSelector: PairsSelector,
  BacktestingRunDataTable: BacktestingRunDataTable,
  UIConfig: UIConfig,
  OptimizerQueueTable: OptimizerQueueTable,
  OptimizerConfigForm: OptimizerConfigForm,
  OptimizerRunsToBeAdded: OptimizerRunsToBeAdded,
  AddToOptimizerQueueButton: AddToOptimizerQueueButton,
  PageBuilder: PageBuilder,
  ButtonWithModal: ButtonWithModal,
  RealTradingSwitch: RealTradingSwitch,
  PowerMenu: PowerMenu,
};

export default function AppWidgets(props) {
  return useMemo(() => {
    if (props.layout && props.layout[0]) {
      return props.layout.map((element, index) => {
        if (typeof registeredComponents[element.component] !== "undefined") {
          // console.log("widget is loading: " + element.component, element)
          return createElement(
            registeredComponents[element.component],
            { key: index, id: index, ...element }
          );
        } else {
          console.log("error loading widget: ", element.component, element, props);
          return <></>;
        }
      });
    }
    // else {
    //   console.log("widget doesnt have a layout:", props);
    // }
  }, [props])
}
