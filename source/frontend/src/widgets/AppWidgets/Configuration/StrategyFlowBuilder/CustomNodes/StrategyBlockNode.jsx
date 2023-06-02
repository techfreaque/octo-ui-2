import {Position} from 'reactflow';
import {NodeContainer, NodeEditor, NodeHandle} from './NodeContainer';
import {tentacleConfigType, useTentaclesConfigContext} from '../../../../../context/config/TentaclesConfigProvider';
import {strategyFlowMakerName} from '../../TentaclesConfig';
import {useMemo} from 'react';

export const flowBuilderStorageKey = "flow-builder-storage"

const nodeSideKeysToClass = {
    top: Position.Top,
    bottom: Position.Bottom,
    left: Position.Left,
    right: Position.Right

}
const nodeDirectionKeysToHandleType = {
    in: "target",
    out: "source"
}

const handleStyles = {
    top: {
        0: {},
        1: {
            left: "25%",
            right: "auto"
        },
        2: {
            right: "25%",
            left: "auto"
        }
    },
    bottom: {
        0: {},
        1: {
            left: "25%",
            right: "auto"
        },
        2: {
            right: "25%",
            left: "auto"
        }
    },
    left: {
        0: {},
        1: {
            top: "25%",
            bottom: "auto"
        },
        2: {
            bottom: "25%",
            top: "auto"
        }
    },
    right: {
        0: {},
        1: {
            top: "25%",
            bottom: "auto"
        },
        2: {
            bottom: "25%",
            top: "auto"
        }
    }
}

export default function StrategyBlockNode(props) {
    const {ioSchema, schema, config} = useCurrentNodeSchema({nodeId: props.id})
    return useMemo(() => {
        const ioNodes = {}
        ioSchema && Object.keys(ioSchema).forEach(nodeKey => {
            const node = ioSchema[nodeKey]
            if (! ioNodes[node?.options?.side]) {
                ioNodes[node?.options?.side] = []
            }
            ioNodes[node?.options?.side].push (
                <NodeHandle direction={
                        nodeDirectionKeysToHandleType?.[node?.options?.direction]
                    }
                    color={
                        node?.options?.color
                    }
                    style={
                        handleStyles?.[node?.options?.side]?.[ioNodes[node?.options?.side]?.length]
                    }
                    position={
                        nodeSideKeysToClass[node?.options?.side]
                    }
                    title={
                        node?.options?.title
                    }
                    type={
                        node?.options?.io_node_type
                    }
                    id={
                        `${
                            node?.options?.io_node_type
                        }${
                            node?.options?.io_node_id
                        }`
                    }
                    isConnectable={
                        props.isConnectable
                    }/>
            )
        })
        return (
            <NodeContainer color={
                    schema?.options?.color
                }
                selected={
                    props.selected
            }>
                {
                ioNodes?.top
            }
                {
                ioNodes?.left
            }
                <NodeEditor nodeId={
                        props.id
                    }
                    schema={schema}
                    config={config}/> {
                ioNodes?.right
            }
                {
                ioNodes?.bottom
            } </NodeContainer>
        )
    }, [
        config,
        ioSchema,
        props.id,
        props.isConnectable,
        props.selected,
        schema
    ])
}

export function useCurrentNodeSchema({nodeId}) {
    const currentTentaclesConfig = useTentaclesConfigContext()
    const currentTentaclesTradingConfig = currentTentaclesConfig?.[tentacleConfigType.tradingTentacles]
    const nodesSchema = currentTentaclesTradingConfig?.[strategyFlowMakerName]?.schema
    const nodesConfig = currentTentaclesTradingConfig?.[strategyFlowMakerName]?.config
    return {
        ioSchema: nodesSchema?.properties?.nodes?.properties?.[nodeId]?.properties?.[getNodeIoSchemaKey(nodeId)]?.properties,
        schema: nodesSchema?.properties?.nodes?.properties?.[nodeId]?.properties?.[getNodeConfigKey(nodeId)],
        config: nodesConfig?.nodes?.[nodeId]?.[getNodeConfigKey(nodeId)]
    }
}

export function getNodeConfigKey(nodeId) {
    return `config_${nodeId}`
}

export function getNodeIoSchemaKey(nodeId) {
    return `nodes_io_${nodeId}`
}
