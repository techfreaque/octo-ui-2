import "reactflow/dist/style.css";
import "./strategyFlowBuilder.css";

import {
  Dispatch,
  DragEventHandler,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  addEdge,
  Connection,
  Controls,
  Edge,
  EdgeTypes,
  Node,
  NodeTypes,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";

import {
  FlowEdgeConfigType,
  TentaclesConfigValuesType,
  useUpdateIsSavingTentaclesConfigContext,
} from "../../../../context/config/TentaclesConfigProvider";
import { useUiConfigContext } from "../../../../context/config/UiConfigProvider";
import { StrategyFlowMakerNameType } from "../TentaclesConfig";
import { flowEditorSettingsName } from "../UIConfig";
import { CustomEdge } from "./CustomNodes/ConnectionLine";
import StrategyBlockNode from "./CustomNodes/StrategyBlockNode";
import SaveStrategyFlowBuilderSettings, {
  useGetFlowConfig,
  useSaveFlowBuilderSettings,
} from "./SaveStrategyFlowBuilder";

const getId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

export default function StrategyFlowBuilder({
  tradingModeKey,
}: {
  tradingModeKey: StrategyFlowMakerNameType;
}) {
  const flowConfig = useGetFlowConfig();
  return useMemo(
    () =>
      flowConfig ? (
        <ReactFlowProvider>
          <StrategyFlowBuilderDrawingSpace
            flowConfig={flowConfig}
            tradingModeKey={tradingModeKey}
          />
        </ReactFlowProvider>
      ) : (
        <></>
      ),
    [flowConfig, tradingModeKey]
  );
}

export interface NodeData {}
export interface EdgeData {}

function StrategyFlowBuilderDrawingSpace({
  tradingModeKey,
  flowConfig,
}: {
  tradingModeKey: StrategyFlowMakerNameType;
  flowConfig: TentaclesConfigValuesType;
}) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const setIsSaving = useUpdateIsSavingTentaclesConfigContext();

  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(
    (flowConfig?.nodes && Object.values(flowConfig?.nodes)) || []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeData>(
    (flowConfig?.edges as FlowEdgeConfigType[]) || []
  );
  const uiConfig = useUiConfigContext();
  const autoSave = uiConfig?.[flowEditorSettingsName]?.auto_save;
  const jsonNodes = JSON.stringify(flowConfig?.nodes);
  const jsonEdges = JSON.stringify(flowConfig?.edges);
  useEffect(() => {
    if (
      typeof flowConfig?.nodes === "object" &&
      !(flowConfig.nodes as TentaclesConfigValuesType)?.mode_node
    ) {
      (flowConfig.nodes as TentaclesConfigValuesType).mode_node = {
        id: "mode_node",
        type: "StrategyBlockNode",
        data: {},
        config_mode_node: {},
        position: {
          x: 0,
          y: 0,
        },
        positionAbsolute: {
          x: 0,
          y: 0,
        },
      };
    }
    setNodes((flowConfig?.nodes && Object.values(flowConfig?.nodes)) || []);
    setEdges((flowConfig?.edges as FlowEdgeConfigType[]) || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonNodes, jsonEdges]);

  const [reactFlowInstance, setReactFlowInstance] = useState<
    ReactFlowInstance<NodeData, EdgeData>
  >();
  const handleUserInputSave = useSaveFlowBuilderSettings();

  const nodeTypes: NodeTypes = useMemo(() => ({ StrategyBlockNode }), []);
  const edgeTypes: EdgeTypes = useMemo(() => ({ default: CustomEdge }), []);

  const { onConnect, onDragOver, onDrop } = useGetFlowCallbacks({
    flowConfig,
    edges,
    handleUserInputSave,
    reactFlowInstance,
    setIsSaving,
    setNodes,
    tradingModeKey,
    setEdges,
    autoSave,
    nodes,
    reactFlowWrapper,
  });
  return useMemo(
    () =>
      flowConfig ? (
        <div
          className="dndflow"
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <SaveStrategyFlowBuilderSettings
            tradingModeKey={tradingModeKey}
            flowConfig={flowConfig}
            nodes={nodes}
            edges={edges}
          />
          <div
            className="reactflow-wrapper"
            style={{
              height: "100%",
              width: "100%",
            }}
            ref={reactFlowWrapper}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              maxZoom={5000}
              edgeTypes={edgeTypes}
              nodeTypes={nodeTypes}
            >
              <Controls />
            </ReactFlow>
          </div>
        </div>
      ) : (
        <></>
      ),
    [
      edgeTypes,
      edges,
      flowConfig,
      nodeTypes,
      nodes,
      onConnect,
      onDragOver,
      onDrop,
      onEdgesChange,
      onNodesChange,
      tradingModeKey,
    ]
  );
}

// function useGetClosestEdge() {
//     const store = useStoreApi();
//     return useCallback((node) => {
//         const MIN_DISTANCE = 400
//         const {nodeInternals} = store.getState();
//         const storeNodes = Array.from(nodeInternals.values());
//         const closestNode = storeNodes.reduce((res, n) => {
//             if (n.id !== node.id) {
//                 const dx = n.positionAbsolute.x - node.positionAbsolute.x;
//                 const dy = n.positionAbsolute.y - node.positionAbsolute.y;
//                 const d = Math.sqrt(dx * dx + dy * dy);
//                 if (d < res.distance && d < MIN_DISTANCE) {
//                     res.distance = d;
//                     res.node = n;
//                 }
//             }
//             return res;
//         }, {
//             distance: Number.MAX_VALUE,
//             node: null
//         });
//         if (! closestNode.node) {
//             return null;
//         }
//         const closeNodeIsSource = closestNode.node.positionAbsolute.x < node.positionAbsolute.x;
//         return {
//                 id: `${
//                 node.id
//             }-${
//                 closestNode.node.id
//             }`,
//             source: closeNodeIsSource ? closestNode.node.id : node.id,
//             target: closeNodeIsSource ? node.id : closestNode.node.id
//         };
//     }, [store]);
// }

function useGetFlowCallbacks({
  flowConfig,
  edges,
  handleUserInputSave,
  reactFlowInstance,
  setIsSaving,
  setNodes,
  tradingModeKey,
  setEdges,
  autoSave,
  nodes,
  reactFlowWrapper,
}: {
  flowConfig: TentaclesConfigValuesType;
  edges: Edge<EdgeData>[];
  handleUserInputSave: ({
    tradingModeKey,
    flowConfig,
    nodes,
    edges,
    setIsSaving,
    reloadPlots,
    successNotification,
  }: {
    tradingModeKey: StrategyFlowMakerNameType;
    flowConfig: TentaclesConfigValuesType;
    nodes: Node<NodeData>[];
    edges: Edge<EdgeData>[];
    setIsSaving: Dispatch<SetStateAction<boolean>>;
    reloadPlots?: boolean | undefined;
    successNotification?: boolean | undefined;
  }) => void;
  reactFlowInstance: ReactFlowInstance<NodeData, EdgeData> | undefined;
  setIsSaving: Dispatch<SetStateAction<boolean>>;
  setEdges: (value: SetStateAction<Edge<EdgeData>[]>) => void;
  tradingModeKey: StrategyFlowMakerNameType;
  setNodes: (value: SetStateAction<Node<NodeData>[]>) => void;
  autoSave: boolean | undefined;
  nodes: Node<NodeData>[];
  reactFlowWrapper: RefObject<HTMLDivElement>;
}) {
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => {
        const uptoDateEdges: Edge<EdgeData>[] = addEdge(connection, eds);
        if (autoSave) {
          handleUserInputSave({
            tradingModeKey,
            flowConfig,
            nodes,
            edges: uptoDateEdges,
            reloadPlots: false,
            setIsSaving,
          });
        }
        return uptoDateEdges;
      });
    },
    [
      autoSave,
      flowConfig,
      handleUserInputSave,
      nodes,
      setEdges,
      setIsSaving,
      tradingModeKey,
    ]
  );

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect();
      if (!reactFlowInstance || !reactFlowBounds) {
        return;
      }
      const { nodesData, nodeType } = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const type = "StrategyBlockNode";
      const newNode: Node<NodeData> = {
        id: getId(),
        type,
        position,
        data: {
          ...nodesData,
          nodeType,
        } || {
          type,
        },
      };
      setNodes((_nodes) => {
        const uptoDateNodes: Node<NodeData>[] = _nodes.concat(newNode);
        handleUserInputSave({
          tradingModeKey,
          flowConfig,
          nodes: uptoDateNodes,
          edges,
          reloadPlots: false,
          setIsSaving,
        });
        return uptoDateNodes;
      });
    },
    [
      edges,
      flowConfig,
      handleUserInputSave,
      reactFlowInstance,
      reactFlowWrapper,
      setIsSaving,
      setNodes,
      tradingModeKey,
    ]
  );
  return {
    onConnect,
    onDragOver,
    onDrop,
  };
}
