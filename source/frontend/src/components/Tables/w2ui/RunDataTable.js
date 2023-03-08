import { w2confirm, w2ui } from "w2ui/dist/w2ui.es6.js"
import {
    hidden_class, ID_DATA,
    ID_SEPARATOR, MAX_SEARCH_LABEL_SIZE, METADATA_HIDDEN_FIELDS,
    METADATA_UNDISPLAYED_FIELDS, TENTACLE_SEPARATOR, TIMESTAMP_DATA
} from "../../../constants/backendConstants";
import { useEffect, useMemo } from "react";
import { createTable } from "../../../components/Tables/w2ui/W2UI";
import { useDisplayedRunIdsContext, useUpdateDisplayedRunIdsContext } from "../../../context/data/BotPlottedElementsProvider";
import createNotification from "../../Notifications/Notification";

export default function RunDataTableW2UI({
    tableTitle, tableId, runData, currentCampaignName, noData, reloadData, deleteRuns,
    hiddenMetadataColumns, restoreSettings
}) {
    const setDisplayedRunIds = useUpdateDisplayedRunIdsContext()
    const displayedRunIds = useDisplayedRunIdsContext()

    useEffect(() => {
        runData.data && hiddenMetadataColumns &&
            createMetadataTable(
                tableTitle, tableId, runData.data,
                false,
                currentCampaignName, reloadData,
                deleteRuns, hiddenMetadataColumns, setDisplayedRunIds, displayedRunIds, restoreSettings)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [runData, currentCampaignName, hiddenMetadataColumns]);
    return useMemo(() => (
        <div id={tableId + "-container"} style={{ height: "100%" }}>
            <div id={tableId + "-no-message"} className="text-center mx-4 my-4">
                {noData}
            </div>
            <div id={tableId + "-table"} style={{ height: "100%" }}></div>
        </div>
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [])
}

function createMetadataTable(
    tableTitle, tableId, metadata,
    forceSelectLatest, currentCampaignName,
    reloadData, deleteBacktestingRuns, hiddenMetadataColumns,
    setDisplayedRunIds, displayedRunIds, restoreSettings
) {
    document.getElementsByClassName(tableId + "-container").innerHTML = undefined;
    if (metadata !== null && metadata.length) {
        function handleSelection(tableName, event) {
            function handleSelection2() {
                setDisplayedRunIds(prev_selection => {
                    const selection = getSelectedBacktestingRunIdentifiers(tableName)
                    return { ...prev_selection, backtesting: selection }
                })
            }
            event.onComplete = handleSelection2
        }
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
                    ID_DATA.indexOf(key) !== -1 ? "int" : undefined,
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
        // if (hiddenMetadataColumns === null) {
        //     window.console && console.error(`createBacktestingMetadataTable called before hiddenBacktestingMetadataColumns was initialized`);
        //     hiddenMetadataColumns = [];
        // }
        sortedMetadata.forEach((run_metadata) => {
            if (typeof run_metadata["user inputs"] !== "undefined") {
                Object.keys(run_metadata["user inputs"]).forEach((inputTentacle) => {
                    const hasTentacle = addedTentacles.indexOf(inputTentacle) === -1;
                    _getUserInputColumns(userInputColumns, inputTentacle, userInputKeys, userInputSampleValueByKey,
                        inputPerTentacle, run_metadata["user inputs"], hiddenMetadataColumns);
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
            let sampleValue = userInputSampleValueByKey[key];
            if (sampleValue === null) {
                console.error(
                    `Impossible to guess type of ${key} user input (no sample value). Using text as search type`
                );
                sampleValue = "";
            }
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
            // {
            //     field: 'optimization campaign',
            //     value: currentCampaignName,
            //     operator: 'is',
            //     type: 'text'
            // }
        ]
        const sortData = [
            {
                field: "timestamp",
                direction: "asc"
            }
        ];
        const table = createTable(tableId + "-table", tableTitle, tableId,
            searches, columns, records, columnGroups, searchData, sortData,
            true, false, false, false, null, null);
        _addBacktestingMetadataTableButtons(
            table, runDataHidableColumns, userInputColumns,
            forceSelectLatest, currentCampaignName, reloadData,
            deleteBacktestingRuns, restoreSettings, records
        )
        table.on("select", (event) => handleSelection(tableId, event))
        table.on("unselect", (event) => handleSelection(tableId, event))
        if (records.length) {
            // _filterOptimizationCampaign(table, currentCampaignName);
            // table.toolbar.check('show-current-optimization-campaign');
            if (forceSelectLatest) {
                table.click(table.getFirst());
            }
            return tableId;
        }
    }
    const table = w2ui[tableId];
    if (typeof table !== "undefined") {
        table.destroy();
    }
    document.getElementById(tableId + "-no-message").classList.remove(hidden_class);
}


function _addBacktestingMetadataTableButtons(
    table, runDataHidableColumns, userInputColumns,
    forceSelectLatest, currentOptimizerCampaignName,
    reloadData, deleteBacktestingRuns, restoreSettings, records
) {
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

    function _deleteRuns(selectedIds) {
        const toDeleteRuns = selectedIds.map((recId) => table.get(recId))
        w2confirm(`Delete these ${toDeleteRuns.length} runs ?`)
            .yes(() => {
                deleteBacktestingRuns(toDeleteRuns.map((run) => {
                    return {
                        backtesting_id: getIdFromTableRow(run),
                        optimizer_id: getOptimizerIdFromTableRow(run),
                        campaign_name: getCampaignNameFromTableRow(run),
                    }
                }))
            });
    }
    function deleteSelectedRuns(event) {
        event.force = true;
        event.onComplete = () => {
            const selectedIds = table.getSelection()
            if (selectedIds?.length === 0) {
                return createNotification("Select a run to delete first", "danger")
            }
            _deleteRuns(selectedIds)
        }
    }
    function deleteShownRuns(event) {
        event.force = true;
        event.onComplete = () => _deleteRuns(table.last.searchIds)

    }
    table.toolbar.add({ type: 'button', id: 'show-run-info', text: 'Run info', icon: 'fa fa-bolt', disabled: true, onClick: showRunInfo });
    table.toolbar.add({ type: 'button', id: 'show-user-inputs', text: 'User inputs', icon: 'fa fa-user-cog', onClick: showUserInputInfo })
    table.toolbar.add({
        type: 'button', id: 'show-current-optimization-campaign',
        text: `Current optimization campaign: ${currentOptimizerCampaignName}`,
        icon: 'fas fa-list', onClick: () => showCurrentOptimizationCampaignOnly(currentOptimizerCampaignName)
    })
    table.toolbar.add({ type: 'spacer' });

    function _restoreSettings() {
        const selectedRuns = table.getSelection()
        if (selectedRuns && selectedRuns.length === 1) {
            function removeSpacesOnlyFromKeys(inputs) {
                inputs && Object.keys(inputs).forEach((inputKey) => {
                    const newInputKey = inputKey && inputKey.replace(/ /g, "_")
                    if (newInputKey && newInputKey !== inputKey) {
                        inputs[newInputKey] = inputs[inputKey]
                        delete inputs[inputKey]
                    }
                    typeof inputs[newInputKey] === 'object'
                        && removeSpacesOnlyFromKeys(inputs[newInputKey])
                })
                return inputs
            }
            const run = selectedRuns[0];
            const userInputs = removeSpacesOnlyFromKeys(JSON.parse(records[run]["user inputs"]))
            restoreSettings(userInputs)
        } else {
            createNotification("Error restoring user iputs", "danger", "You must select one run");
        }
    }
    table.toolbar.add({
        type: 'button', id: 'restore-run',
        text: 'Restore settings', icon: 'fa fa-download', onClick: _restoreSettings
    })
    table.toolbar.add({
        type: 'button', id: 'refresh-backtesting-runs',
        text: 'Refresh', icon: 'w2ui-icon-reload', onClick: reloadData
    })
    table.toolbar.add({
        type: 'button', id: 'delete_selected_runs',
        text: 'Delete', icon: 'fa fa-trash',
        onClick: deleteSelectedRuns
    });
    table.toolbar.add({
        type: 'button', id: 'delete_visible_runs',
        text: 'Delete visible', icon: 'fa fa-trash',
        onClick: deleteShownRuns
    });
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

export function userInputKey(userInput, tentacle) {
    return `${userInput}${TENTACLE_SEPARATOR}${tentacle}`;
}

function _getUserInputColumns(
    userInputColumns, inputTentacle, userInputKeys, userInputSampleValueByKey,
    inputPerTentacle, inputsByConfig, hiddenMetadataColumns
) {
    Object.keys(inputsByConfig[inputTentacle]).forEach((userInput) => {
        const key = userInputKey(userInput, inputTentacle);
        if (userInputKeys.indexOf(key) === -1 && hiddenMetadataColumns.indexOf(key.replaceAll("_", " ")) === -1) {
            userInputSampleValueByKey[key] = inputsByConfig[inputTentacle][userInput]
            if (userInputSampleValueByKey[key] instanceof Object && !(userInputSampleValueByKey[key] instanceof Array)) {
                _getUserInputColumns(userInputColumns, userInput, userInputKeys, userInputSampleValueByKey,
                    inputPerTentacle, inputsByConfig[inputTentacle], hiddenMetadataColumns
                )
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
        return "int";
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
            parent[userInputKey(userInputIdentifier, parentIdentifier)] = value;
        }
    })
}

function _formatMetadataRow(row, recordId) {
    row.timestamp = typeof row.timestamp === "undefined" ? undefined : Math.round(row.timestamp * 1000);
    row["start_time"] = typeof row["start_time"] === "undefined" ? undefined : Math.round(row["start_time"] * 1000);
    row["end_time"] = typeof row["end_time"] === "undefined" ? undefined : Math.round(row["end_time"] * 1000);
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
