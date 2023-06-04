import JsonEditor from "@techfreaque/json-editor-react";
import defaultJsonEditorSettings from "../../../../../components/Forms/JsonEditor/JsonEditorDefaults";
import {flowBuilderStorageKey} from "./StrategyBlockNode";
import {
    Handle,
    Position,
    getConnectedEdges,
    useNodeId,
    useStore,
    useStoreApi
} from "reactflow";
import {useBotColorsContext} from "../../../../../context/config/BotColorsProvider";
import {useMemo} from "react";
import {useSaveFlowBuilderSettings} from "../SaveStrategyFlowBuilder";
import {strategyFlowMakerName} from "../../TentaclesConfig";
import {tentacleConfigType, useTentaclesConfigContext} from "../../../../../context/config/TentaclesConfigProvider";

export function NodeContainer({children, color, selected}) {
    const botColors = useBotColorsContext();
    return (
        <div style={
            {
                border: `2px solid ${
                    color
                }`,
                padding: "10px",
                maxWidth: "400px",
                backgroundColor: botColors.background,
                ...(selected ? {
                    boxShadow: "0 0 0 1rem rgba(13,110,253,.25)"
                } : {})
            }
        }>
            {children} </div>
    )
}

export function NodeEditor({schema, config, nodeId}) {
    const handleUserInputSave = useSaveFlowBuilderSettings()
    const store = useStoreApi();
    const currentTentaclesConfig = useTentaclesConfigContext()
    const currentTentaclesTradingConfig = currentTentaclesConfig ?. [tentacleConfigType.tradingTentacles]
    const handleAutoSave = useMemo(() => {
        return() => {
            const {nodeInternals, edges} = store.getState();
            const nodes = Array.from(nodeInternals).map(([, node]) => node);
            handleUserInputSave({
                tradingModeKey: strategyFlowMakerName,
                config: currentTentaclesTradingConfig,
                nodes,
                edges,
                // setIsSaving
            })
        }
    }, [config, handleUserInputSave, store])

    return useMemo(() => {
        const editors = window ?. [`$${flowBuilderStorageKey}`]
        editors ?. [nodeId] ?. destroy()
        delete editors ?. [nodeId]
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
    }, [nodeId, schema, config, handleAutoSave])
}

const selector = (s) => ({nodeInternals: s.nodeInternals, edges: s.edges});


export function NodeHandle({
    style = {},
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
            const connectedToThisHandle = connectedEdges.filter(edge => (edge.targetHandle === id || edge.sourceHandle === id))
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
    const handleStyle = (position === Position.Left ? {
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
                        ... handleStyle,
                        ...style,
                        border: "none"
                    }
                }
                position={position}
                id={id}
                isConnectable={isHandleConnectable}></Handle>
        </>
    )
}
