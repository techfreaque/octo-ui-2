import { w2confirm, w2ui } from "w2ui/dist/w2ui.es6.js"
// import "w2ui/dist/w2ui.min.css"
import {
    displayedRunIds, hiddenBacktestingMetadataColumns, hidden_class, ID_DATA,
    ID_SEPARATOR, MAX_SEARCH_LABEL_SIZE, METADATA_HIDDEN_FIELDS,
    METADATA_UNDISPLAYED_FIELDS, TENTACLE_SEPARATOR, TIMESTAMP_DATA
} from "../../../constants/backendConstants";
import { useEffect } from "react";
import { createTable } from "../../../components/Tables/w2ui/W2UI";

export default function RunDataTableW2UI({ tableTitle, tableId, runData, currentCampaignName, noData, reloadData }) {
    useEffect(() => {
        runData.data && currentCampaignName
            && updateBacktestingSelector(tableTitle, tableId, runData, false, currentCampaignName, reloadData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [runData, currentCampaignName]);

    return (
        <div id={tableId + "-container"} style={{ height: "100%" }}>
            <div id={tableId + "-no-message"} className="text-center mx-4 my-4">
                {noData}
            </div>
            <div id={tableId + "-table"} style={{ height: "100%" }}></div>
        </div>
    )
}

function updateBacktestingSelector(tableTitle, tableId, msg, forceSelectLatestBacktesting = false, currentCampaignName, reloadData) {
    const updateSelection = (event, selected) => {
        if (typeof event.recid !== "undefined") {
            updateOrClearBacktestingAnalysisReportFromSelectedRow(w2ui[event.target].get(event.recid), selected);
        }
        if (typeof event.recids !== "undefined") {
            event.recids.forEach(recid => {
                updateOrClearBacktestingAnalysisReportFromSelectedRow(w2ui[event.target].get(recid), selected);
            })
        }
    }

    const afterUpdateSelection = (event) => {
        // Make sure every element in selectedId is actually still selected
        clearUnselectedRuns(event.target);
    }
    createBacktestingMetadataTable(
        tableTitle, tableId, msg.data, updateSelection,
        afterUpdateSelection, forceSelectLatestBacktesting,
        currentCampaignName, reloadData)
    // currentLoadedOptimizerCampaigns = msg.campaigns
}

function createBacktestingMetadataTable(
    tableTitle, tableId, metadata, sectionHandler, afterSectionHandler,
    forceSelectLatest, currentCampaignName, reloadData
) {
    // const tableName = tableTitle.replaceAll(" ", "-");
    _clearAllBacktestingSelection(tableId);
    document.getElementsByClassName("backtesting-run-container").innerHTML = undefined;
    if (metadata !== null && metadata.length) {
        const sortedMetadata = metadata.sort((a, b) => b.timestamp - a.timestamp);
        document.getElementById(tableId + "-no-message").classList.add(hidden_class);
        const keys = Object.keys(sortedMetadata[0]).filter(key => METADATA_UNDISPLAYED_FIELDS.indexOf(key) === -1);
        const runDataColumns = keys.map((key) => {
            return {
                field: key,
                text: key,
                size: `${1 / keys.length * 100}%`,
                sortable: true,
                hidden: METADATA_HIDDEN_FIELDS.indexOf(key) !== -1,
                render: TIMESTAMP_DATA.indexOf(key) !== -1 ? "datetime" :
                    ID_DATA.indexOf(key) !== -1 ? "float" : undefined,
            }
        })
        // Always put the id attribute first
        _ensureBacktestingMetadataColumnsOrder(runDataColumns);
        const columnGroups = [{ text: "Run information", span: runDataColumns.length }];
        // Keep 1st column displayed to enable tree expand
        const runDataHidableColumns = runDataColumns.slice(1, runDataColumns.length);
        // Build user inputs columns. They are hidden by default
        const userInputColumns = [];
        const addedTentacles = [];
        const inputPerTentacle = {};
        const userInputKeys = [];
        const userInputSampleValueByKey = {};
        // if (hiddenBacktestingMetadataColumns === null) {
        //     window.console && console.error(`createBacktestingMetadataTable called before hiddenBacktestingMetadataColumns was initialized`);
        //     hiddenBacktestingMetadataColumns = [];
        // }
        sortedMetadata.forEach((run_metadata) => {
            if (typeof run_metadata["user inputs"] !== "undefined") {
                Object.keys(run_metadata["user inputs"]).forEach((inputTentacle) => {
                    const hasTentacle = addedTentacles.indexOf(inputTentacle) === -1;
                    _getUserInputColumns(userInputColumns, inputTentacle, userInputKeys, userInputSampleValueByKey,
                        inputPerTentacle, run_metadata["user inputs"]);
                    if (!hasTentacle) {
                        addedTentacles.push(inputTentacle);
                    }
                })
            }
        })
        Object.keys(inputPerTentacle).forEach((key) => {
            columnGroups.push({
                text: key,
                span: inputPerTentacle[key]
            });
        })
        userInputColumns.sort((a, b) => {
            const aField = a.field.split(TENTACLE_SEPARATOR).reverse().join("");
            const bField = b.field.split(TENTACLE_SEPARATOR).reverse().join("");
            if (aField > bField) {
                return 1;
            } else if (aField < bField) {
                return -1;
            }
            return 0;
        });
        const userInputKeySize = `${1 / (userInputColumns.length + runDataColumns.length - runDataHidableColumns.length) * 100}%`;
        userInputColumns.forEach((column) => {
            column.size = userInputKeySize;
        })
        const columns = runDataColumns.concat(userInputColumns);
        // init searches before formatting rows to access user_inputs objects
        const userInputSearches = userInputKeys.map((key) => {
            const splitKey = key.split(TENTACLE_SEPARATOR);
            const sampleValue = userInputSampleValueByKey[key];
            const label = splitKey[0].length > MAX_SEARCH_LABEL_SIZE ?
                `${splitKey[0].slice(0, MAX_SEARCH_LABEL_SIZE)} ...` : splitKey[0];
            return {
                field: key,
                label: `${label} (${splitKey[1]})`,
                type: TIMESTAMP_DATA.indexOf(key) !== -1 ? "datetime" : _getTableDataType(null,
                    { type: null, field: key }, "text", sampleValue),
            }
        })
        let recordId = 0;
        const records = sortedMetadata.map((row) => {
            recordId = _formatMetadataRow(row, recordId);
            return row
        });
        const runDataSearches = keys.map((key) => {
            return {
                field: key,
                label: key,
                type: TIMESTAMP_DATA.indexOf(key) !== -1 ? "datetime" : _getTableDataType(records,
                    { type: null, field: key }, "text", null),
            };
        });
        _ensureBacktestingMetadataColumnsOrder(runDataSearches);
        const searches = runDataSearches.concat(userInputSearches);
        const searchData = [
            {
                field: 'optimization campaign',
                value: currentCampaignName,
                operator: 'is',
                type: 'text'
            }
        ]
        const sortData = [
            {
                field: "timestamp",
                direction: "asc"
            }
        ];
        createTable(tableId + "-table", tableTitle, tableId,
            searches, columns, records, columnGroups, searchData, sortData,
            true, false, false, false, null, null);
        const table = w2ui[tableId];
        _addBacktestingMetadataTableButtons(
            table, runDataHidableColumns, userInputColumns,
            forceSelectLatest, currentCampaignName, reloadData
        )
        table.on("select", function (event) {
            console.log("test1");
            sectionHandler(event, true);
            event.onComplete = afterSectionHandler;
        })
        table.on("unselect", function (event) {
            console.log("test2");
            sectionHandler(event, false);
            event.onComplete = afterSectionHandler;
        })
        if (records.length) {
            _filterOptimizationCampaign(table, currentCampaignName);
            table.toolbar.check('show-current-optimization-campaign');
            if (forceSelectLatest || autoSelectFirstBacktesting()) {
                table.click(table.getFirst());
            }
            return tableId;
        }
    }
    const table = w2ui[tableId];
    if (typeof table !== "undefined") {
        table.destroy();
    }
    document.getElementById(tableId + "-no-message").removeClass(hidden_class);
}


function _addBacktestingMetadataTableButtons(table, runDataHidableColumns, userInputColumns, forceSelectLatest, currentOptimizerCampaignName, reloadData) {
    // tabs
    function showRunInfo() {
        table.showColumn(...runDataHidableColumns.map((column) => column.field))
        table.hideColumn(...userInputColumns.map((column) => column.field))
        table.toolbar.disable('show-run-info');
        table.toolbar.enable('show-user-inputs');
    }
    function showUserInputInfo() {
        table.hideColumn(...runDataHidableColumns.map((column) => column.field))
        table.showColumn(...userInputColumns.map((column) => column.field))
        table.toolbar.disable('show-user-inputs');
        table.toolbar.enable('show-run-info');
    }
    function showCurrentOptimizationCampaignOnly(currentOptimizerCampaignName) {
        const buttonId = 'show-current-optimization-campaign';
        const button = table.toolbar.get(buttonId);
        if (button.checked) {
            table.searchReset()
            table.toolbar.uncheck(buttonId);
        } else {
            _filterOptimizationCampaign(table, currentOptimizerCampaignName);
            table.toolbar.check(buttonId);
        }
    }
    function deleteShownRuns() {
        const toDeleteRunIds = table.last.searchIds;
        let toDeleteRuns = [];
        if (toDeleteRunIds.length === 0) {
            toDeleteRuns = table.records;
        } else {
            toDeleteRuns = toDeleteRunIds.map((id) => table.records[id]);
        }
        w2confirm(`Delete these ${toDeleteRuns.length} runs ?`)
            .yes(() => {
                // deleteBacktestingRuns(toDeleteRuns.map((run) => {
                //     return {
                //         backtesting_id: getIdFromTableRow(run),
                //         optimizer_id: getOptimizerIdFromTableRow(run),
                //         campaign_name: getCampaignNameFromTableRow(run),
                //     }
                // }))
            });
    }
    table.toolbar.add({ type: 'button', id: 'show-run-info', text: 'Run info', icon: 'fa fa-bolt', disabled: true, onClick: showRunInfo });
    table.toolbar.add({ type: 'button', id: 'show-user-inputs', text: 'User inputs', icon: 'fa fa-user-cog', onClick: showUserInputInfo })
    table.toolbar.add({
        type: 'button', id: 'show-current-optimization-campaign',
        text: `Current optimization campaign: ${currentOptimizerCampaignName}`,
        icon: 'fas fa-list', onClick: () => showCurrentOptimizationCampaignOnly(currentOptimizerCampaignName)
    })
    // table.toolbar.add({ type: 'button', id: 'optimizer-campaigns-to-load-button', text: 'Campaigns to Load',
    //     icon: 'fa fa-cog', onClick: openOptimizerCampaignsToLoadSettings })
    table.toolbar.add({ type: 'spacer' });
    table.toolbar.add({ type: 'button', id: 'refresh-backtesting-runs',
        text: 'Refresh', icon: 'w2ui-icon-reload', onClick: reloadData})
    table.toolbar.add({ type: 'button', id: 'delete_shown_runs', text: 'Delete', icon: 'fa fa-trash', onClick: deleteShownRuns });
}


function updateBacktestingAnalysisReport(run_id, optimizer_id, campaign_name, addReport) {
    const fullId = mergeRunIdentifiers(run_id, optimizer_id, campaign_name);
    // if(displayedRunIds.indexOf(fullId) === -1){
    //     displayedRunIds.push(fullId)
    // }
    // // upper charts
    // displayChartsAndInputs(true, run_id, false, optimizer_id, campaign_name, addReport, getSelectedSymbol(), getSelectedTimeFrame(), false, null, null)
    // // toolbox
    // const data = {
    //     id: run_id,
    //     optimizer_id: optimizer_id,
    //     campaign_name: campaign_name,
    //     exchange: getExchangeName(),
    //     symbol: getSelectedSymbol(),
    //     time_frame: getSelectedTimeFrame(),
    //     added: addReport,
    //     fullId: fullId,
    //     backtesting_analysis_settings: getBacktestingPlotSettings()
    // }
    // send_and_interpret_bot_update(data, $("#backtesting-run-overview").data("url"), null,
    //     updateBacktestingReport, generic_request_failure_callback);
}


function mergeRunIdentifiers(backtestingId, optimizerId, campaignName) {
    return `${backtestingId}${ID_SEPARATOR}${optimizerId}${ID_SEPARATOR}${campaignName}`
}

function getIdFromTableRow(row) {
    return Number(row.id);
}

function getOptimizerIdFromTableRow(row) {
    return Number(row["optimizer id"]);
}

function getCampaignNameFromTableRow(row) {
    return row["optimization campaign"];
}


function updateOrClearBacktestingAnalysisReportFromSelectedRow(row, selected) {
    if (selected) {
        updateBacktestingAnalysisReport(
            getIdFromTableRow(row),
            getOptimizerIdFromTableRow(row),
            getCampaignNameFromTableRow(row),
            true
        );
    } else {
        clearBacktestingAnalysisReport(
            getIdFromTableRow(row),
            getOptimizerIdFromTableRow(row),
            getCampaignNameFromTableRow(row),
        );
    }
}


function clearBacktestingAnalysisReport(run_id, optimizer_id, campaign_name) {
    const fullId = mergeRunIdentifiers(run_id, optimizer_id, campaign_name);
    if (displayedRunIds.indexOf(fullId) !== -1) {
        displayedRunIds.splice(displayedRunIds.indexOf(fullId), 1);
    }
    const emptyData = {
        data: {
            sub_elements: []
        }
    };
    const chartIdentifier = run_id ? optimizer_id ? `${run_id}:${optimizer_id} - ${campaign_name}` : `${run_id} - ${campaign_name}` : "live";
    // updateDisplayedElement(emptyData, true, editors, false, run_id, optimizer_id, campaign_name,
    //     false, backtestingTableNames, chartIdentifier);
    const backtestingChartIdentifier = mergeRunIdentifiers(run_id, optimizer_id, campaign_name);
    // _updateBacktestingChart(emptyData, true, run_id, optimizer_id, campaign_name,
    //     false, backtestingTableName, backtestingChartIdentifier, false)
}

function _updateBacktestingChart(data, replot, backtesting_id, optimizer_id, campaign_name,
    added, backtestingTableName, chartIdentifier, backtestingPart) {
    // _updateChart(data, replot, backtesting_id, optimizer_id, campaign_name,
    // added, backtestingTableName, chartIdentifier, afterGraphPlot, [], backtestingPart);
}

function _clearAllBacktestingSelection(tableName) {
    if (typeof w2ui[tableName] !== "undefined") {
        // unselect previously selected elements
        const table = w2ui[tableName];
        table.getSelection().forEach(recid => {
            updateOrClearBacktestingAnalysisReportFromSelectedRow(table.get(recid), false);
        })
    }
}

function clearUnselectedRuns(tableName) {
    const selectedRunIdentifiers = getSelectedBacktestingRunIdentifiers(tableName);
    const toRemove = displayedRunIds.filter(element => selectedRunIdentifiers.indexOf(element) === -1);
    toRemove.forEach(fullId => displayedRunIds.splice(displayedRunIds.indexOf(fullId), 1));
}

function getSelectedBacktestingRunIdentifiers(tableName) {
    const table = w2ui[tableName];
    if (typeof table !== "undefined") {
        return table.getSelection().map(recid => {
            const row = table.get(recid);
            return mergeRunIdentifiers(
                getIdFromTableRow(row),
                getOptimizerIdFromTableRow(row),
                getCampaignNameFromTableRow(row)
            );
        })
    }
    return [];
}

function _ensureBacktestingMetadataColumnsOrder(runDataColumns) {
    let idIndex = 0;
    runDataColumns.forEach((column, index) => {
        if (column.field === "id") {
            idIndex = index;
        }
    })
    runDataColumns.splice(0, 0, runDataColumns.splice(idIndex, 1)[0]);
}

function _userInputKey(userInput, tentacle) {
    return `${userInput}${TENTACLE_SEPARATOR}${tentacle}`;
}

function _getUserInputColumns(userInputColumns, inputTentacle, userInputKeys, userInputSampleValueByKey,
    inputPerTentacle, inputsByConfig) {
    Object.keys(inputsByConfig[inputTentacle]).forEach((userInput) => {
        const key = _userInputKey(userInput, inputTentacle);
        if (userInputKeys.indexOf(key) === -1 && hiddenBacktestingMetadataColumns.indexOf(key.replaceAll("_", " ")) === -1) {
            userInputSampleValueByKey[key] = inputsByConfig[inputTentacle][userInput]
            if (userInputSampleValueByKey[key] instanceof Object && !(userInputSampleValueByKey[key] instanceof Array)) {
                _getUserInputColumns(userInputColumns, userInput, userInputKeys, userInputSampleValueByKey,
                    inputPerTentacle, inputsByConfig[inputTentacle])
            } else {
                userInputKeys.push(key);
                userInputColumns.push({
                    field: key,
                    text: userInput,
                    sortable: true,
                    hidden: true
                });
                if (typeof inputPerTentacle[inputTentacle] !== "undefined") {
                    inputPerTentacle[inputTentacle] += 1;
                } else {
                    inputPerTentacle[inputTentacle] = 1;
                }
            }
        }
    });
}

function _getTableDataType(records, search, defaultValue, sampleValue) {
    if (ID_DATA.indexOf(search.field) !== -1) {
        return "float";
    }
    if (search.type !== null) {
        return search.type;
    }
    const _sampleValue = sampleValue === null ? records[0][search.field] : sampleValue;
    if (typeof _sampleValue === "undefined") {
        return defaultValue;
    }
    if (typeof _sampleValue === "number") {
        return "float";
    }
    if (typeof _sampleValue === "string") {
        return "text";
    }
    if (typeof _sampleValue === "object") {
        return "list";
    }
    return defaultValue;
}

function _formatUserInputRow(parent, userInputData, parentIdentifier) {
    Object.keys(userInputData).forEach((userInputIdentifier) => {
        const value = userInputData[userInputIdentifier];
        if (value instanceof Object && !(value instanceof Array)) {
            _formatUserInputRow(parent, userInputData[userInputIdentifier], userInputIdentifier);
        } else {
            parent[_userInputKey(userInputIdentifier, parentIdentifier)] = value;
        }
    })
}

function _formatMetadataRow(row, recordId) {
    row.timestamp = typeof row.timestamp === "undefined" ? undefined : Math.round(row.timestamp * 1000);
    row["start time"] = typeof row["start time"] === "undefined" ? undefined : Math.round(row["start time"] * 1000);
    row["end time"] = typeof row["end time"] === "undefined" ? undefined : Math.round(row["end time"] * 1000);
    if (typeof row["user inputs"] !== "undefined") {
        _formatUserInputRow(row, row["user inputs"], null);
    }
    Object.keys(row).forEach(function (key) {
        if (typeof row[key] === "object" && key !== "children") {
            row[key] = JSON.stringify(row[key]);
        }
    })
    if (typeof row.children !== "undefined") {
        const optimizerId = row.children[0]["optimizer id"]
        row.id = `${row.id} [optimizer ${optimizerId}]`
        const subRows = [];
        row.children.forEach(function (rowChild) {
            recordId = _formatMetadataRow(rowChild, recordId)
            subRows.push(rowChild)
        })
        row.w2ui = {
            children: subRows
        }
        delete row.children
    } else {
        row.id = `${row.id}`
    }
    row.recid = recordId++;
    return recordId
}



function _filterOptimizationCampaign(table, currentOptimizerCampaignName) {
    // default search and sort
    table.search(
        [{ field: 'optimization campaign', value: currentOptimizerCampaignName, operator: 'is' }], 'AND'
    )
    // force "is" operator as it is not used in text searches by default
    table.searchData[0]['operator'] = "is"
    table.localSearch()
    table.refresh()
}

function autoSelectFirstBacktesting() {
    // TODO (use js localstorage ?)
    return false;
}
