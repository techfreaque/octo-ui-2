import { HandleType, NodeProps, Position } from "reactflow";
import { NodeContainer, NodeEditor, NodeHandle } from "./NodeContainer";
import {
  NodeConfigKeyType,
  TentaclesConfigValuesType,
  TentaclesConfigsSchemaPropertiesType,
  TentaclesConfigsSchemaType,
  tentacleConfigTypes,
  useTentaclesConfigContext,
} from "../../../../../context/config/TentaclesConfigProvider";
import { strategyFlowMakerName } from "../../TentaclesConfig";
import { useMemo } from "react";

export const flowBuilderStorageKey = "flow-builder-storage";

const nodeSideKeysToClass = {
  top: Position.Top,
  bottom: Position.Bottom,
  left: Position.Left,
  right: Position.Right,
};
const nodeDirectionKeysToHandleType: {
  in: HandleType;
  out: HandleType;
} = {
  in: "target",
  out: "source",
};

const handleOuterStyles = {
  top: {
    0: {
      left: "50%",
      right: "50%",
    },
    1: {
      left: "20%",
      right: "auto",
    },
    2: {
      right: "20%",
      left: "auto",
      marginRight: "-100px",
    },
    3: {
      top: "25px",
      bottom: "auto",
    },
    4: {
      top: "25px",
      bottom: "auto",
    },
    5: {
      top: "130px",
      bottom: "auto",
    },
    6: {
      top: "130px",
      bottom: "auto",
    },
  },
  bottom: {
    0: {
      left: "50%",
      right: "50%",
    },
    1: {
      left: "20%",
      right: "auto",
    },
    2: {
      right: "20%",
      left: "auto",
      marginRight: "-100px",
    },
    3: {
      bottom: "25px",
      top: "auto",
    },
    4: {
      bottom: "25px",
      top: "auto",
    },
    5: {
      bottom: "130px",
      top: "auto",
    },
    6: {
      bottom: "130px",
      top: "auto",
    },
  },
  left: {
    0: {
      top: "50%",
      bottom: "50%",
    },
    1: {
      top: "20%",
      bottom: "auto",
    },
    2: {
      bottom: "20%",
      top: "auto",
    },
    3: {
      bottom: "20%",
      top: "auto",
    },
    4: {
      bottom: "20%",
      top: "auto",
    },
    5: {
      bottom: "20%",
      top: "auto",
    },
    6: {
      bottom: "20%",
      top: "auto",
    },
  },
  right: {
    0: {
      top: "50%",
      bottom: "50%",
    },
    1: {
      top: "20%",
      bottom: "auto",
    },
    2: {
      bottom: "20%",
      top: "auto",
    },
    3: {
      bottom: "20%",
      top: "auto",
    },
    4: {
      bottom: "20%",
      top: "auto",
    },
    5: {
      bottom: "20%",
      top: "auto",
    },
    6: {
      bottom: "20%",
      top: "auto",
    },
  },
};

const handleLabelLeftStyle = {
  transform: "rotate(-90deg)",
  width: "100px",
  marginTop: "-20px",
  height: "40px",
  left: "-50px",
};

const handleLabelRightStyle = {
  transform: "rotate(-90deg)",
  width: "100px",
  marginTop: "-20px",
  height: "40px",
  right: "-50px",
};
const handleLabelTopStyle = {
  width: "100px",
  marginLeft: "-50px",
  height: "40px",
  top: "-30px",
};

const handleLabelBottomStyle = {
  width: "100px",
  marginLeft: "-50px",
  height: "40px",
  bottom: "-20px",
};

const handleStyles = {
  top: {
    0: {},
    1: {},
    2: {},
    3: handleLabelLeftStyle,
    4: {
      ...handleLabelRightStyle,
      left: "90%",
    },
    5: handleLabelLeftStyle,
    6: {
      ...handleLabelRightStyle,
      left: "90%",
    },
  },
  bottom: {
    0: {},
    1: {},
    2: {},
    3: handleLabelLeftStyle,
    4: {
      ...handleLabelRightStyle,
      left: "90%",
    },
    5: handleLabelLeftStyle,
    6: {
      ...handleLabelRightStyle,
      left: "90%",
    },
  },
  left: {
    0: {},
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
  },
  right: {
    0: {},
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
  },
};

type StyleIndexType = 1 | 2 | 3 | 4 | 5 | 6;

const handleLabelStyles = {
  top: {
    0: {
      left: "50%",
      right: "50%",
      ...handleLabelTopStyle,
    },
    1: {
      left: "20%",
      right: "auto",
      ...handleLabelTopStyle,
    },
    2: {
      right: "20%",
      left: "auto",
      ...handleLabelTopStyle,
      marginRight: "-50px",
    },
    3: {
      top: "25px",
      bottom: "auto",
      ...handleLabelLeftStyle,
    },
    4: {
      top: "25px ",
      bottom: "auto",
      ...handleLabelRightStyle,
    },
    5: {
      top: "130px",
      bottom: "auto",
      ...handleLabelLeftStyle,
    },
    6: {
      top: "130px ",
      bottom: "auto",
      ...handleLabelRightStyle,
    },
  },
  bottom: {
    0: {
      left: "50%",
      right: "50%",
      ...handleLabelBottomStyle,
    },
    1: {
      left: "20%",
      right: "auto",
      ...handleLabelBottomStyle,
    },
    2: {
      right: "20%",
      left: "auto",
      ...handleLabelBottomStyle,
      marginRight: "-50px",
    },
    3: {
      bottom: "25px",
      top: "auto",
      ...handleLabelLeftStyle,
    },
    4: {
      bottom: "25px ",
      top: "auto",
      ...handleLabelRightStyle,
    },
    5: {
      bottom: "130px",
      top: "auto",
      ...handleLabelLeftStyle,
    },
    6: {
      bottom: "130px ",
      top: "auto",
      ...handleLabelRightStyle,
    },
  },
  left: {
    0: {
      top: "50%",
      bottom: "50%",
      ...handleLabelLeftStyle,
    },
    1: {
      top: "20%",
      bottom: "auto",
      ...handleLabelLeftStyle,
    },
    2: {
      bottom: "20%",
      top: "auto",
      ...handleLabelLeftStyle,
    },
    3: {
      bottom: "20%",
      top: "auto",
      ...handleLabelLeftStyle,
    },
    4: {
      bottom: "20%",
      top: "auto",
      ...handleLabelLeftStyle,
    },
    5: {
      bottom: "20%",
      top: "auto",
      ...handleLabelLeftStyle,
    },
    6: {
      bottom: "20%",
      top: "auto",
      ...handleLabelLeftStyle,
    },
  },
  right: {
    0: {
      top: "50%",
      bottom: "50%",
      ...handleLabelRightStyle,
    },
    1: {
      top: "20%",
      bottom: "auto",
      ...handleLabelRightStyle,
    },
    2: {
      bottom: "20%",
      top: "auto",
      ...handleLabelRightStyle,
    },
    3: {
      bottom: "20%",
      top: "auto",
      ...handleLabelRightStyle,
    },
    4: {
      bottom: "20%",
      top: "auto",
      ...handleLabelRightStyle,
    },
    5: {
      bottom: "20%",
      top: "auto",
      ...handleLabelRightStyle,
    },
    6: {
      bottom: "20%",
      top: "auto",
      ...handleLabelRightStyle,
    },
  },
};

export default function StrategyBlockNode({
  id,
  selected,
}: NodeProps): JSX.Element {
  const { ioSchema, schema, config } = useCurrentNodeSchema({
    nodeId: id,
  });
  const jsonConfig = JSON.stringify(config);
  const jsonIoSchema = JSON.stringify(ioSchema);
  const jsonSchema = JSON.stringify(schema);
  return useMemo(() => {
    const ioNodes: {
      top?: JSX.Element[];
      left?: JSX.Element[];
      right?: JSX.Element[];
      bottom?: JSX.Element[];
    } = {};
    if (ioSchema) {
      Object.values(ioSchema).forEach((node) => {
        const nodeOptions = node.options;
        const nodeSide = nodeOptions?.side;
        const nodeDirection = nodeOptions?.direction;
        if (!nodeOptions || !nodeSide || !nodeDirection) {
          return;
        }
        const ioNodeData = ioNodes[nodeSide] || [];
        const id = `${node?.options?.io_node_type}${node?.options?.io_node_id}`;
        ioNodeData.push(
          <NodeHandle
            direction={nodeDirectionKeysToHandleType[nodeDirection]}
            handleDescriptionStyle={
              handleLabelStyles[nodeSide]?.[ioNodeData.length as StyleIndexType]
            }
            color={nodeOptions.color || "white"}
            style={
              handleOuterStyles[nodeSide]?.[ioNodeData.length as StyleIndexType]
            }
            handleStyle={
              handleStyles[nodeSide]?.[ioNodeData.length as StyleIndexType]
            }
            position={nodeSideKeysToClass[nodeSide]}
            title={`${nodeOptions.title}`}
            key={id}
            id={id}
            isConnectable={nodeOptions.is_connectable}
          />
        );
        ioNodes[nodeSide] = ioNodeData;
      });
    }
    return (
      <NodeContainer
        nodeId={id}
        color={schema?.options?.color}
        selected={selected}
      >
        <>
          {ioNodes?.top}
          {ioNodes?.left}
          <NodeEditor nodeId={id} schema={schema} config={config} />
          {ioNodes?.right}
          {ioNodes?.bottom}
        </>
      </NodeContainer>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonConfig, jsonIoSchema, jsonSchema, id, selected]);
}

export function useCurrentNodeSchema({
  nodeId,
}: {
  nodeId: string;
}): {
  ioSchema: TentaclesConfigsSchemaPropertiesType | undefined;
  schema: TentaclesConfigsSchemaType | undefined;
  config: TentaclesConfigValuesType | undefined;
} {
  const currentTentaclesConfig = useTentaclesConfigContext();
  const currentTentaclesTradingConfig =
    currentTentaclesConfig?.[tentacleConfigTypes.tradingTentacles];
  const nodesSchema =
    currentTentaclesTradingConfig?.[strategyFlowMakerName]?.schema;
  const nodesConfig =
    currentTentaclesTradingConfig?.[strategyFlowMakerName]?.config;
  return {
    ioSchema:
      nodesSchema?.properties?.nodes?.properties?.[nodeId]?.properties?.[
        getNodeIoSchemaKey(nodeId)
      ]?.properties,
    schema:
      nodesSchema?.properties?.nodes?.properties?.[nodeId]?.properties?.[
        getNodeConfigKey(nodeId)
      ],
    config: nodesConfig?.nodes?.[nodeId]?.[getNodeConfigKey(nodeId)],
  };
}

export function getNodeConfigKey(nodeId: string): NodeConfigKeyType {
  return `config_${nodeId}`;
}

export function getNodeIoSchemaKey(nodeId: string) {
  return `nodes_io_${nodeId}`;
}
