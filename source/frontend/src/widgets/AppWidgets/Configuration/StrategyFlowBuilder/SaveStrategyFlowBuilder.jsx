import {ReloadOutlined} from "@ant-design/icons";
import {useSaveTentaclesConfig} from "../../../../context/config/TentaclesConfigProvider";
import {useIsBotOnlineContext} from "../../../../context/data/IsBotOnlineProvider";
import AntButton from "../../../../components/Buttons/AntButton";
import {flowBuilderStorageKey, getNodeConfigKey} from "./CustomNodes/StrategyBlockNode";
import {useCallback} from "react";
import { useIsDemoMode } from "../../../../context/data/BotInfoProvider";

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
    const isDemo = useIsDemoMode()
    return (
        <div style={
            {
                position: "absolute",
                marginTop: "10px",
                right: "10px",
            }
        }>

                <div>
                    <AntButton onClick={
                            () => handleUserInputSave({
                                tradingModeKey,
                                config,
                                nodes,
                                edges,
                                setIsSaving,
                                reloadPlots: true,
                                successNotification: true
                            })
                        }
                    style={{zIndex: 2}}
                        disabled={
                            isSaving || ! isOnline || isDemo
                        }
                        icon={(<span style={{marginRight: "5px"}}>
                        <ReloadOutlined spin={isSaving || ! isOnline} />
                        </span>
                        )}>Reload Plots</AntButton>
                </div>
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
        setIsSaving?.(true)
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
