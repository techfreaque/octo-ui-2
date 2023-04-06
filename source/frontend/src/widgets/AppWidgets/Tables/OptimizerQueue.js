
import { Button } from "@mui/material";
import { useEffect } from "react";
import { createTable } from "../../../components/Tables/w2ui/W2UI";
import { userInputKey } from "../../../components/UserInputs/utils";
import { hidden_class, ID_DATA, MAX_SEARCH_LABEL_SIZE, TENTACLE_SEPARATOR, TIMESTAMP_DATA } from "../../../constants/backendConstants";
import { useFetchOptimizerQueue, useOptimizerQueueContext, useSaveOptimizerQueue, useUpdateOptimizerQueueCounterContext } from "../../../context/data/OptimizerQueueProvider";


export default function OptimizerQueueTable() {
    const fetchOptimizerQueue = useFetchOptimizerQueue()
    const optimizerQueue = useOptimizerQueueContext()
    const updateOptimizerQueueCounter = useUpdateOptimizerQueueCounterContext()
    const saveOptimizerQueue = useSaveOptimizerQueue()
    const containerId = "optimizer-queue-table"
    useEffect(() => {
        fetchOptimizerQueue()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        optimizerQueue
            && updateOptimizerQueueEditor(
                optimizerQueue, saveOptimizerQueue, containerId)
        updateOptimizerQueueCount(optimizerQueue, updateOptimizerQueueCounter);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optimizerQueue]);

    return (<>
        <div className="text-center mx-4 my-4">
            <Button onClick={fetchOptimizerQueue}>Reload optimizer queue</Button>
        </div>
        <div id={"optimizer-queue-container"} style={{ height: "100%" }}>
            <div id={"optimizer-queue-no-message"} className="text-center mx-4 my-4">
                <h4>
                    The optimizer queue is empty
                </h4>
            </div>
            <div id={containerId} style={{ height: "100%" }} />
        </div>
    </>
    )
}

function updateOptimizerQueueEditor(optimizerQueue, saveOptimizerQueue, containerId) {
    createOptimizerQueueTables(optimizerQueue, containerId, saveOptimizerQueue)
}

function updateOptimizerQueueCount(optimizerQueue, updateOptimizerQueueCounter) {
    let count = 0;
    if (optimizerQueue?.length) {
        optimizerQueue.forEach(optimizerRun => {
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
    const queueInfo = { id: optimizerId, deletedRows: [], deleteEveryRun: false }
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
                    field: userInputKey(inputDetail.user_input, inputDetail.tentacle)
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
    Object.values(optimizerRun.runs).forEach((run) => {
        const row = {
            recid: recId++
        };
        run.forEach(function (runUserInputDetails) {
            const field = userInputKey(runUserInputDetails.user_input, runUserInputDetails.tentacle)
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
        event.onComplete = _updateOptimizerQueue
    }
    function _onDelete(event) {
        event.force = true;
        const table = window.w2ui[event.target];
        const recsToDelete = table.getSelection()
        if (recsToDelete.length === table.records.length) {
            table.selectNone();
            queueInfo.deleteEveryRun = true;
            _updateOptimizerQueue(event);
            table.destroy();
        } else {
            const rawsToDelete = recsToDelete.map((recId) => table.get(recId))
            queueInfo.deletedRows = rawsToDelete;
            event.onComplete = _updateOptimizerQueue;
        }
    }
    const tableName = `${divID}-table`;
    const table = createTable({elementID:divID, name:tableTitle,
        tableName, searches, columns, records, columnGroups, searchData:[], sortData:[],
        selectable:true, addToTable:false, reorderRows:true, deleteRows:true, onReorderRowCallback:_onReorderRow, onDeleteCallback:_onDelete});

    function randomizeRecords() {
        randomizeArray(table.records);
        table.refresh();
        _updateOptimizerQueue()
    }
    _addOptimizerQueueTableButtons(table, randomizeRecords)

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
                    deleted,
                });
            }
        });
        return run;
    }
    function _updateOptimizerQueue(event) {
        let UpdatedRuns = [];
        if (!queueInfo.deleteEveryRun) {
            UpdatedRuns = table.records.map((record) => _createRunData(record, false));
            UpdatedRuns = UpdatedRuns.concat(queueInfo.deletedRows.map((record) => _createRunData(record, true)));
        }
        const updatedQueue = {
            updatedQueue: {
                id: parseInt(queueInfo.id),
                delete_every_run: Boolean(queueInfo.deleteEveryRun),
                runs: UpdatedRuns,
            }
        }
        saveOptimizerQueue(updatedQueue);
        queueInfo.deletedRows = [];
        queueInfo.deleteEveryRun = false
    }

    function _addOptimizerQueueTableButtons() {
        table.toolbar.add({ type: 'button', id: 'show-run-info', text: 'Randomize', img: 'fas fa-random', onClick: randomizeRecords });
    }
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
