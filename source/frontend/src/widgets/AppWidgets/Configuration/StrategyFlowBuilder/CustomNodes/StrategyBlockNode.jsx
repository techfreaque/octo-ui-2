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
        0: {
            left: "50%",
            right: "50%"
        },
        1: {
            left: "20%",
            right: "auto"
        },
        2: {
            right: "20%",
            left: "auto",
            marginRight: "-100px"

        }
    },
    bottom: {
        0: {
            left: "50%",
            right: "50%"
        },
        1: {
            left: "20%",
            right: "auto"
        },
        2: {
            right: "20%",
            left: "auto",
            marginRight: "-100px"

        },
        3: {
            bottom: "25px",
            top: "auto"
        },
        4: {
            bottom: "25px",
            top: "auto"
        },
        5: {
            bottom: "130px",
            top: "auto"
        },
        6: {
            bottom: "130px",
            top: "auto"
        }
    },
    left: {
        0: {
            top: "50%",
            bottom: "50%"
        },
        1: {
            top: "20%",
            bottom: "auto"
        },
        2: {
            bottom: "20%",
            top: "auto"
        }
    },
    right: {
        0: {
            top: "50%",
            bottom: "50%"
        },
        1: {
            top: "20%",
            bottom: "auto"
        },
        2: {
            bottom: "20%",
            top: "auto"
        }
    }
}


const handleLabelLeftStyle = {
    transform: "rotate(-90deg)",
    width: "100px",
    marginTop: "-20px",
    height: "40px",
    left: "-50px"
}

const handleLabelRightStyle = {
    transform: "rotate(-90deg)",
    width: "100px",
    marginTop: "-20px",
    height: "40px",
    right: "-50px"
}
const handleLabelTopStyle = {
    width: "100px",
    marginLeft: "-50px",
    height: "40px",
    top: "-30px"
}

const handleLabelBottomStyle = {
    width: "100px",
    marginLeft: "-50px",
    height: "40px",
    bottom: "-20px"
}

const handleLabelStyles = {
    top: {
        0: {
            left: "50%",
            right: "50%",
            ... handleLabelTopStyle
        },
        1: {
            left: "20%",
            right: "auto",
            ... handleLabelTopStyle
        },
        2: {
            right: "20%",
            left: "auto",
            ... handleLabelTopStyle,
            marginRight: "-50px"
        }
    },
    bottom: {
        0: {
            left: "50%",
            right: "50%",
            ... handleLabelBottomStyle
        },
        1: {
            left: "20%",
            right: "auto",
            ... handleLabelBottomStyle
        },
        2: {
            right: "20%",
            left: "auto",
            ... handleLabelBottomStyle,
            marginRight: "-50px"
        },
        3: {
            bottom: "25px",
            top: "auto",
            ... handleLabelLeftStyle
        },
        4: {
            bottom: "25px ",
            top: "auto",
            ... handleLabelRightStyle
        },
        5: {
            bottom: "130px",
            top: "auto",
            ... handleLabelLeftStyle
        },
        6: {
            bottom: "130px ",
            top: "auto",
            ... handleLabelRightStyle
        }
    },
    left: {
        0: {
            top: "50%",
            bottom: "50%",
            ... handleLabelLeftStyle
        },
        1: {
            top: "20%",
            bottom: "auto",
            ... handleLabelLeftStyle
        },
        2: {
            bottom: "20%",
            top: "auto",
            ... handleLabelLeftStyle
        }
    },
    right: {
        0: {
            top: "50%",
            bottom: "50%",
            ... handleLabelRightStyle

        },
        1: {
            top: "20%",
            bottom: "auto",
            ... handleLabelRightStyle
        },
        2: {
            bottom: "20%",
            top: "auto",
            ... handleLabelRightStyle
        }
    }
}

export default function StrategyBlockNode(props) {
    const {ioSchema, schema, config} = useCurrentNodeSchema({nodeId: props.id})
    return useMemo(() => {
        const ioNodes = {}
        ioSchema && Object.keys(ioSchema).forEach(nodeKey => {
            const node = ioSchema[nodeKey]
            if (! node ?. options) {
                return;
            }
            if (! ioNodes[node ?. options ?. side]) {
                ioNodes[node ?. options ?. side] = []
            }
            const id = `${
                node ?. options ?. io_node_type
            }${
                node ?. options ?. io_node_id
            }`
            ioNodes[node.options.side].push (
                <NodeHandle direction={
                        nodeDirectionKeysToHandleType[node.options.direction]
                    }
                    handleDescriptionStyle={
                        handleLabelStyles[node.options.side] ?. [ioNodes[node.options.side] ?. length]
                    }
                    color={
                        node.options.color
                    }
                    style={
                        handleStyles[node.options.side] ?. [ioNodes[node.options.side] ?. length]
                    }
                    position={
                        nodeSideKeysToClass[node.options.side]
                    }
                    title={
                        node.options.title
                    }
                    type={
                        node.options.io_node_type
                    }
                    key={id}
                    id={id}
                    isConnectable={
                        node.options.is_connectable
                    }/>
            )
        })
        return (
            <NodeContainer color={
                    schema ?. options ?. color
                }
                selected={
                    props.selected
            }>
                {
                ioNodes ?. top
            }
                {
                ioNodes ?. left
            }
                <NodeEditor nodeId={
                        props.id
                    }
                    schema={schema}
                    config={config}/> {
                ioNodes ?. right
            }
                {
                ioNodes ?. bottom
            } </NodeContainer>
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        JSON.stringify(config),
        JSON.stringify(ioSchema),
        props.id,
        props.selected,
        JSON.stringify(schema)
    ])
}

export function useCurrentNodeSchema({nodeId}) {
    const currentTentaclesConfig = useTentaclesConfigContext()
    const currentTentaclesTradingConfig = currentTentaclesConfig ?. [tentacleConfigType.tradingTentacles]
    const nodesSchema = currentTentaclesTradingConfig ?. [strategyFlowMakerName] ?. schema
    const nodesConfig = currentTentaclesTradingConfig ?. [strategyFlowMakerName] ?. config
    return {
        ioSchema: nodesSchema ?. properties ?. nodes ?. properties ?. [nodeId] ?. properties ?. [getNodeIoSchemaKey(nodeId)] ?. properties,
        schema: nodesSchema ?. properties ?. nodes ?. properties ?. [nodeId] ?. properties ?. [getNodeConfigKey(nodeId)],
        config: nodesConfig ?. nodes ?. [nodeId] ?. [getNodeConfigKey(nodeId)]
    }
}

export function getNodeConfigKey(nodeId) {
    return `config_${nodeId}`
}

export function getNodeIoSchemaKey(nodeId) {
    return `nodes_io_${nodeId}`
}
