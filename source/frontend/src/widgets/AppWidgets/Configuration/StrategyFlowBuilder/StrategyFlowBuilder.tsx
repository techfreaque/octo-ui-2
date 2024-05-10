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
  Connection,
  Controls,
  Edge,
  EdgeTypes,
  Node,
  NodeTypes,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import "./strategyFlowBuilder.css";
import SaveStrategyFlowBuilderSettings, {
  useSaveFlowBuilderSettings,
} from "./SaveStrategyFlowBuilder";
import {
  FlowEdgeConfigType,
  TentaclesConfigValuesType,
  TentaclesConfigsRootType,
  tentacleConfigTypes,
  useTentaclesConfigContext,
  useUpdateIsSavingTentaclesConfigContext,
} from "../../../../context/config/TentaclesConfigProvider";
import StrategyBlockNode from "./CustomNodes/StrategyBlockNode";
import {
  StrategyFlowMakerNameType,
  strategyFlowMakerName,
} from "../TentaclesConfig";
import { useUiConfigContext } from "../../../../context/config/UiConfigProvider";
import { flowEditorSettingsName } from "../UIConfig";
import { CustomEdge } from "./CustomNodes/ConnectionLine";

const getId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

export default function StrategyFlowBuilder({
  tradingModeKey,
}: {
  tradingModeKey: StrategyFlowMakerNameType;
}) {
  return useMemo(
    () => (
      <ReactFlowProvider>
        <StrategyFlowBuilderDrawingSpace tradingModeKey={tradingModeKey} />
      </ReactFlowProvider>
    ),
    [tradingModeKey]
  );
}

export interface NodeData {}
export interface EdgeData {}

function StrategyFlowBuilderDrawingSpace({
  tradingModeKey,
}: {
  tradingModeKey: StrategyFlowMakerNameType;
}) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const setIsSaving = useUpdateIsSavingTentaclesConfigContext();
  const currentTentaclesConfig = useTentaclesConfigContext();
  const currentTentaclesTradingConfig =
    currentTentaclesConfig?.[tentacleConfigTypes.tradingTentacles];
  const nodesConfig =
    currentTentaclesTradingConfig?.[strategyFlowMakerName]?.config;
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(
    (nodesConfig?.nodes && Object.values(nodesConfig?.nodes)) || []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeData>(
    (nodesConfig?.edges as FlowEdgeConfigType[]) || []
  );
  const uiConfig = useUiConfigContext();
  const autoSave = uiConfig?.[flowEditorSettingsName]?.auto_save;
  const jsonNodes = JSON.stringify(nodesConfig?.nodes);
  const jsonEdges = JSON.stringify(nodesConfig?.edges);
  useEffect(() => {
    if (
      typeof nodesConfig?.nodes === "object" &&
      !(nodesConfig.nodes as TentaclesConfigValuesType)?.mode_node
    ) {
      (nodesConfig.nodes as TentaclesConfigValuesType).mode_node = {
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
    setNodes((nodesConfig?.nodes && Object.values(nodesConfig?.nodes)) || []);
    setEdges((nodesConfig?.edges as FlowEdgeConfigType[]) || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonNodes, jsonEdges]);

  const [reactFlowInstance, setReactFlowInstance] = useState<
    ReactFlowInstance<NodeData, EdgeData>
  >();
  const handleUserInputSave = useSaveFlowBuilderSettings();
  // const getClosestEdge = useGetClosestEdge()

  const nodeTypes: NodeTypes = useMemo(() => ({ StrategyBlockNode }), []);
  const edgeTypes: EdgeTypes = useMemo(() => ({ default: CustomEdge }), []);

  const { onConnect, onDragOver, onDrop } = useGetFlowCallbacks({
    currentTentaclesTradingConfig,
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
  // // auto connect to closest node
  // const onNodeDragStop = useCallback((_, node) => {
  //     const closeEdge = getClosestEdge(node);
  //     closeEdge && setEdges((es) => {
  //         const nextEdges = es.filter((e) => e.className !== 'temp');
  //         if (closeEdge) {
  //             nextEdges.push(closeEdge);
  //         }
  //         return nextEdges;
  //     });
  // }, [getClosestEdge, setEdges]);

  // // show connect to closest node
  // const onNodeDrag = useCallback((_, node) => {
  //     const closeEdge = getClosestEdge(node);
  //     closeEdge && setEdges((es) => {
  //         const nextEdges = es.filter((e) => e.className !== 'temp');
  //         if (closeEdge && ! nextEdges.find((ne) => ne.source === closeEdge.source && ne.target === closeEdge.target)) {
  //             closeEdge.className = 'temp';
  //             nextEdges.push(closeEdge);
  //         }

  //         return nextEdges;
  //     });
  // }, [getClosestEdge, setEdges]);

  return useMemo(
    () =>
      currentTentaclesTradingConfig ? (
        <div
          className="dndflow"
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <SaveStrategyFlowBuilderSettings
            tradingModeKey={tradingModeKey}
            config={currentTentaclesTradingConfig}
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
      currentTentaclesTradingConfig,
      edgeTypes,
      edges,
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
  currentTentaclesTradingConfig,
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
  currentTentaclesTradingConfig: TentaclesConfigsRootType | undefined;
  edges: Edge<EdgeData>[];
  handleUserInputSave: ({
    tradingModeKey,
    config,
    nodes,
    edges,
    setIsSaving,
    reloadPlots,
    successNotification,
  }: {
    tradingModeKey: StrategyFlowMakerNameType;
    config;
    nodes: Node<NodeData>[];
    edges: Edge<EdgeData>[];
    setIsSaving;
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
      let uptoDateEdges: Edge<EdgeData>[] | undefined;
      setEdges((eds) => {
        uptoDateEdges = addEdge(connection, eds);
        return uptoDateEdges;
      });
      autoSave &&
        handleUserInputSave({
          tradingModeKey,
          config: currentTentaclesTradingConfig,
          nodes,
          edges: uptoDateEdges,
          reloadPlots: false,
          setIsSaving,
        });
    },
    [
      autoSave,
      currentTentaclesTradingConfig,
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
      const { nodesData, nodeType } = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );

      const position = reactFlowInstance?.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const type = "StrategyBlockNode";
      const newNode: Node<any, string | undefined> = {
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
      let uptoDateNodes: Node<NodeData>[] | undefined;
      setNodes((_nodes) => {
        uptoDateNodes = _nodes.concat(newNode);
        return uptoDateNodes;
      });
      handleUserInputSave({
        tradingModeKey,
        config: currentTentaclesTradingConfig,
        nodes: uptoDateNodes,
        edges,
        reloadPlots: false,
        setIsSaving,
      });
    },
    [
      currentTentaclesTradingConfig,
      edges,
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
