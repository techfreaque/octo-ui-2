import {iconStringToComponent} from "../../components/Icons/AntIcon";
import {availablePanelPositionsArray} from "../AppWidgets/Buttons/CurrentPanelPosition";
import {allChartLocations} from "../AppWidgets/Charts/MainCharts/Plotly";
import {availableConfigKeysList} from "../AppWidgets/Configuration/Form";
import {availableUIConfigKeys} from "../AppWidgets/Configuration/UIConfig";
import {generateAppWidgetProp, generateSimpleProp} from "../AppWidgets/PageBuilder/PageBuilder";
import {dataTableSourcesList} from "../AppWidgets/Tables/DataTable";

export default function appWidgetsProps() {
    return {
        // add custom App Widget props here
        // add your component name to existing props or generate a new one
        ...generateSimpleProp("title", [
            "Tab", "ButtonWithModal", "SendActionCommandToTradingMode"
        ], "string"),
        ...generateSimpleProp("label", ["SidebarMenuItem"], "string"),
        ...generateSimpleProp("command", ["SendActionCommandToTradingMode"], "string"),
        ...generateSimpleProp("tentacleNames", ["TentaclesConfig"], "string", undefined, undefined, undefined, "RunAnalysisModePlugin"),
        ...generateSimpleProp("dontScroll", [
            "Tab", "SidebarMenuItem"
        ], "boolean", "checkbox"),
        ...generateSimpleProp("noPadding", "SidebarMenuItem", "boolean", "checkbox", undefined, undefined, false),
        ...generateSimpleProp("width", "ButtonWithModal", "string", undefined, undefined, undefined, "1000"),
        ...generateSimpleProp("iconOnly", "ButtonWithModal", "boolean", "checkbox", undefined, undefined, true),
        ...generateSimpleProp("displayAsAvatar", "ButtonWithModal", "boolean", "checkbox", undefined, undefined, false),
        ...generateSimpleProp("configKey", "Configuration", "string", undefined, availableConfigKeysList),
        ...generateSimpleProp("position", "CurrentPanelPosition", "string", undefined, availablePanelPositionsArray),
        ...generateSimpleProp("configKeys", "UIConfig", "array", "select", availableUIConfigKeys, true),
        ...generateSimpleProp("faIcon", [
            "Tab", "ButtonWithModal", "SendActionCommandToTradingMode", "SidebarMenuItem"
        ], "string"),
        ...generateSimpleProp("antIcon", [
            "Tab", "ButtonWithModal", "SendActionCommandToTradingMode", "SidebarMenuItem"
        ], "string", undefined, Object.keys(iconStringToComponent), undefined),
        ...generateSimpleProp("chartLocation", "PlotlyChart", "string", undefined, allChartLocations),
        ...generateSimpleProp("dataSource", "DataTable", "string", undefined, dataTableSourcesList),
        ...generateSimpleProp("minHeights", [
            "DefaultLayout", "SplitMainContent"
        ], "string", undefined, undefined, undefined, "0, 0"),
        ...generateAppWidgetProp("additionalTabs", "TentaclesConfig"),
        ...generateAppWidgetProp("tabs", "ScrollableTabs"),
        ...generateAppWidgetProp("settingsContent", "ChartTablePieCombo"),
        ...generateAppWidgetProp("headerContent", ["DefaultLayout", "SimpleLayout"]),
        ...generateAppWidgetProp("content", [
            "AppStoreCartModal",
            "SidebarMenuItem",
            "Tab",
            "ButtonWithModal",
            "TradingConfig",
            "TentaclesConfig",
            "PairsSelector"
        ]),
        ...generateAppWidgetProp("toolBarContent", ["Tab"]),
        ...generateAppWidgetProp("pageContent", "SimpleLayout"),
        ...generateAppWidgetProp("upperContent", ["DefaultLayout", "SplitMainContent"]),
        ...generateAppWidgetProp("lowerContent", ["DefaultLayout", "SplitMainContent"]),
        ...generateAppWidgetProp("leftContent", ["Header"]),
        ...generateAppWidgetProp("sideBarContent", ["Sidebar"]),
        ...generateAppWidgetProp("children", ["SidebarMenuItem"]),
        ...generateAppWidgetProp("rightContent", ["Header", "ScrollableTabs", "Footer"]),
        ...generateAppWidgetProp("footerContent", ["DefaultLayout", "SimpleLayout"])
    }
}
