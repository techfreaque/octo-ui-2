
import { useEffect } from "react";
import { w2ui } from "w2ui/dist/w2ui.es6.min";
import { sendAndInterpretBotUpdate } from "../../../api/fetchAndStoreFromBot";
import createNotification from "../../../components/Notifications/Notification";
import { createTable } from "../../../components/Tables/w2ui/W2UI";
import { backendRoutes, hidden_class, ID_DATA, MAX_SEARCH_LABEL_SIZE, TENTACLE_SEPARATOR, TIMESTAMP_DATA } from "../../../constants/backendConstants";
import { useFetchOptimizerQueue, useOptimizerQueueContext, useSaveOptimizerQueue, useUpdateOptimizerQueueCounterContext } from "../../../context/data/OptimizerQueueProvider";


export default function OptimizerQueueTable() {
    const fetchOptimizerQueue = useFetchOptimizerQueue()
    const optimizerQueue = useOptimizerQueueContext()
    const updateOptimizerQueueCounter = useUpdateOptimizerQueueCounterContext()
    const saveOptimizerQueue = useSaveOptimizerQueue()
    useEffect(() => {
        fetchOptimizerQueue()
    }, [fetchOptimizerQueue]);
    useEffect(() => {
        optimizerQueue && optimizerQueue.queue && handleOptimizerQueue(optimizerQueue.queue, updateOptimizerQueueCounter, saveOptimizerQueue)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optimizerQueue]);

    return (
        <div id={"optimizer-queue-container"} style={{ height: "100%" }}>
            <div id={"optimizer-queue-no-message"} className="text-center mx-4 my-4">
                <h4>
                    The optimizer queue is empty
                </h4>
            </div>
            <div id={"optimizer-queue-table"} style={{ height: "100%" }}></div>
        </div>
    )
}

function handleOptimizerQueue(optimizerQueue, updateOptimizerQueueCounter, saveOptimizerQueue) {
    updateOptimizerQueueEditor(optimizerQueue, "optimizer-queue-table", saveOptimizerQueue, updateOptimizerQueueCounter);
}

function updateOptimizerQueueEditor(optimizerQueue, containerId, saveOptimizerQueue, updateOptimizerQueueCounter) {
    updateOptimizerQueueCount(optimizerQueue, updateOptimizerQueueCounter);
    createOptimizerQueueTables(optimizerQueue, containerId, saveOptimizerQueue)
}

function updateOptimizerQueueCount(optimizerQueue, updateOptimizerQueueCounter) {
    let count = 0;
    if (optimizerQueue.length) {
        optimizerQueue.forEach(function (optimizerRun) {
            count += Object.keys(optimizerRun.runs).length;
        });
    }
    updateOptimizerQueueCounter(count);
}

function createOptimizerQueueTables(optimizerQueue, containerId, saveOptimizerQueue) {
    const mainContainer = document.getElementById(containerId);
    const noRunMessage = document.getElementById("optimizer-queue-no-message");
    mainContainer.innerHTML = "";
    if (optimizerQueue.length) {
        noRunMessage.classList.add(hidden_class);
        optimizerQueue.forEach(function (optimizerRun) {
            if (Object.values(optimizerRun.runs).length) {
                _createOptimizerRunQueueTable(optimizerRun, mainContainer, saveOptimizerQueue);
            }
        })
    } else {
        noRunMessage.classList.remove(hidden_class);
    }
}

function _createOptimizerRunQueueTable(optimizerRun, mainContainer, saveOptimizerQueue) {
    const optimizerId = optimizerRun.id;
    const divID = `optimizer-queue-${optimizerId}`;
    const queueParentDiv = document.createElement('div');
    const header = document.createElement('h4');
    const tableTitle = `Runs for optimizer ${optimizerId}`
    header.textContent = tableTitle;
    queueParentDiv.prepend(header);
    mainContainer.append(queueParentDiv);

    const queueDiv = document.createElement('div');
    queueDiv.id = divID;
    queueDiv.style.height = "500px";
    queueDiv.dataset.id = optimizerId
    queueDiv.dataset.data_files = optimizerRun.data_files;
    queueDiv.dataset.deletedRows = []
    queueDiv.dataset.deleteEveryRun = false
    queueParentDiv.append(queueDiv);

    const keys = [];
    const addedLabels = [];
    const tentaclesInputsCounts = {};
    Object.values(optimizerRun.runs).forEach((run) => {
        Object.values(run).forEach(function (inputDetail) {
            const label = inputDetail.user_input.length > MAX_SEARCH_LABEL_SIZE ? `${inputDetail.user_input.slice(0,
                MAX_SEARCH_LABEL_SIZE)} ...` : inputDetail.user_input;
            const addedLabel = `${label} (${inputDetail.tentacle})`
            if (addedLabels.indexOf(addedLabel) === -1) {
                keys.push({
                    text: addedLabel,
                    field: _userInputKey(inputDetail.user_input, inputDetail.tentacle)
                });
                if (typeof tentaclesInputsCounts[inputDetail.tentacle] !== "undefined") {
                    tentaclesInputsCounts[inputDetail.tentacle]++;
                } else {
                    tentaclesInputsCounts[inputDetail.tentacle] = 1;
                }
                addedLabels.push(addedLabel);
            }
        });
    })
    const columns = keys.map((key) => {
        return {
            field: key.field,
            text: key.text,
            size: `${1 / keys.length * 100}%`,
            sortable: true,
        }
    });
    const columnGroups = Object.keys(tentaclesInputsCounts).map(function (key) {
        return {
            text: key,
            span: tentaclesInputsCounts[key]
        }
    });
    const records = []
    let recId = 0;
    const userInputSamples = {};
    Object.values(optimizerRun.runs).map((run) => {
        const row = {
            recid: recId++
        };
        run.forEach(function (runUserInputDetails) {
            const field = _userInputKey(runUserInputDetails.user_input, runUserInputDetails.tentacle)
            row[field] = runUserInputDetails.value;
            userInputSamples[field] = runUserInputDetails.value;
        })
        records.push(row);
    });
    const searches = keys.map((key) => {
        const sampleValue = userInputSamples[key.field];
        return {
            field: key.field,
            label: key.text,
            type: TIMESTAMP_DATA.indexOf(key) !== -1 ? "datetime" : _getTableDataType(null,
                { type: null, field: key }, "text", sampleValue),
        }
    });
    function _onReorderRow(event) {
        event.onComplete = _afterTableUpdate
    }
    function _onDelete(event) {
        event.force = true;
        const table = window.w2ui[event.target];
        if (table.getSelection().length === table.records.length) {
            queueDiv.dataset.deleteEveryRun = true;
            // force select none to avoid local deletion which can take a very long time (table will be updated anyway)
            table.selectNone();
            // call _afterTableUpdate as it will be skipped as nothing is selected now.
            _afterTableUpdate(event);
        } else {
            queueDiv.dataset.deleteEveryRun = false;
            queueDiv.dataset.deletedRows = table.getSelection().map((recId) => table.get(recId));
            event.onComplete = _afterTableUpdate;
        }
    }
    const tableName = `${divID}-table`;
    const table = createTable(divID, tableTitle,
        tableName, searches, columns, records, columnGroups, [], [],
        true, false, true, true, _onReorderRow, _onDelete);
    _addOptimizerQueueTableButtons(table, _updateOptimizerQueue)

    function _createRunData(record, deleted) {
        const run = [];
        Object.keys(record).forEach((key) => {
            if (key !== "recid") {
                const splitKey = key.split(TENTACLE_SEPARATOR);
                const inputName = splitKey[0];
                run.push({
                    user_input: inputName,
                    tentacle: splitKey[1].split(","),
                    value: record[key],
                    deleted: deleted,
                });
            }
        });
        return run;
    }
    function _updateOptimizerQueue(queueInfo, records) {
        let runs = [];
        let deleteEveryRun = queueInfo.deleteEveryRun;
        if (!deleteEveryRun) {
            runs = records.map((record) => _createRunData(record, false));
            runs = runs.concat(queueInfo.deletedRows.map((record) => _createRunData(record, true)));
        }
        queueInfo.deletedRows = [];
        const updatedQueue = {
            queue: {
                id: parseInt(queueInfo.id),
                delete_every_run: Boolean(deleteEveryRun),
                runs: runs,
            }
        }
        if (queueInfo.data_files !== "undefined") {
            updatedQueue.queue.data_files = queueInfo.data_files
        }
        saveOptimizerQueue(updatedQueue);
    }
    function _afterTableUpdate(event) {
        const table = window.w2ui[event.target];
        const tableDiv = document.getElementById(table.box.id)
        const queueInfo = tableDiv.dataset
        _updateOptimizerQueue(queueInfo, table.records)
    }
}

function _addOptimizerQueueTableButtons(table, _updateOptimizerQueue) {
    function randomizeRecords() {
        randomizeArray(table.records);
        table.refresh();
        const tableDiv = document.getElementById(table.box.id)
        const queueInfo = tableDiv.dataset
        _updateOptimizerQueue(queueInfo, table.records)
    }
    console.log("tbl", table)
    table.toolbar.add({ type: 'button', id: 'show-run-info', text: 'Randomize', img: 'fas fa-random', onClick: randomizeRecords });
}

function _userInputKey(userInput, tentacle) {
    return `${userInput}${TENTACLE_SEPARATOR}${tentacle}`;
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

function randomizeArray(array) {
    array.sort(() => Math.random() - 0.5);
}
