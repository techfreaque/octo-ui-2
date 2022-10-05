import { useMemo } from "react";
import JsonEditor from "@techfreaque/json-editor-react";
import { uiConfigSchema } from "./uiConfigSchema";
import defaultJsonEditorSettings from "../../../components/Forms/JsonEditor/JsonEditorDefaults";
import { useSaveUiConfig, useUiConfigContext } from "../../../context/config/UiConfigProvider";

export const availableUIConfigKeys = ["backtesting_run_settings", "backtesting_analysis_settings", "optimizer_campaigns_to_load", "optimizer_run_settings"]

export default function UIConfig({ configKeys }) {
    const uiConfig = useUiConfigContext();
    const saveUiConfig = useSaveUiConfig()

    function handleEditorsAutosave(configKeys) {
        if (uiConfig && uiConfig.optimization_campaign) {
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
                const startVal = convertTimestamps(uiConfig[configKey])
                return <JsonEditor
                    {...defaultJsonEditorSettings()}
                    schema={uiConfigSchema.properties[configKey]}
                    startval={startVal}
                    editorName={"uiConf-" + configKey}
                    onChange={() => handleEditorsAutosave(configKeys)}
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