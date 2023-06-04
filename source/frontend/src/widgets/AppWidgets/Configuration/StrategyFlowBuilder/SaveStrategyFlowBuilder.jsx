import {Tooltip} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import {useSaveTentaclesConfig} from "../../../../context/config/TentaclesConfigProvider";
import {useIsBotOnlineContext} from "../../../../context/data/IsBotOnlineProvider";
import AntButton from "../../../../components/Buttons/AntButton";
import {flowBuilderStorageKey, getNodeConfigKey} from "./CustomNodes/StrategyBlockNode";
import {useCallback} from "react";

export default function SaveStrategyFlowBuilderSettings({
    tradingModeKey,
    config,
    nodes,
    edges,
    isSaving,
    setIsSaving
}) {
    const isOnline = useIsBotOnlineContext()
    const handleUserInputSave = useSaveFlowBuilderSettings()
    return (
        <div style={
            {
                marginTop: "auto",
                marginBottom: "auto",
                marginRight: "5px"
            }
        }>
            <Tooltip placement="topRight"
                title={"Save Strategy Mode Settings"}
                arrow={false}>
                <div>
                    <AntButton onClick={
                            () => handleUserInputSave({
                                tradingModeKey,
                                config,
                                nodes,
                                edges,
                                setIsSaving,
                                reloadPlots: true,
                                successNotification: false
                            })
                        }
                        disabled={
                            isSaving || ! isOnline
                        }
                        antIconComponent={ReloadOutlined}>Reload Plots</AntButton>
                </div>
            </Tooltip>
        </div>
    )
}

export function getNodeEditor(nodeId) {
    return window?.[`$${flowBuilderStorageKey}`]?.[nodeId]
}

export function useSaveFlowBuilderSettings() {
    const saveTentaclesConfig = useSaveTentaclesConfig()
    return useCallback(({
        tradingModeKey,
        config,
        nodes,
        edges,
        setIsSaving,
        reloadPlots,
        successNotification = false
    }) => {
        const newConfigs = {}
        newConfigs[tradingModeKey] = {
            ...config[tradingModeKey].config
        }
        newConfigs[tradingModeKey].nodes = nodes.reduce((dict, node, index) => {
            const editor = getNodeEditor(node.id)
            const settings = editor?.getValue() || {};
            return(dict[node.id] = {
                ...node,
                [getNodeConfigKey(node.id)]: settings
            }, dict)
        }, {});
        newConfigs[tradingModeKey].edges = edges
        saveTentaclesConfig(newConfigs, setIsSaving, reloadPlots, true, false, successNotification)
    }, [saveTentaclesConfig])
}
