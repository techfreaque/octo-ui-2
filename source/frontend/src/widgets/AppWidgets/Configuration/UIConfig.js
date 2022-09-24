import { useMemo } from "react";
import JsonEditor from "@techfreaque/json-editor-react";
import { useSaveUiConfig, useUiConfigContext } from "../../../context/UiConfigProvider";
import { uiConfigSchema } from "./uiConfigSchema";
import { useCallback } from "react";

export default function UIConfig({ configKeys }) {
    const uiConfig = useUiConfigContext();
    const saveEditors = useSaveEditors()

    const editors = configKeys.map(configKey => {
        const startVal = convertTimestamps(uiConfig[configKey])
        return <JsonEditor
            schema={uiConfigSchema.properties[configKey]}
            startval={startVal}
            editorName={"uiConf-" + configKey}
            onChange={()=>saveEditors(configKeys)}
            theme={"bootstrap4"}
            iconlib={"spectre"}
            no_additional_properties={false}
            object_layout={"grid"}
            disable_edit_json={true}
            disable_properties={true}
            required_by_default={true}
            key={configKey}
        />
    })

    return useMemo(() => (
        <div>
            {editors}
        </div>
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ), configKeys.map(configKey => uiConfig[configKey]))
}

const useSaveEditors = () => {
    const saveUiConfig = useSaveUiConfig()
    const uiConfig = useUiConfigContext()
    const logic = useCallback((configKeys) => {
        if (uiConfig) {
            const newConfigs = { ...uiConfig }
            configKeys.forEach(configKey => {
                const newConfig = window.$JsonEditors["uiConf-" + configKey].getValue()
                const finalNewConfig = convertTimestamps(newConfig, true)
                newConfigs[configKey] = finalNewConfig
            })
            // todo find an alternative
            JSON.stringify(uiConfig) !== JSON.stringify(newConfigs)
                && saveUiConfig(newConfigs)
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