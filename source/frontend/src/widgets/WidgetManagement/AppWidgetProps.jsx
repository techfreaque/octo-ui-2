import { availableStorages } from "../AppWidgets/Buttons/ResetHistoryStorageButton";
import {allChartLocations} from "../AppWidgets/Charts/MainCharts/Plotly";
import {availableConfigKeys} from "../AppWidgets/Configuration/Form";
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
        ...generateSimpleProp("command", ["SendActionCommandToTradingMode"], "string"),
        ...generateSimpleProp("dontScroll", "Tab", "boolean", "checkbox"),
        ...generateSimpleProp("configKey", "Configuration", "string", undefined, availableConfigKeys),
        ...generateSimpleProp("configKeys", "UIConfig", "array", "select", availableUIConfigKeys, true),
        ...generateSimpleProp("faIcon", [
            "ButtonWithModal", "SendActionCommandToTradingMode"
        ], "string"),
        ...generateSimpleProp("chartLocation", "PlotlyChart", "string", undefined, allChartLocations),
        ...generateSimpleProp("dataSource", "DataTable", "string", undefined, dataTableSourcesList),
        ...generateSimpleProp("storageName", "ResetHistoryStorageButton", "string", undefined, availableStorages),
        ...generateSimpleProp("minHeights", [
            "DefaultLayout", "SplitMainContent"
        ], "string", undefined, undefined, undefined, "0, 0"),
        ...generateAppWidgetProp("tabs", "ScrollableTabs"),
        ...generateAppWidgetProp("headerContent", ["DefaultLayout", "SimpleLayout"]),
        ...generateAppWidgetProp("content", ["Tab", "ButtonWithModal", "TradingConfig"]),
        ...generateAppWidgetProp("pageContent", "SimpleLayout"),
        ...generateAppWidgetProp("upperContent", ["DefaultLayout", "SplitMainContent"]),
        ...generateAppWidgetProp("lowerContent", ["DefaultLayout", "SplitMainContent"]),
        ...generateAppWidgetProp("leftContent", ["Header"]),
        ...generateAppWidgetProp("rightContent", ["Header", "ScrollableTabs", "Footer"]),
        ...generateAppWidgetProp("footerContent", ["DefaultLayout", "SimpleLayout"])
    }
}
