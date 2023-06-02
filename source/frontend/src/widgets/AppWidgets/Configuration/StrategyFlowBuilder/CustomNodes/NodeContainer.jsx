import JsonEditor from "@techfreaque/json-editor-react";
import defaultJsonEditorSettings from "../../../../../components/Forms/JsonEditor/JsonEditorDefaults";
import {flowBuilderStorageKey} from "./StrategyBlockNode";
import {Handle, Position} from "reactflow";
import {useBotColorsContext} from "../../../../../context/config/BotColorsProvider";
import {useMemo} from "react";

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
    return useMemo(() => {
        const editors = window ?. [`$${flowBuilderStorageKey}`]
        editors ?. [nodeId] ?. destroy()
        delete editors ?. [nodeId]
        return schema && (
            <div>
                <JsonEditor schema={schema}
                    startval={config}
                    editorName={nodeId}
                    {...defaultJsonEditorSettings()}
                    display_required_only={true}
                    storageName={flowBuilderStorageKey}/>
            </div>
        )
    }, [schema, config, nodeId])
}

export function NodeHandle({
    style = {},
    id,
    title,
    type,
    color,
    position,
    isConnectable,
    direction
}) {
    const handleStyle = (position === Position.Left ? {
        left: "-10px"
    } : (position === Position.Right ? {
        right: "-10px"
    } : (position === Position.Top ? {
        top: "-10px"
    } : (position === Position.Bottom ? {
        bottom: "-10px"
    } : {}))))
    return (
        <Handle type={direction}
            style={
                {
                    width: "20px",
                    height: "20px",
                    ... handleStyle,
                    background: color,
                    ...style
                }
            }
            position={position}
            id={id}
            isConnectable={isConnectable}/>
    )
}
