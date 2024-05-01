import { Button } from "@mui/material";
import { useEffect } from "react";
import { createTable } from "../../../components/Tables/w2ui/W2UI";
import { userInputKey } from "../../../components/UserInputs/utils";
import {
  hidden_class,
  ID_DATA,
  MAX_SEARCH_LABEL_SIZE,
  TENTACLE_SEPARATOR,
  TIMESTAMP_DATA,
} from "../../../constants/backendConstants";
import {
  useFetchOptimizerQueue,
  useOptimizerQueueContext,
  useSaveOptimizerQueue,
  useUpdateOptimizerQueueCounterContext,
} from "../../../context/data/OptimizerQueueProvider";
import { OptimizerNotInstalled } from "../Configuration/OptimizerConfigForm/OptimizerConfigForm";
import {
  useBotInfoContext,
  useIsDemoMode,
} from "../../../context/data/BotInfoProvider";

export default function OptimizerQueueTable() {
  const fetchOptimizerQueue = useFetchOptimizerQueue();
  const optimizerQueue = useOptimizerQueueContext();
  const updateOptimizerQueueCounter = useUpdateOptimizerQueueCounterContext();
  const saveOptimizerQueue = useSaveOptimizerQueue();
  const containerId: QueueContainerId = "optimizer-queue-table";
  const botInfo = useBotInfoContext();
  const uiProInstalled = botInfo?.ui_pro_installed;
  const isDemo = useIsDemoMode();
  useEffect(() => {
    if (uiProInstalled && !isDemo) {
      fetchOptimizerQueue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiProInstalled]);
  useEffect(() => {
    if (optimizerQueue) {
      updateOptimizerQueueEditor(
        optimizerQueue,
        saveOptimizerQueue,
        containerId
      );
      updateOptimizerQueueCount(optimizerQueue, updateOptimizerQueueCounter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optimizerQueue]);

  return (
    <>
      <OptimizerNotInstalled />
      <div className="text-center mx-4 my-4">
        <Button onClick={fetchOptimizerQueue}>Reload optimizer queue</Button>
      </div>
      <div id={"optimizer-queue-container"} style={{ height: "100%" }}>
        <div
          id={"optimizer-queue-no-message"}
          className="text-center mx-4 my-4"
        >
          <h4>The optimizer queue is empty</h4>
        </div>
        <div id={containerId} style={{ height: "100%" }} />
      </div>
    </>
  );
}

type QueueContainerId = "optimizer-queue-table";
function updateOptimizerQueueEditor(
  optimizerQueue,
  saveOptimizerQueue,
  containerId: QueueContainerId
) {
  createOptimizerQueueTables(optimizerQueue, containerId, saveOptimizerQueue);
}

function updateOptimizerQueueCount(
  optimizerQueue,
  updateOptimizerQueueCounter
) {
  let count = 0;
  if (optimizerQueue?.length) {
    optimizerQueue.forEach((optimizerRun) => {
      count += Object.keys(optimizerRun.runs).length;
    });
  }
  updateOptimizerQueueCounter(count);
}

function createOptimizerQueueTables(
  optimizerQueue: OptimizerRunQueueType[],
  containerId: QueueContainerId,
  saveOptimizerQueue
) {
  const mainContainer = document.getElementById(containerId);
  const noRunMessage = document.getElementById("optimizer-queue-no-message");
  if (mainContainer && noRunMessage) {
    mainContainer.innerHTML = "";
    if (optimizerQueue.length) {
      noRunMessage.classList.add(hidden_class);
      optimizerQueue.forEach((optimizerRun) => {
        if (optimizerRun.runs) {
          _createOptimizerRunQueueTable(
            optimizerRun,
            mainContainer,
            saveOptimizerQueue
          );
        }
      });
    } else {
      noRunMessage.classList.remove(hidden_class);
    }
  }
}

interface OptimizerRunQueueType {
  id;
  runs: {
    [key: string]: {
      user_input: {}[];
      tentacle;
      value;
    }[];
  };
}

interface QueueInfoType {
  id: any;
  deletedRows: {}[];
  deleteEveryRun: boolean;
}

function _createOptimizerRunQueueTable(
  optimizerRun: OptimizerRunQueueType,
  mainContainer: HTMLElement,
  saveOptimizerQueue
) {
  const optimizerId = optimizerRun.id;
  const divID = `optimizer-queue-${optimizerId}`;
  const queueParentDiv = document.createElement("div");
  const header = document.createElement("h4");
  const tableTitle = `Runs for optimizer ${optimizerId}`;
  header.textContent = tableTitle;
  queueParentDiv.prepend(header);
  mainContainer.append(queueParentDiv);

  const queueDiv = document.createElement("div");
  queueDiv.id = divID;
  queueDiv.style.height = "500px";
  const queueInfo: QueueInfoType = {
    id: optimizerId,
    deletedRows: [],
    deleteEveryRun: false,
  };
  queueParentDiv.append(queueDiv);

  const keys: { text; field }[] = [];
  const addedLabels: string[] = [];
  const tentaclesInputsCounts = {};
  Object.values(optimizerRun.runs).forEach((run) => {
    Object.values(run).forEach((inputDetail) => {
      const label =
        inputDetail.user_input.length > MAX_SEARCH_LABEL_SIZE
          ? `${inputDetail.user_input.slice(0, MAX_SEARCH_LABEL_SIZE)} ...`
          : inputDetail.user_input;
      const addedLabel = `${label} (${inputDetail.tentacle})`;
      if (addedLabels.includes(addedLabel)) {
        return;
      }
      keys.push({
        text: addedLabel,
        field: userInputKey(inputDetail.user_input, inputDetail.tentacle),
      });
      if (typeof tentaclesInputsCounts[inputDetail.tentacle] === "undefined") {
        tentaclesInputsCounts[inputDetail.tentacle] = 1;
      } else {
        tentaclesInputsCounts[inputDetail.tentacle]++;
      }
      addedLabels.push(addedLabel);
    });
  });
  const columns = keys.map((key) => {
    return {
      field: key.field,
      text: key.text,
      size: `${(1 / keys.length) * 100}%`,
      sortable: true,
    };
  });
  const columnGroups = Object.keys(tentaclesInputsCounts).map((key) => ({
    text: key,
    span: tentaclesInputsCounts[key],
  }));
  const records: RecordType[] = [];
  let recId = 0;
  const userInputSamples = {};
  Object.values(optimizerRun.runs).forEach((run) => {
    const row: RecordType = {
      recid: recId++,
    };
    run.forEach((runUserInputDetails) => {
      const field = userInputKey(
        runUserInputDetails.user_input,
        runUserInputDetails.tentacle
      );
      row[field] = runUserInputDetails.value;
      userInputSamples[field] = runUserInputDetails.value;
    });
    records.push(row);
  });
  const searches = keys.map((key) => {
    const sampleValue = userInputSamples[key.field];
    return {
      field: key.field,
      label: key.text,
      type: TIMESTAMP_DATA.includes(key.field)
        ? "datetime"
        : _getTableDataType(
            null,
            {
              type: null,
              field: key,
            },
            "text",
            sampleValue
          ),
    };
  });
  function _onReorderRow(event) {
    event.onComplete = _updateOptimizerQueue;
  }
  function _onDelete(event) {
    event.force = true;
    const table = window.w2ui[event.target];
    const recsToDelete = table.getSelection();
    if (recsToDelete.length === table.records.length) {
      table.selectNone();
      queueInfo.deleteEveryRun = true;
      _updateOptimizerQueue();
      table.destroy();
      return;
    }
    const rawsToDelete = recsToDelete.map((recId) => table.get(recId));
    queueInfo.deletedRows = rawsToDelete;
    event.onComplete = _updateOptimizerQueue;
  }
  const tableName = `${divID}-table`;
  const table = createTable({
    elementID: divID,
    name: tableTitle,
    tableName,
    searches,
    columns,
    records,
    columnGroups,
    searchData: [],
    sortData: [],
    selectable: true,
    addToTable: false,
    reorderRows: true,
    deleteRows: true,
    onReorderRowCallback: _onReorderRow,
    onDeleteCallback: _onDelete,
  });

  function randomizeRecords() {
    randomizeArray(table.records);
    table.refresh();
    _updateOptimizerQueue();
  }
  _addOptimizerQueueTableButtons();

  function _createRunData(record, deleted: boolean) {
    const run: RunInputType[] = [];
    Object.keys(record).forEach((key) => {
      if (key === "recid") {
        return;
      }
      const splitKey = key.split(TENTACLE_SEPARATOR);
      const inputName = splitKey[0];
      run.push({
        user_input: inputName,
        tentacle: splitKey[1].split(","),
        value: record[key],
        deleted,
      });
    });
    return run;
  }
  function _updateOptimizerQueue() {
    let UpdatedRuns: RunInputType[][] = [];
    if (!queueInfo.deleteEveryRun) {
      UpdatedRuns = table.records.map((record) =>
        _createRunData(record, false)
      );
      UpdatedRuns.concat(
        queueInfo.deletedRows.map((record) => _createRunData(record, true))
      );
    }
    const updatedQueue = {
      updatedQueue: {
        id: parseInt(queueInfo.id),
        delete_every_run: Boolean(queueInfo.deleteEveryRun),
        runs: UpdatedRuns,
      },
    };
    saveOptimizerQueue(updatedQueue);
    queueInfo.deletedRows = [];
    queueInfo.deleteEveryRun = false;
  }

  function _addOptimizerQueueTableButtons() {
    table.toolbar.add({
      type: "button",
      id: "show-run-info",
      text: "Randomize",
      img: "fas fa-random",
      onClick: randomizeRecords,
    });
  }
}

type RecordType = {
  recid: number;
  [field: string]: number | string | boolean;
};

interface RunInputType {
  user_input;
  tentacle;
  value: string | number | boolean;
  deleted: boolean;
}

function _getTableDataType(records, search, defaultValue, sampleValue) {
  if (ID_DATA.includes(search.field)) {
    return "float";
  }
  if (search.type !== null) {
    return search.type;
  }
  const _sampleValue =
    sampleValue === null ? records[0][search.field] : sampleValue;
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

function randomizeArray(array: any[]) {
  array.sort(() => Math.random() - 0.5);
}
