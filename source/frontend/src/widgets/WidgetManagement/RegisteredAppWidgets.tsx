import AppDrawerDropdown from "../AppWidgets/AppDrawerDropdown";
import AddToOptimizerQueueButton from "../AppWidgets/Buttons/AddToOptimizerQueueButton";
import CancelAllOrdersButton from "../AppWidgets/Buttons/CancelAllOrdersButton";
import CloseAllPositionsButton from "../AppWidgets/Buttons/CloseAllPositionsButton";
import ClosePairSelector from "../AppWidgets/Buttons/ClosePairSelector";
import ColorModeSwitch from "../AppWidgets/Buttons/ColorModeSwitcher";
import CurrentPanelPosition from "../AppWidgets/Buttons/CurrentPanelPosition";
import LanguageSwitch from "../AppWidgets/Buttons/LanguageSwitch";
import LogoutButton from "../AppWidgets/Buttons/LogoutButton";
import RefreshBotData from "../AppWidgets/Buttons/RefreshData";
import RestartBotButton from "../AppWidgets/Buttons/RestartBotButton";
import SavePairSelector from "../AppWidgets/Buttons/SavePairSelector";
import SaveTradingModeSettings from "../AppWidgets/Buttons/SaveTradingModeSettings";
import SendActionCommandToTradingMode from "../AppWidgets/Buttons/SendActionCommandToTradingMode";
import StartBacktestingButton from "../AppWidgets/Buttons/StartBacktestingButton";
import StartOptimizerButton from "../AppWidgets/Buttons/StartOptimizerButton";
import StopBacktestingButton from "../AppWidgets/Buttons/StopBacktestingButton";
import StopBotButton from "../AppWidgets/Buttons/StopBotButton";
import StopOptimizerButton from "../AppWidgets/Buttons/StopOptimizerButton";
import StopTrainingButton from "../AppWidgets/Buttons/StopTrainingButton";
import ToggleActivateRealTimeStrategy from "../AppWidgets/Buttons/ToggleActivateRealTimeStrategy";
import UpdateBotButton from "../AppWidgets/Buttons/UpdateBotButton";
import ChartTablePieCombo, {
  ChartTypeSelector,
} from "../AppWidgets/Charts/ChartTablePieCombo";
import OptimizerConfigForm, {
  OptimizerNotInstalled,
} from "../AppWidgets/Configuration/OptimizerConfigForm/OptimizerConfigForm";
import ServicesConfig from "../AppWidgets/Configuration/ServicesConfig";
import RealTradingSwitch from "../AppWidgets/Configuration/SwitchRealTrading/SwitchRealTrading";
import TentaclesConfig from "../AppWidgets/Configuration/TentaclesConfig";
import UIConfig from "../AppWidgets/Configuration/UIConfig";
import ExchangeSelector from "../AppWidgets/ExchangeSelector/ExchangeSelector";
import ButtonWithModal from "../AppWidgets/Modals/ButtonWithModal";
import PowerMenu from "../AppWidgets/Modals/PowerMenu/PowerMenu";
import NotificationCenter from "../AppWidgets/NotificationCenter/NotificationCenter";
import Logo from "../AppWidgets/other/Logo";
import PageBuilder from "../AppWidgets/PageBuilder/PageBuilder";
import PairsSelector from "../AppWidgets/PairsSelector/PairsSelector";
import PairsTable from "../AppWidgets/PairsSelector/PairsTable";
import BacktestingProgress from "../AppWidgets/Progress/BacktestingProgress";
import DataCollectorProgress from "../AppWidgets/Progress/DataCollectorProgress";
import OptimizerProgress from "../AppWidgets/Progress/OptimizerProgress";
import { CloudDeployment } from "../AppWidgets/ProjectPage/CloudDeployment";
import DemoInfo from "../AppWidgets/ProjectPage/DemoInfo";
import ProjectHomePage, {
  ProjectHomePageModal,
} from "../AppWidgets/ProjectPage/Home";
import ResetConfigs from "../AppWidgets/ResetConfigs/ResetConfigs";
import OptimizerQueueSize from "../AppWidgets/Stats/OptimizerQueueSize";
import OptimizerRunsToBeAdded from "../AppWidgets/Stats/OptimizerRunsToBeAdded";
import AppStoreCartModal, {
  AppStoreCart,
} from "../AppWidgets/StrategyConfigurator/Cart";
import LoginManager from "../AppWidgets/StrategyConfigurator/Dashboard/Login";
import AppStore from "../AppWidgets/StrategyConfigurator/StrategyConfigurator";
import CurrentPortfolioTable from "../AppWidgets/Tables/CurrentPortfolio";
import OptimizerQueueTable from "../AppWidgets/Tables/OptimizerQueue";
import { BacktestingRunDataTable } from "../AppWidgets/Tables/RunDataTable/BacktestingRunDataTable";
import TimeFrameSelector from "../AppWidgets/TimeFrameSelector/TimeFrameSelector";
import Footer from "../LayoutWidgets/Footer";
import Header from "../LayoutWidgets/Header";
import DefaultLayout from "../LayoutWidgets/PageLayouts/DefaultLayout";
import SimpleLayout from "../LayoutWidgets/PageLayouts/SimpleLayout/SimpleLayout";
import Sidebar, { SidebarMenuItem } from "../LayoutWidgets/Sidebar/Sidebar";
import SplitMainContent from "../LayoutWidgets/SplitMainContent";
import ScrollableTabs from "../LayoutWidgets/Tabs/ScrollableTabs";
// import your custom widgets here

export type NonAppWidgetNameType =
  // non AppWidgets Widgets
  "Tab" | "SidebarMenuItem" | "PlotlyChart";

export type AppWidgetNameType =
  | "DefaultLayout"
  | "SimpleLayout"
  | "Header"
  | "AppDrawerDropdown"
  | "ScrollableTabs"
  | "Footer"
  | "SplitMainContent"
  | "RestartBotButton"
  | "StopBotButton"
  | "UpdateBotButton"
  | "StartBacktestingButton"
  | "StopBacktestingButton"
  | "StartOptimizerButton"
  | "StopOptimizerButton"
  | "RefreshBotData"
  | "TimeFrameSelector"
  | "ColorModeSwitch"
  | "CurrentPortfolioTable"
  | "OptimizerQueueSize"
  | "AppStore"
  | "PairsSelector"
  | "BacktestingRunDataTable"
  | "UIConfig"
  | "OptimizerQueueTable"
  | "OptimizerConfigForm"
  | "OptimizerRunsToBeAdded"
  | "AddToOptimizerQueueButton"
  | "PageBuilder"
  | "ButtonWithModal"
  | "RealTradingSwitch"
  | "CloseAllPositionsButton"
  | "CancelAllOrdersButton"
  | "PowerMenu"
  | "SendActionCommandToTradingMode"
  | "ToggleActivateRealTimeStrategy"
  | "LogoutButton"
  | "Sidebar"
  | "SidebarMenuItem"
  | "NotificationCenter"
  | "TentaclesConfig"
  | "Logo"
  | "ChartTablePieCombo"
  | "ChartTypeSelector"
  | "LanguageSwitch"
  | "ResetConfigs"
  | "PairsTable"
  | "ExchangeSelector"
  | "BacktestingProgress"
  | "OptimizerProgress"
  | "CurrentPanelPosition"
  | "DataCollectorProgress"
  | "ClosePairSelector"
  | "SavePairSelector"
  | "LoginManager"
  | "AppStoreCart"
  | "AppStoreCartModal"
  | "SaveTradingModeSettings"
  | "StopTrainingButton"
  | "ProjectHomePage"
  | "ProjectHomePageModal"
  | "OptimizerNotInstalled"
  | "DemoInfo"
  | "ServicesConfig"
  | "CloudDeployment";

export const registeredComponents: { [key in AppWidgetNameType]: any } = {
  // define your custom widget here
  DefaultLayout,
  SimpleLayout,
  Header,
  AppDrawerDropdown,
  ScrollableTabs,
  Footer,
  SplitMainContent,
  RestartBotButton,
  StopBotButton,
  UpdateBotButton,
  StartBacktestingButton,
  StopBacktestingButton,
  StartOptimizerButton,
  StopOptimizerButton,
  RefreshBotData,
  TimeFrameSelector,
  ColorModeSwitch,
  CurrentPortfolioTable,
  OptimizerQueueSize,
  AppStore,
  PairsSelector,
  BacktestingRunDataTable,
  UIConfig,
  OptimizerQueueTable,
  OptimizerConfigForm,
  OptimizerRunsToBeAdded,
  AddToOptimizerQueueButton,
  PageBuilder,
  ButtonWithModal,
  RealTradingSwitch,
  CloseAllPositionsButton,
  CancelAllOrdersButton,
  PowerMenu,
  SendActionCommandToTradingMode,
  // OptimizerConfigForm2,
  ToggleActivateRealTimeStrategy,
  LogoutButton,
  Sidebar,
  SidebarMenuItem,
  NotificationCenter,
  TentaclesConfig,
  Logo,
  ChartTablePieCombo,
  ChartTypeSelector,
  LanguageSwitch,
  ResetConfigs,
  PairsTable,
  ExchangeSelector,
  BacktestingProgress,
  OptimizerProgress,
  CurrentPanelPosition,
  DataCollectorProgress,
  ClosePairSelector,
  SavePairSelector,
  LoginManager,
  AppStoreCart,
  AppStoreCartModal,
  SaveTradingModeSettings,
  StopTrainingButton,
  ProjectHomePage,
  ProjectHomePageModal,
  OptimizerNotInstalled,
  DemoInfo,
  ServicesConfig,
  CloudDeployment,
};
