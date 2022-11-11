import { Button } from "@mui/material"
import JsonEditor from "@techfreaque/json-editor-react"
import defaultJsonEditorSettings from "../../../components/Forms/JsonEditor/JsonEditorDefaults"
import createNotification from "../../../components/Notifications/Notification"
import { botLayoutKey } from "../../../constants/backendConstants"
import { useBotLayoutContext } from "../../../context/config/BotLayoutProvider"
import { useSaveUiConfig } from "../../../context/config/UiConfigProvider"
import { registeredComponents } from "../../AppWidgets"
import { availableConfigKeys } from "../Configuration/Form"
import { availableUIConfigKeys } from "../Configuration/UIConfig"

export default function PageBuilder() {
    const botLayout = useBotLayoutContext()
    const saveUiConfig = useSaveUiConfig()
    const editorName = "Page-Builder"
    function handlePageLayoutSaving() {
        const newConfig = { [botLayoutKey]: window.$JsonEditors[editorName].getValue() }
        const success = () => createNotification("Successfully saved new UI layout")
        saveUiConfig(newConfig, success)
    }
    return (
        <>
            <Button variant="contained" onClick={handlePageLayoutSaving}>Save Page Layout</Button>
            <JsonEditor
                {...defaultJsonEditorSettings()}
                schema={pageBuilderSchema(registeredComponents)}
                startval={botLayout}
                editorName={editorName}
                disable_properties={false}
                disable_array_add={false}
                no_additional_properties={false}
                use_name_attributes={true}
                display_required_only={true}
            />
        </>
    )
}

const pageBuilderSchema = (registeredComponents) => {

    const availableComponentsList = ["Tab", ...Object.keys(registeredComponents).map(componentName => componentName).sort()]
    const appWidget = () => {
        return {
            headerTemplate: "{{self.component}} - Component {{i}}",
            "type": "object",
            "properties": {
                component: {
                    type: "string",
                    enum: availableComponentsList,
                    default: "Configuration"
                },
                // custom App Widget props
                ...generateSimpleProp("title", ["Tab", "ButtonWithModal"], "string"),
                ...generateSimpleProp("dontScroll", "Tab", "boolean", "checkbox"),
                ...generateSimpleProp("configKey", "Configuration", "string", undefined, availableConfigKeys),
                ...generateSimpleProp("configKeys", "UIConfig", "array", "select", availableUIConfigKeys, true),
                ...generateSimpleProp("faIcon", "ButtonWithModal", "string"),
                ...generateCustomAppWidgetProp("tabs", "ScrollableTabs"),
                ...generateCustomAppWidgetProp("headerContent", ["DefaultLayout", "SimpleLayout"]),
                ...generateCustomAppWidgetProp("content", ["Tab", "ButtonWithModal"]),
                ...generateCustomAppWidgetProp("pageContent", "SimpleLayout"),
                ...generateCustomAppWidgetProp("upperContent", "DefaultLayout"),
                ...generateCustomAppWidgetProp("lowerContent", "DefaultLayout"),
                ...generateCustomAppWidgetProp("leftContent", ["Header"]),
                ...generateCustomAppWidgetProp("rightContent", ["Header", "ScrollableTabs", "Footer"]),
                ...generateCustomAppWidgetProp("footerContent", ["DefaultLayout", "SimpleLayout"]),
            },
            options: { collapsed: true }
        }
    }

    return {
        type: "array",
        title: "Pages",
        items: {
            type: "object",
            headerTemplate: "{{self.title}} - Page {{i}} - path: {{self.path}}",
            properties: {
                path: { type: "string" },
                title: { type: "string" },
                layout: {
                    type: "array",
                    title: "Page Layout",
                    items: {
                        "$ref": "#/definitions/appWidget"
                    },
                    options: { collapsed: true }
                },
            },
            options: { collapsed: true }
        },
        definitions: { appWidget: appWidget() }
    }
}

function generateCustomAppWidgetProp(propName, dependentComponents) {
    return {
        [propName]: {
            type: "array",
            items: { "$ref": "#/definitions/appWidget" },
            options: {
                dependencies: {
                    component: dependentComponents
                },
                collapsed: true
            },
        },
    }

}

function generateSimpleProp(propName, dependentComponents, type, format, enumList, enumMulti) {
    const items = enumList ?
        (enumMulti
            ? { items: { enum: enumList, type: "string" } }
            : { enum: enumList, type: "string" }
        ) : {}
    return {
        [propName]: {
            type: type,
            format: format,
            ...items,
            options: {
                dependencies: {
                    component: dependentComponents
                }
            },
        },
    }

}

