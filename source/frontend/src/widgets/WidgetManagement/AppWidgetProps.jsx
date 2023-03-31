import {iconStringNoIcon, iconStringToComponent} from "../../components/Icons/AntIcon";
import {availableStorages} from "../AppWidgets/Buttons/ResetHistoryStorageButton";
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
        ...generateSimpleProp("dontScroll", "Tab", "boolean", "checkbox"),
        ...generateSimpleProp("configKey", "Configuration", "string", undefined, availableConfigKeysList),
        ...generateSimpleProp("configKeys", "UIConfig", "array", "select", availableUIConfigKeys, true),
        ...generateSimpleProp("faIcon", ["Tab","ButtonWithModal","SendActionCommandToTradingMode", "SidebarMenuItem"], "string"),
        ...generateSimpleProp("icon", ["Tab",
            "ButtonWithModal", "SendActionCommandToTradingMode", "SidebarMenuItem"
        ], "string", undefined, Object.keys(iconStringToComponent), undefined),
        ...generateSimpleProp("chartLocation", "PlotlyChart", "string", undefined, allChartLocations),
        ...generateSimpleProp("dataSource", "DataTable", "string", undefined, dataTableSourcesList),
        ...generateSimpleProp("storageName", "ResetHistoryStorageButton", "string", undefined, availableStorages),
        ...generateSimpleProp("minHeights", [
            "DefaultLayout", "SplitMainContent"
        ], "string", undefined, undefined, undefined, "0, 0"),
        ...generateAppWidgetProp("tabs", "ScrollableTabs"),
        ...generateAppWidgetProp("headerContent", ["DefaultLayout", "SimpleLayout"]),
        ...generateAppWidgetProp("content", ["SidebarMenuItem", "Tab", "ButtonWithModal", "TradingConfig"]),
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
