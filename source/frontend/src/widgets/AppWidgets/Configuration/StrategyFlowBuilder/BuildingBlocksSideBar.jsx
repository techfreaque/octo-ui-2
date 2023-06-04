import {Input, Tooltip, Typography} from "antd";
import {useBotColorsContext} from "../../../../context/config/BotColorsProvider";
import {useBotInfoContext} from "../../../../context/data/BotInfoProvider";
import SaveStrategyFlowBuilderSettings from "./SaveStrategyFlowBuilder";
import {SearchOutlined} from "@ant-design/icons";
import {useMemo, useState} from "react";


export function BuildingBlocksSidebar({
    tradingModeKey,
    config,
    nodes,
    edges,
    isSaving,
    setIsSaving
}) {
    const botInfo = useBotInfoContext()
    const [searchText, setSearchText] = useState("")
    const installedBlocksInfo = botInfo.installed_blocks_info
    const botColors = useBotColorsContext();
    return useMemo(() => (
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
                <Input.Search style={
                        {marginTop: "10px"}
                    }
                    onChange={
                        (event) => setSearchText(event.target.value)
                    }
                    placeholder="Search for ema, rsi, strategy..."
                    enterButton={
                        (<span >
                            <SearchOutlined style={{ margin: "auto" }} />
                        </span>
                            )
                    }
                    size="large"/>
                <Typography.Paragraph style={
                    {marginTop: "10px"}
                }>You can drag these building blocks to the pane</Typography.Paragraph>
                <BlockTemplates installedBlocksInfo={installedBlocksInfo}
                    searchText={searchText}/>
            </aside>
        ), [
        botColors.background,
        botColors.border,
        botColors.font,
        config,
        edges,
        installedBlocksInfo,
        isSaving,
        nodes,
        searchText,
        setIsSaving,
        tradingModeKey
    ]);
}

function BlockTemplates({installedBlocksInfo, searchText}) {
    return useMemo(() => {
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
                    searchText={searchText}
                    onDragStart={onDragStart}
                    blockType={blockType}/>
            </div>
        ))
    }, [installedBlocksInfo, searchText])
}
function BlockTemplate({ blocks, onDragStart, blockType, searchText }) {
    return useMemo(() => {
        const _searchText = searchText?.toLowerCase()
        return blocks && Object.keys(blocks).map(blockName => {
            const block = blocks[blockName]
            if (!searchText || searchText === "" || block.title.toLowerCase().includes(_searchText) || block.title_short.toLowerCase().includes(_searchText) || block.description.toLowerCase().includes(_searchText)) {
                function handleOnDragStart(event) {
                    onDragStart(event, blockName, blockType, block)
                }

                return (
                    <Tooltip key={blockName}
                        title={
                            block.description
                        }>
                        <div className="dndnode"
                            style={
                                { borderColor: block.color }
                            }
                            onDragStart={handleOnDragStart}
                            draggable>
                            {
                                block.title
                            } </div>
                    </Tooltip>
                )
            }
            else {
                return (<span key={blockName}/>)
            }
        })
    },[blockType, blocks, onDragStart, searchText])
}
