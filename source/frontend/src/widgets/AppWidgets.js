import React, { createElement } from "react";

import DefaultLayout from "./LayoutWidgets/PageLayouts/DefaultLayout";
import SimpleLayout from "./LayoutWidgets/PageLayouts/SimpleLayout/SimpleLayout";
import MainCharts from "./AppWidgets/Charts/MainCharts";
import AppDrawerDropdown from "./AppWidgets/AppDrawerDropdown";
import ScrollableTabs from "./LayoutWidgets/Tabs/ScrollableTabs";
import Footer from "./LayoutWidgets/Footer";
import SplitMainContent from "./LayoutWidgets/SplitMainContent";
import RestartBotButton from "./AppWidgets/Buttons/RestartBotButton";
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
// import your custom widgets here

const KeysToComponentMap = {
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
  CurrentPanelFullscreen: CurrentPanelFullscreen,
  CurrentPanelMinimize: CurrentPanelMinimize,
  Configuration: Configuration,
  Legend: Legend,
  TimeFrameSelector: TimeFrameSelector,
  ColorModeSwitch: ColorModeSwitch,
  CurrentPortfolioTable: CurrentPortfolioTable,
  AppStore: AppStore,
  TradingConfig: TradingConfig,
};

export default function AppWidgets(props) {
  if (props.layout) {
    return props.layout.map((element) => {
      if (typeof KeysToComponentMap[element.component] !== "undefined") {
        // console.log("widget is loading: "+element.component)
        return createElement(
          KeysToComponentMap[element.component],
          {
            key: element.id,
            dimensions: props.dimensions,
            currentPanel: props.currentPanel,
            ...element,
          }
          // element.children &&
          // (typeof element.children === "string"
          //     ? element.children
          //     : AppWidgets(element.children))
        );
      } else {
        console.log("error loading widget: " + element.component);
        console.log(element);
        return <></>;
      }
    });
  } else {
    console.log("error loading widget: ");
    console.log(props);
    return <></>;
  }
}
