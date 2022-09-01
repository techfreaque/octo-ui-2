import React from "react";

import Header from "../LayoutWidgets/Header";
import MainCharts from "./Charts/MainCharts";
import AppDrawerDropdown from "./AppDrawerDropdown";
import ScrollableTabs from "../LayoutWidgets/Tabs/ScrollableTabs";
import Footer from "../LayoutWidgets/Footer";
import SplitMainContent from "../LayoutWidgets/SplitMainContent";
import RestartBotButton from "./Buttons/RestartBotButton";
import CurrentPanelFullscreen from "./Buttons/CurrentPanelFullscreen";
import CurrentPanelMinimize from "./Buttons/CurrentPanelMinimize";
import Configuration from "./Configuration/Form";
import Legend from "./PlotSources/Legend";
// import your custom widgets here

const KeysToComponentMap = {
    // define your custom widget here
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
    Legend: Legend
  };
  
export default function AppWidgets(props) {
    if (props.layout) {
        return props.layout.map(element => {
            if (typeof KeysToComponentMap[element.component] !== "undefined") {
                // console.log("widget is loading: "+element.component)
                return React.createElement(
                    KeysToComponentMap[element.component],
                    {
                    key: element.id,
                    dimensions: props.dimensions,
                    currentPanel: props.currentPanel,
                    ...element,
                    },
                    element.children &&
                    (typeof element.children === "string"
                        ? element.children
                        : AppWidgets(element.children))
                );
            } else {
                console.log("error loading widget: "+element.component)
                return <></>
            }
        })
    } else {
        console.log("error loading widget: ")
        console.log(props)
        return <></>
    } 
}
