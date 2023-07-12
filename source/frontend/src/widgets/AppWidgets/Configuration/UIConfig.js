import {useCallback, useMemo} from "react";
import {getUiConfigSchema} from "./uiConfigSchema";
import defaultJsonEditorSettings from "../../../components/Forms/JsonEditor/JsonEditorDefaults";
import {useSaveUiConfig, useUiConfigContext} from "../../../context/config/UiConfigProvider";
import {useBotInfoContext} from "../../../context/data/BotInfoProvider";
import "./uiConfig.css"
import JsonEditor from "../../../components/Forms/JsonEditor/jedit";

export const flowEditorSettingsName = "flow_editor_settings"

export const availableUIConfigKeys = [
    "backtesting_run_settings",
    "backtesting_analysis_settings",
    "live_analysis_settings",
    "optimizer_campaigns_to_load",
    "optimizer_run_settings",
    "display_settings",
    "optimization_campaign",
    flowEditorSettingsName

]
const storageName = "uiConfig"

export default function UIConfig({configKeys}) {
    const uiConfig = useUiConfigContext();
    const botInfo = useBotInfoContext();
    const saveUiConfig = useSaveUiConfig()
    const handleEditorsAutosave = useCallback(() => {
        const newConfigs = {
            ...uiConfig
        }
        configKeys.forEach(configKey => {
            const newConfig = window[`$${storageName}`]?.[`${configKey}${configKeys}`].getValue()
            const finalNewConfig = convertTimestamps(newConfig, true)
            newConfigs[configKey] = finalNewConfig
        })
        if (newConfigs) {
            saveUiConfig(newConfigs)
        };
    }, [configKeys, saveUiConfig, uiConfig]);
    return useMemo(() => {

        const dataFiles = botInfo?.data_files
        const currentSymbols = botInfo?.symbols
        const availableExchanges = botInfo?.exchange_names
        return (
            <div> {
                botInfo && configKeys.map(configKey => {
                    const schema = getUiConfigSchema(configKey, dataFiles, currentSymbols, availableExchanges)
                    const config = convertTimestamps(uiConfig[configKey])
                    if (schema.properties?.exchange_names?.items?.enum && config?.exchange_names?.some(_exchange => ! schema.properties.exchange_names.items.enum.includes(_exchange))) {
                        config.exchange_names = schema.properties.exchange_names.items.enum
                    }
                    return (
                        <JsonEditor {...defaultJsonEditorSettings()}
                            schema={schema}
                            startval={config}
                            storageName={storageName}
                            editorName={
                                `${configKey}${configKeys}`
                            }
                            onChange={handleEditorsAutosave}
                            disable_collapse={true}
                            key={configKey}
                            // language="es"
                            // languages={{
                            //     es: {
                            //         button_save: "Save",
                            //         button_copy: "Copy",
                            //         button_cancel: "Cancel",
                            //         button_add: "Add",
                            //     }
                            // }}
                        />
                    )
                })
            } </div>
        )
    }, [botInfo, configKeys, uiConfig, handleEditorsAutosave])

}


function convertTimestamps(config, convertBack = false) {
    const newValues = {}
    config && Object.keys(config).forEach(configOptionKey => {
        if (configOptionKey.includes("timestamp")) {
            newValues[configOptionKey] = convertBack ? config[configOptionKey] * 1000 : config[configOptionKey] / 1000
        } else {
            newValues[configOptionKey] = config[configOptionKey]
        }
    })
    return newValues
}
