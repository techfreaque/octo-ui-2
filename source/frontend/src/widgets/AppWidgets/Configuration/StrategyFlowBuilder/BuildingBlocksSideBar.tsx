import { Input, Tooltip, Typography } from "antd";
import { useBotColorsContext } from "../../../../context/config/BotColorsProvider";
import { useBotInfoContext } from "../../../../context/data/BotInfoProvider";
import { SearchOutlined } from "@ant-design/icons";
import { DragEvent, DragEventHandler, useMemo, useState } from "react";
import { objectKeys } from "../../../../helpers/helpers";

export type BlockNameType = "";
export type BlockType = {
  title: string;
  title_short: string;
  description: string;
  color: string;
};

type BlocksType = {
  [blockName: string]: BlockType;
};

export type BlockInfoType = {
  [blockType in BlockNameType]: BlocksType;
};

export default function BuildingBlocksSidebar() {
  const botInfo = useBotInfoContext();
  const [searchText, setSearchText] = useState<string>("");
  const installedBlocksInfo = botInfo?.installed_blocks_info;
  const botColors = useBotColorsContext();
  return useMemo(
    () =>
      installedBlocksInfo ? (
        <aside
          style={{
            color: botColors.font,
            background: botColors.background,
          }}
        >
          <Input.Search
            style={{ marginTop: "10px" }}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search for ema, rsi, strategy..."
            enterButton={
              <span>
                <SearchOutlined style={{ margin: "auto" }} />
              </span>
            }
            size="large"
          />
          <Typography.Paragraph style={{ marginTop: "10px" }}>
            You can drag these building blocks to the pane
          </Typography.Paragraph>
          <BlockTemplates
            installedBlocksInfo={installedBlocksInfo}
            searchText={searchText}
          />
        </aside>
      ) : (
        <></>
      ),
    [botColors.background, botColors.font, installedBlocksInfo, searchText]
  );
}

// const blockTypeDescriptions = {
//     "StrategyBlock": "",
//     "EvaluatorBlock": "The Evaluator Blocks contains a range of evaluation criteria used to assess trading data.",
//     "IndicatorBlock": " The Indicator Blocks includes a comprehensive set of technical indicators that can be applied to trading data. These indicators encompass various aspects of market analysis",
//     "ActionBlock": "The Action Blocks consists of various actions that can be performed in a trading strategy",
// }

function BlockTemplates({
  installedBlocksInfo,
  searchText,
}: {
  installedBlocksInfo: BlockInfoType;
  searchText: string;
}): JSX.Element {
  return useMemo(() => {
    const onDragStart = (
      event: DragEvent<HTMLDivElement>,
      blockId: string,
      nodeType: BlockNameType,
      nodesData: BlockType
    ) => {
      event.dataTransfer.setData(
        "application/reactflow",
        JSON.stringify({
          nodeType,
          nodesData: {
            ...nodesData,
            blockId,
          },
        })
      );
      event.dataTransfer.effectAllowed = "move";
    };
    return installedBlocksInfo ? (
      <>
        {objectKeys(installedBlocksInfo).map((blockType) => (
          <div key={blockType}>
            <h3>{blockType.replace("Block", " Block")}</h3>
            <BlockTemplate
              blocks={installedBlocksInfo[blockType]}
              searchText={searchText}
              onDragStart={onDragStart}
              blockType={blockType}
            />
          </div>
        ))}
      </>
    ) : (
      <></>
    );
  }, [installedBlocksInfo, searchText]);
}
function BlockTemplate({
  blocks,
  onDragStart,
  blockType,
  searchText,
}: {
  blocks: BlocksType;
  onDragStart: (
    event: DragEvent<HTMLDivElement>,
    blockId: string,
    nodeType: BlockNameType,
    nodesData: BlockType
  ) => void;
  blockType: BlockNameType;
  searchText: string;
}): JSX.Element {
  return useMemo(() => {
    const _searchText = searchText?.toLowerCase();
    return blocks ? (
      <>
        {Object.keys(blocks).map((blockName) => {
          const block = blocks[blockName];
          if (
            !searchText ||
            searchText === "" ||
            block.title.toLowerCase().includes(_searchText) ||
            block.title_short.toLowerCase().includes(_searchText) ||
            block.description.toLowerCase().includes(_searchText)
          ) {
            const handleOnDragStart: DragEventHandler<HTMLDivElement> = (
              event
            ) => {
              onDragStart(event, blockName, blockType, block);
            };
            return (
              <Tooltip
                key={blockName}
                placement={"right"}
                title={block.description}
              >
                <div
                  style={{
                    padding: "4px",
                    border: `1px solid ${block.color}`,
                    borderRadius: "8px",
                    marginBottom: "10px",
                    display: "flex",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "grab",
                  }}
                  onDragStart={handleOnDragStart}
                  draggable
                >
                  {block.title}
                </div>
              </Tooltip>
            );
          } else {
            return <span key={blockName} />;
          }
        })}
      </>
    ) : (
      <></>
    );
  }, [blockType, blocks, onDragStart, searchText]);
}
