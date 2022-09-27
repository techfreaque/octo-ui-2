import { useMemo } from "react";
import JsonEditor from "@techfreaque/json-editor-react";
import { uiConfigSchema } from "./uiConfigSchema";
import { useCallback } from "react";
import defaultJsonEditorSettings from "../../../components/Forms/JsonEditor/JsonEditorDefaults";
import { useSaveUiConfig, useUiConfigContext } from "../../../context/config/UiConfigProvider";

export default function UIConfig({ configKeys }) {
    const uiConfig = useUiConfigContext();
    const saveEditors = useSaveEditors()
    return useMemo(() => (
        <div>
            {configKeys.map(configKey => {
                const startVal = convertTimestamps(uiConfig[configKey])
                return <JsonEditor
                    {...defaultJsonEditorSettings()}
                    schema={uiConfigSchema.properties[configKey]}
                    startval={startVal}
                    editorName={"uiConf-" + configKey}
                    onChange={() => saveEditors(configKeys)}
                    disable_edit_json={true}
                    key={configKey}
                />
            })} </div>
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [])

}

const useSaveEditors = () => {
    const saveUiConfig = useSaveUiConfig()
    const uiConfig = useUiConfigContext()
    const logic = useCallback((configKeys) => {
        if (uiConfig && uiConfig.optimization_campaign) {
            const newConfigs = { ...uiConfig }
            configKeys.forEach(configKey => {
                const newConfig = window.$JsonEditors["uiConf-" + configKey].getValue()
                const finalNewConfig = convertTimestamps(newConfig, true)
                newConfigs[configKey] = finalNewConfig
            })
            saveUiConfig(newConfigs)
        }
    }, [uiConfig, saveUiConfig]);
    return logic;
};

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