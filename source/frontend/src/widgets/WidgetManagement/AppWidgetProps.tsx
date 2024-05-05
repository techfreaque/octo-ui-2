import { iconStringToComponent } from "../../components/Icons/AntIcon";
import { availablePanelPositionsArray } from "../AppWidgets/Buttons/CurrentPanelPosition";
import { allChartLocations } from "../AppWidgets/Charts/MainCharts/Plotly";
import { availableUIConfigKeys } from "../AppWidgets/Configuration/UIConfig";
import {
  generateAppWidgetProp,
  generateSimpleProp,
} from "../AppWidgets/PageBuilder/PageBuilder";

export default function appWidgetsProps() {
  return {
    // add custom App Widget props here
    // add your component name to existing props or generate a new one

    ...generateSimpleProp({
      propName: "title",
      dependentComponents: [
        "Tab",
        "ButtonWithModal",
        "SendActionCommandToTradingMode",
      ],
      type: "string",
    }),
    ...generateSimpleProp({
      propName: "label",
      dependentComponents: ["SidebarMenuItem"],
      type: "string",
    }),
    ...generateSimpleProp({
      propName: "command",
      dependentComponents: ["SendActionCommandToTradingMode"],
      type: "string",
    }),
    ...generateSimpleProp({
      propName: "tentacleNames",
      dependentComponents: ["TentaclesConfig"],
      type: "string",
      defaultValue: "RunAnalysisModePlugin",
    }),
    ...generateSimpleProp({
      propName: "dontScroll",
      dependentComponents: ["Tab"],
      defaultValue: "SidebarMenuItem",
      type: "boolean",
      format: "checkbox",
    }),
    ...generateSimpleProp({
      propName: "noPadding",
      dependentComponents: "SidebarMenuItem",
      type: "boolean",
      format: "checkbox",
      defaultValue: false,
    }),
    ...generateSimpleProp({
      propName: "width",
      dependentComponents: "ButtonWithModal",
      type: "string",
      defaultValue: "1000",
    }),
    ...generateSimpleProp({
      propName: "iconOnly",
      dependentComponents: "ButtonWithModal",
      type: "boolean",
      format: "checkbox",
      defaultValue: true,
    }),
    ...generateSimpleProp({
      propName: "displayAsAvatar",
      dependentComponents: "ButtonWithModal",
      type: "boolean",
      format: "checkbox",
      defaultValue: false,
    }),
    ...generateSimpleProp({
      propName: "position",
      dependentComponents: "CurrentPanelPosition",
      type: "string",
      enumList: availablePanelPositionsArray,
    }),
    ...generateSimpleProp({
      propName: "configKeys",
      dependentComponents: "UIConfig",
      type: "array",
      format: "select",
      enumList: availableUIConfigKeys,
      enumMulti: true,
    }),
    ...generateSimpleProp({
      propName: "faIcon",
      dependentComponents: [
        "Tab",
        "ButtonWithModal",
        "SendActionCommandToTradingMode",
        "SidebarMenuItem",
      ],
      type: "string",
    }),
    ...generateSimpleProp({
      propName: "antIcon",
      dependentComponents: [
        "Tab",
        "ButtonWithModal",
        "SendActionCommandToTradingMode",
        "SidebarMenuItem",
      ],
      type: "string",
      enumList: Object.keys(iconStringToComponent),
    }),
    ...generateSimpleProp({
      propName: "chartLocation",
      dependentComponents: "PlotlyChart",
      type: "string",
      enumList: allChartLocations,
    }),
    ...generateSimpleProp({
      propName: "minHeights",
      dependentComponents: ["DefaultLayout", "SplitMainContent"],
      type: "string",
      defaultValue: "0, 0",
    }),
    ...generateAppWidgetProp("additionalTabs", "TentaclesConfig"),
    ...generateAppWidgetProp("tabs", "ScrollableTabs"),
    ...generateAppWidgetProp("settingsContent", "ChartTablePieCombo"),
    ...generateAppWidgetProp("headerContent", [
      "DefaultLayout",
      "SimpleLayout",
    ]),
    ...generateAppWidgetProp("content", [
      "AppStoreCartModal",
      "SidebarMenuItem",
      "Tab",
      "ButtonWithModal",
      "TentaclesConfig",
      "PairsSelector",
    ]),
    ...generateAppWidgetProp("toolBarContent", ["Tab"]),
    ...generateAppWidgetProp("pageContent", "SimpleLayout"),
    ...generateAppWidgetProp("upperContent", [
      "DefaultLayout",
      "SplitMainContent",
    ]),
    ...generateAppWidgetProp("lowerContent", [
      "DefaultLayout",
      "SplitMainContent",
    ]),
    ...generateAppWidgetProp("leftContent", ["Header"]),
    ...generateAppWidgetProp("sideBarContent", ["Sidebar"]),
    ...generateAppWidgetProp("children", ["SidebarMenuItem"]),
    ...generateAppWidgetProp("rightContent", [
      "Header",
      "ScrollableTabs",
      "Footer",
    ]),
    ...generateAppWidgetProp("footerContent", [
      "DefaultLayout",
      "SimpleLayout",
    ]),
  };
}
