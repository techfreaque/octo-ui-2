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
                label: `${
                    liveOrBacktest.charAt(0).toUpperCase() + liveOrBacktest.slice(1)
                } trading`,
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
        let label
        const additionalToolbarButtons = {}
        if (liveOrBacktest === "live") {
            label = `${
                element.title
            } ${runId}`
            if (element.title.startsWith("Trades")) {
                additionalToolbarButtons['delete'] = {
                    type: 'button',
                    id: 'w2ui-delete',
                    text: 'reee',
                    tooltip: 'Delete selected records',
                    icon: 'w2ui-icon-cross',
                    batch: true,
                    onClick: onOrderCancel
                }
            }
        } else {

            label = `${
                element.title
            } ${campaignName} ${optimizerId} ${runId}`
        }

        newMenuItems[liveOrBacktest].children.push({
            label,
            noPadding: true,
            content: (<TableFromElement tableId={tableId}
                element={element}
                additionalToolbarButtons={additionalToolbarButtons}/>)
        })
    })
}


function TableFromElement({tableId, element, additionalToolbarButtons}) {
    useEffect(() => {
        createTable({
            elementID: tableId,
            name: element.title,
            tableName: tableId,
            searches: element.searches,
            columns: element.columns,
            records: element.rows,
            columnGroups: [],
            searchData: [],
            sortData: [],
            selectable: true,
            addToTable: false,
            reorderRows: false,
            onReorderRowCallback: null,
            additionalToolbarButtons
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableId, element])
    return (<div id={tableId}
        style={
            {
                width: "100%",
                height: "100%"
            }
        }/>)
}

function onOrderCancel(event) {
    const table = window.w2ui[event.target];
    const recsToDelete = table.getSelection()
    const orderIdsToCancel = recsToDelete.map(recordId => {
        return table.records[recordId].id
    })
    return event
    // event.onComplete = _onDelete
}
