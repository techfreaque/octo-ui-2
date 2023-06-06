import {useCallback, useMemo, useRef, useState} from "react";
import {
    Controls,
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    useEdgesState,
    useNodesState

} from "reactflow";
import "reactflow/dist/style.css";
import "./strategyFlowBuilder.css";
import {useSaveFlowBuilderSettings} from "./SaveStrategyFlowBuilder";
import {tentacleConfigType, useTentaclesConfigContext} from "../../../../context/config/TentaclesConfigProvider";
import StrategyBlockNode from "./CustomNodes/StrategyBlockNode";
import {BuildingBlocksSidebar} from "./BuildingBlocksSideBar";

const getId = () => Date.now().toString(36) + Math.random().toString(36).substring(2)

export default function StrategyFlowBuilder({tradingModeKey}) {
    return (
        <ReactFlowProvider>
            <StrategyFlowBuilderDrawingSpace tradingModeKey={tradingModeKey}/>
        </ReactFlowProvider>
    )
}

function StrategyFlowBuilderDrawingSpace({tradingModeKey}) {
    const [isSaving, setIsSaving] = useState(false);
    const currentTentaclesConfig = useTentaclesConfigContext()
    const currentTentaclesTradingConfig = currentTentaclesConfig?.[tentacleConfigType.tradingTentacles]
    const nodesConfig = currentTentaclesTradingConfig?.[tradingModeKey]?.config
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState((nodesConfig?.nodes && Object.values(nodesConfig?.nodes)) || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState(nodesConfig?.edges || []);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const handleUserInputSave = useSaveFlowBuilderSettings()
    // const getClosestEdge = useGetClosestEdge()

    const nodeTypes = useMemo(() => ({StrategyBlockNode}), [])

    const onConnect = useCallback((params) => {
        let uptoDateEdges
        setEdges((eds) => {
            uptoDateEdges = addEdge(params, eds)
            return uptoDateEdges
        })
        handleUserInputSave({
            tradingModeKey,
            config: currentTentaclesTradingConfig,
            nodes,
            edges: uptoDateEdges,
            reloadPlots: false
        })
    }, [currentTentaclesTradingConfig, handleUserInputSave, nodes, setEdges, tradingModeKey]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback((event) => {
        event.preventDefault();
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const {nodesData, nodeType} = JSON.parse(event.dataTransfer.getData("application/reactflow"));

        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top
        });
        const type = "StrategyBlockNode"
        const newNode = {
            id: getId(),
            type,
            position,
            data: {
                ...nodesData,
                nodeType
            } || {
                type
            }
        };
        let uptoDateNodes
        setNodes((_nodes) => {
            uptoDateNodes = _nodes.concat(newNode)
            return uptoDateNodes
        });
        handleUserInputSave({
            tradingModeKey,
            config: currentTentaclesTradingConfig,
            nodes: uptoDateNodes,
            edges,
            reloadPlots: false
        })
    }, [
        currentTentaclesTradingConfig,
        edges,
        handleUserInputSave,
        reactFlowInstance,
        setNodes,
        tradingModeKey
    ]);

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

    return currentTentaclesTradingConfig && (
        <div className="dndflow">
            <div className="reactflow-wrapper"
                style={
                    {
                        // transform: "scale(0.5)",
                        // transformOrigin: "0% 0% 0px"
                    }
                }
                ref={reactFlowWrapper}>
                <ReactFlow nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    fitView
                    maxZoom={5000}
                    nodeTypes={nodeTypes}>
                    <Controls/>
                </ReactFlow>
            </div>
            <BuildingBlocksSidebar tradingModeKey={tradingModeKey}
                config={currentTentaclesTradingConfig}
                nodes={nodes}
                isSaving={isSaving}
                setIsSaving={setIsSaving}
                edges={edges}/>
        </div>
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
