import {useEffect} from "react";
import {useBotPlottedElementsContext} from "../../../context/data/BotPlottedElementsProvider";
import AntSidebar from "../../../components/Sidebars/AntSidebar/AntSidebar";
import {useState} from "react";
import {Typography} from "antd";
import {createTable} from "../../../components/Tables/w2ui/W2UI";

export default function W2uiDataTable() {
    const [menuItems, setMenuItems] = useState()
    const plottedElements = useBotPlottedElementsContext()
    useEffect(() => {
        const newMenuItems = {}
        plottedElements && Object.keys(plottedElements).forEach(liveOrBacktest => {
            if (liveOrBacktest === "live") {
                generateTablesAndSidebarItems({plottedElements: plottedElements[liveOrBacktest], liveOrBacktest, newMenuItems})
            } else {
                plottedElements && Object.keys(plottedElements[liveOrBacktest]).forEach(campaignName => {
                    plottedElements && Object.keys(plottedElements[liveOrBacktest][campaignName]).forEach(optimizerId => {
                        generateTablesAndSidebarItems({
                            plottedElements: plottedElements[liveOrBacktest][campaignName][optimizerId],
                            liveOrBacktest,
                            newMenuItems,
                            campaignName,
                            optimizerId
                        })

                    })
                })
            }
        })
        setMenuItems(Object.values(newMenuItems))
    }, [plottedElements]);
    return (<AntSidebar menuItems={menuItems}/>)
}


function generateTablesAndSidebarItems({
    plottedElements,
    liveOrBacktest,
    newMenuItems,
    campaignName,
    optimizerId
}) {
    plottedElements && Object.keys(plottedElements).forEach(runId => {
        const thisRun = plottedElements[runId]
        thisRun && Object.keys(thisRun).forEach(symbol => {
            thisRun[symbol] && Object.keys(thisRun[symbol]).forEach(timeframe => {
                const subElements = thisRun[symbol][timeframe] ?. data ?. sub_elements
                subElements ?. forEach(subElement => {
                    if (subElement.name === "table") {
                        _generateTablesAndSidebarItems({
                            subElement,
                            liveOrBacktest,
                            newMenuItems,
                            campaignName,
                            optimizerId,
                            runId
                        })
                    }
                })
            })
        })
    })
}
function _generateTablesAndSidebarItems({
    subElement,
    liveOrBacktest,
    newMenuItems,
    campaignName,
    optimizerId,
    runId
}) {
    subElement ?. data ?. elements ?. forEach(element => {
        if (!newMenuItems[liveOrBacktest]) {
            newMenuItems[liveOrBacktest] = {
                label: `${liveOrBacktest} results`,
                content: (<Typography.Title level={2}>
                    Select a table from the sidebar</Typography.Title>),
                children: [],
                faIcon: undefined,
                antIcon: undefined
            }
        }
        const tableId = `${
            element.title.replace(/ /g, "_").replace(/\//g, "_")
        }-table`
        element ?. rows ?. forEach((row, index) => {
            row.recid = index
        })
        newMenuItems[liveOrBacktest].children.push({
            label: liveOrBacktest === "live" ? `${
                element.title
            } ${runId}` : `${
                element.title
            } ${campaignName} ${optimizerId} ${runId}`,
            noPadding: true,
            content: (<TableFromElement tableId={tableId}
                element={element}/>)
        })
    })
}


function TableFromElement({tableId, element}) {
    useEffect(() => {
        createTable(tableId, element.title, tableId, element.searches, element.columns, element.rows, [], [], [], true, false, false, false, null, null);
    }, [tableId, element])
    return (<div id={tableId}
        style={
            {
                width: "100%",
                height: "100%"
            }
        }/>)
}
