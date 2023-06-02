import {useCallback, useRef, useState} from "react";
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
import {useBotColorsContext} from "../../../../context/config/BotColorsProvider";
import SaveStrategyFlowBuilderSettings, {useSaveFlowBuilderSettings} from "./SaveStrategyFlowBuilder";
import {useBotInfoContext} from "../../../../context/data/BotInfoProvider";
import {Tooltip} from "antd";
import {tentacleConfigType, useTentaclesConfigContext} from "../../../../context/config/TentaclesConfigProvider";
import StrategyBlockNode from "./CustomNodes/StrategyBlockNode";
import { BuildingBlocksSidebar } from "./BuildingBlocksSideBar";

const getId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);
export default function StrategyFlowBuilder({tradingModeKey}) {
    return (
        <ReactFlowProvider>
            <StrategyFlowBuilderDrawingSpace tradingModeKey={tradingModeKey}/>
        </ReactFlowProvider>
    )
}

const nodeTypes = {
    StrategyBlockNode
};


function StrategyFlowBuilderDrawingSpace({tradingModeKey}) {
    const [isSaving, setIsSaving] = useState(false);
    const currentTentaclesConfig = useTentaclesConfigContext()
    const currentTentaclesTradingConfig = currentTentaclesConfig ?. [tentacleConfigType.tradingTentacles]
    const nodesConfig = currentTentaclesTradingConfig ?. [tradingModeKey] ?. config
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState((nodesConfig ?. nodes && Object.values(nodesConfig ?. nodes)) || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState(nodesConfig ?. edges || []);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const handleUserInputSave = useSaveFlowBuilderSettings()

    const onConnect = useCallback((params) => {
        setEdges((eds) => addEdge(params, eds))
        // onSave()
    }, [setEdges]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    // const onSave = useCallback(() => {
    //     if (reactFlowInstance) {
    //         const flow = reactFlowInstance.toObject();
    //         localStorage.setItem(flowKey, JSON.stringify(flow));
    //     }
    // }, [reactFlowInstance]);

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
            setIsSaving
        })
    }, [
        currentTentaclesTradingConfig,
        edges,
        handleUserInputSave,
        reactFlowInstance,
        setNodes,
        tradingModeKey
    ]);
    // const {setViewport} = useReactFlow();

    // const onRestore = useCallback(() => {
    //     const restoreFlow = async () => {
    //         const flow = JSON.parse(localStorage.getItem(flowKey));

    //         if (flow) {
    //             const {
    //                 x = 0,
    //                 y = 0,
    //                 zoom = 1
    //             } = flow.viewport;
    //             if (flow.nodes.length) {
    //                 let nope
    //                 [nope, id] = flow.nodes[flow.nodes.length - 1].id.split("_");
    //                 id = Number(id + 1)
    //             }
    //             setNodes(flow.nodes || []);
    //             setEdges(flow.edges || []);
    //             setViewport({x, y, zoom});
    //         }
    //     };

    //     restoreFlow();
    // }, [setNodes, setViewport]);

    // useEffect(() => {
    //     onRestore()
    // }, [])

    return currentTentaclesTradingConfig && (
        <div className="dndflow">
            <div className="reactflow-wrapper"
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
                    maxZoom={500}
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
