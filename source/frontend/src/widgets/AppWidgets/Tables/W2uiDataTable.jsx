import {useEffect} from "react";
import {useBotPlottedElementsContext} from "../../../context/data/BotPlottedElementsProvider";
import AntSidebar from "../../../components/Sidebars/AntSidebar/AntSidebar";
import {useState} from "react";
import {Typography} from "antd";
import {createTable} from "../../../components/Tables/w2ui/W2UI";
import {cancelOrders} from "../../../api/actions";
import {useBotDomainContext} from "../../../context/config/BotDomainProvider";

export default function W2uiDataTable() {
    const [menuItems, setMenuItems] = useState()
    const plottedElements = useBotPlottedElementsContext()
    const botDomain = useBotDomainContext()
    useEffect(() => {
        const newMenuItems = {}
        plottedElements && Object.keys(plottedElements).forEach(liveOrBacktest => {
            if (liveOrBacktest === "live") {
                generateTablesAndSidebarItems({plottedElements: plottedElements[liveOrBacktest], liveOrBacktest, newMenuItems, botDomain})
            } else {
                plottedElements && Object.keys(plottedElements[liveOrBacktest]).forEach(campaignName => {
                    plottedElements && Object.keys(plottedElements[liveOrBacktest][campaignName]).forEach(optimizerId => {
                        generateTablesAndSidebarItems({
                            plottedElements: plottedElements[liveOrBacktest][campaignName][optimizerId],
                            liveOrBacktest,
                            newMenuItems,
                            campaignName,
                            optimizerId,
                            botDomain
                        })
                    })
                })
            }
        })
        setMenuItems(Object.values(newMenuItems))
    }, [botDomain, plottedElements]);
    return menuItems?.length ? (
        <AntSidebar menuItems={menuItems}/>
    ) : (
        <div style={
            {
                marginLeft: "20px",
                marginTop: "20px"
            }
        }>
            <Typography.Title>
                There are no historical trading data tables to display :(
            </Typography.Title>
            <Typography.Title level={2}>
                To display tables for trades, orders, etc you can:
            </Typography.Title>
            <ul>
                <li>
                    Select a backtesting run
                </li>
                <li>
                    Enter valid exchange api keys and activate real trading
                </li>
                <li>
                    In simulation mode wait until your strategy takes the first trade
                </li>
            </ul>
            <Typography.Paragraph></Typography.Paragraph>
        </div>
    )
}


function generateTablesAndSidebarItems({
    plottedElements,
    liveOrBacktest,
    newMenuItems,
    campaignName,
    optimizerId,
    botDomain
}) {
    plottedElements && Object.keys(plottedElements).forEach(runId => {
        const thisRun = plottedElements[runId]
        thisRun && Object.keys(thisRun).forEach(symbol => {
            thisRun[symbol] && Object.keys(thisRun[symbol]).forEach(timeframe => {
                const subElements = thisRun[symbol][timeframe]?.data?.sub_elements
                subElements?.forEach(subElement => {
                    if (subElement.name === "table") {
                        _generateTablesAndSidebarItems({
                            subElement,
                            liveOrBacktest,
                            newMenuItems,
                            campaignName,
                            optimizerId,
                            runId,
                            botDomain
                        })
                    }
                })
            })
        })
    })
}

export function createTradingOrBacktestingTab(liveOrBacktest) {
    return {
            label: `${
            liveOrBacktest.charAt(0).toUpperCase() + liveOrBacktest.slice(1)
        } trading`,
        antIcon: liveOrBacktest === "live" ? "DollarOutlined" : "RobotOutlined",
        content: (
            <Typography.Title level={2}>
                Select a table from the sidebar</Typography.Title>
        ),
        children: []
    }
}

function _generateTablesAndSidebarItems({
    subElement,
    liveOrBacktest,
    newMenuItems,
    campaignName,
    optimizerId,
    runId,
    botDomain
}) {
    subElement?.data?.elements?.forEach(element => {
        if (!newMenuItems[liveOrBacktest]) {
            newMenuItems[liveOrBacktest] = createTradingOrBacktestingTab(liveOrBacktest)
        }
        const tableId = `${
            element.title.replace(/ /g, "_").replace(/\//g, "_")
        }-table`
        element?.rows?.forEach((row, index) => {
            row.recid = index
        })
        let label
        const additionalToolbarButtons = {}
        let cancelCallback
        if (liveOrBacktest === "live") {
            label = `${
                element.title
            } ${runId}`
            if (element.title.startsWith("Orders")) {
                additionalToolbarButtons['delete'] = {
                    type: 'button',
                    id: "w2ui-delete",
                    text: 'Cancel selected orders',
                    tooltip: 'Cancel selected orders',
                    icon: 'w2ui-icon-cross',
                    batch: true
                }
                cancelCallback = (event) => onOrderCancel(event, botDomain, tableId)
            }
        } else {
            label = `${
                element.title
            } ${campaignName} ${optimizerId} ${runId}`
        }

        newMenuItems[liveOrBacktest].children.push({
            label,
            antIcon: element.config?.antIcon,
            faIcon: element.config?.faIcon,
            noPadding: true,
            content: (
                <TableFromElement tableId={tableId}
                    element={element}
                    cancelCallback={cancelCallback}
                    additionalToolbarButtons={additionalToolbarButtons}/>
            )
        })
    })
}


function TableFromElement({tableId, element, additionalToolbarButtons, cancelCallback}) {
    useEffect(() => {
        const table = createTable({
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
            onDeleteCallback: cancelCallback
        });
        Object.values(additionalToolbarButtons).forEach(additionalButton => {
            table.toolbar.add(additionalButton);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableId, element])
    return (
        <div id={tableId}
            style={
                {
                    width: "100%",
                    height: "100%"
                }
            }/>
    )
}

function onOrderCancel(event, botDomain, tableId) {
    const table = window.w2ui[tableId];
    const recsToDelete = table.getSelection()
    const orderIdsToCancel = recsToDelete.map(recordId => {
        return table.records[recordId].id
    })
    event.onComplete = () => cancelOrders(botDomain, orderIdsToCancel)
}
