import defaultJsonEditorSettings from "../../../../../components/Forms/JsonEditor/JsonEditorDefaults";
import {flowBuilderStorageKey} from "./StrategyBlockNode";
import {
    Handle,
    Position,
    getConnectedEdges,
    useNodeId,
    useReactFlow,
    useStore,
    useStoreApi
} from "reactflow";
import {useBotColorsContext} from "../../../../../context/config/BotColorsProvider";
import {useCallback, useMemo} from "react";
import {useSaveFlowBuilderSettings} from "../SaveStrategyFlowBuilder";
import {strategyFlowMakerName} from "../../TentaclesConfig";
import {tentacleConfigType, useTentaclesConfigContext, useUpdateIsSavingTentaclesConfigContext} from "../../../../../context/config/TentaclesConfigProvider";
import JsonEditor from "../../../../../components/Forms/JsonEditor/jedit";
import {useUiConfigContext} from "../../../../../context/config/UiConfigProvider";
import {flowEditorSettingsName} from "../../UIConfig";
import AntButton, {buttonSizes, buttonTypes, buttonVariants} from "../../../../../components/Buttons/AntButton";
import {CloseCircleOutlined} from "@ant-design/icons";

export function NodeContainer({children, color, selected, nodeId}) {
    const botColors = useBotColorsContext();
    const reactFlow = useReactFlow()
    const onNodeDelete = useCallback((evt) => {
        evt.stopPropagation()
        reactFlow.setNodes((nodes) => {
            return nodes.filter((node) => {
                return node.id !== nodeId
            })
        })
    }, [nodeId, reactFlow])
    return (
        <div style={
            {
                border: `2px solid ${
                    color
                }`,
                borderRadius: "8px",
                padding: "10px",
                maxWidth: "500px",
                backgroundColor: botColors.background,
                ...(selected ? {
                    boxShadow: "0 0 0 1rem rgba(13,110,253,.25)"
                } : {})
            }
        }>
            {
            selected &&< AntButton onClick = {
                onNodeDelete
            }
            size = {
                buttonSizes.large
            }
            style = {{right: "15px", top: "15px", position: "absolute", zIndex: "3"}}
            buttonVariant = {
                buttonVariants.primary
            }
            buttonType = {
                buttonTypes.warning
            }
            antIconComponent = {
                CloseCircleOutlined
            } />
        }

            {children} </div>
    )
}

export function NodeEditor({schema, config, nodeId}) {
    const handleUserInputSave = useSaveFlowBuilderSettings()
    const store = useStoreApi();
    const currentTentaclesConfig = useTentaclesConfigContext()
    const currentTentaclesTradingConfig = currentTentaclesConfig?.[tentacleConfigType.tradingTentacles]
    const uiConfig = useUiConfigContext();
    const setIsSaving = useUpdateIsSavingTentaclesConfigContext()
    const autoSave = uiConfig?.[flowEditorSettingsName]?.auto_save
    const handleAutoSave = useCallback(() => {
        if (autoSave) {
            const {nodeInternals, edges} = store.getState();
            const nodes = Array.from(nodeInternals).map(([, node]) => node);
            handleUserInputSave({
                tradingModeKey: strategyFlowMakerName,
                config: currentTentaclesTradingConfig,
                nodes,
                edges,
                setIsSaving
            })
        }
    }, [
        autoSave,
        currentTentaclesTradingConfig,
        handleUserInputSave,
        setIsSaving,
        store
    ])

    return useMemo(() => {
        return schema && (
            <div>
                <JsonEditor schema={schema}
                    startval={config}
                    editorName={nodeId}
                    onChange={handleAutoSave}
                    {...defaultJsonEditorSettings()}
                    display_required_only={true}
                    storageName={flowBuilderStorageKey}/>
            </div>
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodeId, JSON.stringify(schema), JSON.stringify(config)])
}

const selector = (s) => ({nodeInternals: s.nodeInternals, edges: s.edges});


export function NodeHandle({
    style = {},
    handleStyle = {},
    id,
    title,
    type,
    color,
    position,
    isConnectable,
    direction,
    handleDescriptionStyle
}) {
    const {nodeInternals, edges} = useStore(selector);
    const nodeId = useNodeId();
    const isHandleConnectable = useMemo(() => {
        if (typeof isConnectable === 'number') {
            const node = nodeInternals.get(nodeId);
            const connectedEdges = getConnectedEdges([node], edges);
            const connectedToThisHandle = connectedEdges.filter(edge => ((edge.targetHandle === id && edge.target === nodeId) || (edge.sourceHandle === id && edge.source === nodeId)))
            return connectedToThisHandle.length < isConnectable;
        }
        return isConnectable;
    }, [
        isConnectable,
        nodeInternals,
        nodeId,
        edges,
        id
    ]);
    const _handleStyle = (position === Position.Left ? {
        left: "-20px",
        height: "100px"
    } : (position === Position.Right ? {
        right: "-20px",
        height: "100px"
    } : (position === Position.Top ? {
        top: "-30px",
        width: "100px"
    } : (position === Position.Bottom ? {
        bottom: "-20px",
        width: "100px"
    } : {}))))
    return (
        <>
            <div style={
                {
                    // ... labelStyle,
                    ...handleDescriptionStyle,
                    position: "absolute",
                    zIndex: 1,
                    overflowWrap: "break-word",
                    lineHeight: "13px",
                    display: "flex",
                    textAlign: "center",
                    color: "#000",
                    borderRadius: "5px",
                    background: color,
                    borderColor: color

                }
            }>
                <span style={
                    {margin: "auto"}
                }>
                    {title} </span>
            </div>
            <Handle type={direction}
                style={
                    {
                        width: "40px",
                        height: "40px",
                        borderRadius: "5px",
                        background: "none",
                        zIndex: 2,
                        ..._handleStyle,
                        ...handleStyle,
                        ...style,
                        border: "none"
                    }
                }
                position={position}
                id={id}
                isConnectable={isHandleConnectable}/>
        </>
    )
}
