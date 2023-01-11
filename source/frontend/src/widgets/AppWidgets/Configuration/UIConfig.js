import { useMemo } from "react";
import JsonEditor from "@techfreaque/json-editor-react";
import { getUiConfigSchema } from "./uiConfigSchema";
import defaultJsonEditorSettings from "../../../components/Forms/JsonEditor/JsonEditorDefaults";
import { useSaveUiConfig, useUiConfigContext } from "../../../context/config/UiConfigProvider";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";
import "./uiConfig.css"

export const availableUIConfigKeys = [
    "backtesting_run_settings", "backtesting_analysis_settings", "live_analysis_settings",
    "optimizer_campaigns_to_load", "optimizer_run_settings", "display_settings", "optimization_campaign"
]

export default function UIConfig({ configKeys }) {
    const uiConfig = useUiConfigContext();
    const botInfo = useBotInfoContext();
    const saveUiConfig = useSaveUiConfig()
    const dataFiles = botInfo?.data_files
    const currentSymbols = botInfo?.symbols

    function handleEditorsAutosave() {
        if (uiConfig) {
            const newConfigs = { ...uiConfig }
            configKeys.forEach(configKey => {
                const newConfig = window.$JsonEditors["uiConf-" + configKey].getValue()
                const finalNewConfig = convertTimestamps(newConfig, true)
                newConfigs[configKey] = finalNewConfig
            })
            newConfigs && saveUiConfig(newConfigs)
        }
    };
    return useMemo(() => (
        <div>
            {configKeys.map(configKey => {
                return <JsonEditor
                    {...defaultJsonEditorSettings()}
                    schema={getUiConfigSchema(configKey, dataFiles, currentSymbols)}
                    startval={convertTimestamps(uiConfig[configKey])}
                    editorName={"uiConf-" + configKey}
                    onChange={handleEditorsAutosave}
                    disable_edit_json={true}
                    key={configKey}
                />
            })} </div>
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [])

}


function convertTimestamps(config, convertBack = false) {
    const newValues = {}
    config && Object.keys(config).forEach(configOptionKey => {
        if (configOptionKey.includes("timestamp")) {
            newValues[configOptionKey] = convertBack
                ? config[configOptionKey] * 1000
                : config[configOptionKey] / 1000
        } else {
            newValues[configOptionKey] = config[configOptionKey]
        }
    })
    return newValues
}