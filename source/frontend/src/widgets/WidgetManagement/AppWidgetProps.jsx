import { availableConfigKeys } from "../AppWidgets/Configuration/Form";
import { availableUIConfigKeys } from "../AppWidgets/Configuration/UIConfig";
import { generateCustomAppWidgetProp, generateSimpleProp } from "../AppWidgets/PageBuilder/PageBuilder";

export default function appWidgetsProps(){
    return {
        // add custom App Widget props here
        ...generateSimpleProp("title", ["Tab", "ButtonWithModal", "SendActionCommandToTradingMode"], "string"),
        ...generateSimpleProp("command", ["SendActionCommandToTradingMode"], "string"),
        ...generateSimpleProp("dontScroll", "Tab", "boolean", "checkbox"),
        ...generateSimpleProp("configKey", "Configuration", "string", undefined, availableConfigKeys),
        ...generateSimpleProp("configKeys", "UIConfig", "array", "select", availableUIConfigKeys, true),
        ...generateSimpleProp("faIcon", ["ButtonWithModal", "SendActionCommandToTradingMode"], "string"),
        ...generateCustomAppWidgetProp("tabs", "ScrollableTabs"),
        ...generateCustomAppWidgetProp("headerContent", ["DefaultLayout", "SimpleLayout"]),
        ...generateCustomAppWidgetProp("content", ["Tab", "ButtonWithModal", "TradingConfig"]),
        ...generateCustomAppWidgetProp("pageContent", "SimpleLayout"),
        ...generateCustomAppWidgetProp("upperContent", "DefaultLayout"),
        ...generateCustomAppWidgetProp("lowerContent", "DefaultLayout"),
        ...generateCustomAppWidgetProp("leftContent", ["Header"]),
        ...generateCustomAppWidgetProp("rightContent", ["Header", "ScrollableTabs", "Footer"]),
        ...generateCustomAppWidgetProp("footerContent", ["DefaultLayout", "SimpleLayout"]),
    }
}