import { Tooltip } from "antd";
import { useBotColorsContext } from "../../../../context/config/BotColorsProvider";
import { useBotInfoContext } from "../../../../context/data/BotInfoProvider";
import SaveStrategyFlowBuilderSettings from "./SaveStrategyFlowBuilder";


export function BuildingBlocksSidebar({
    tradingModeKey,
    config,
    nodes,
    edges,
    isSaving,
    setIsSaving
}) {
    const botInfo = useBotInfoContext()

    const installedBlocksInfo = botInfo.installed_blocks_info

    const botColors = useBotColorsContext();
    return (
        <aside style={
            {
                maxWidth: "300px",
                overflowX: "auto",
                color: botColors.font,
                background: botColors.background,
                borderLeft: `1px solid ${
                    botColors.border
                }`
            }
        }>
            <SaveStrategyFlowBuilderSettings tradingModeKey={tradingModeKey}
                config={config}
                nodes={nodes}
                isSaving={isSaving}
                setIsSaving={setIsSaving}
                edges={edges}/>
            <div className="description">You can drag these building blocks to the pane</div>
<BlockTemplates
installedBlocksInfo={installedBlocksInfo} />
             </aside>
    );
}

function BlockTemplates({ installedBlocksInfo }) { 
    const onDragStart = (event, blockId, nodeType, nodesData) => {
        event.dataTransfer.setData("application/reactflow", JSON.stringify({
            nodeType,
            nodesData: {
                ...nodesData,
                blockId
            }
        }));
        event.dataTransfer.effectAllowed = "move";
    };
    return installedBlocksInfo && Object.keys(installedBlocksInfo).map(blockType => (
        <div key={blockType}>
            <h3>{blockType}</h3>
            <BlockTemplate blocks={
                    installedBlocksInfo[blockType]
                }
                onDragStart={onDragStart}
                blockType={blockType}/>
        </div>
    ))
}
function BlockTemplate({blocks, blockStyle, onDragStart, blockType}) {
    return blocks && Object.keys(blocks).map(blockName => (
        <Tooltip key={blockName}
            title={
                blocks[blockName].description
        }>
            <div className="dndnode"
                style={{
                    borderColor: blocks[blockName].color
                }                }
                onDragStart={
                    (event) => onDragStart(event, blockName, blockType, blocks[blockName])
                }
                draggable>
                {
                blocks[blockName].title
            } </div>
        </Tooltip>
    ))

}
