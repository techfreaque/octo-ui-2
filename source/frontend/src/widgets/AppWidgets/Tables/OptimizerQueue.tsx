import { DeleteFilled } from "@ant-design/icons";
import { faShuffle } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";
import { Tooltip } from "antd";
import Title from "antd/es/typography/Title";
import { t } from "i18next";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Trans } from "react-i18next";

import AntButton, {
  buttonTypes,
  buttonVariants,
} from "../../../components/Buttons/AntButton";
import AntTable, {
  AntTableColumnType,
  AntTableDataType,
} from "../../../components/Tables/AntTable";
import {
  findUserInputAndTentacleLabel,
  splitUserInputKey,
  userInputKey,
} from "../../../components/UserInputs/utils";
import {
  tentacleConfigTypes,
  TentaclesConfigsRootType,
  useTentaclesConfigContext,
} from "../../../context/config/TentaclesConfigProvider";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";
import {
  OptimizerQueueElementType,
  OptimizerQueueType,
  OptimizerQueueUpdateType,
  RunInputType,
  UpdatedRunType,
  useFetchOptimizerQueue,
  useOptimizerQueueContext,
  useSaveOptimizerQueue,
} from "../../../context/data/OptimizerQueueProvider";
import { OptimizerNotInstalled } from "../Configuration/OptimizerConfigForm/OptimizerConfigForm";

export default function OptimizerQueueTable() {
  const fetchOptimizerQueue = useFetchOptimizerQueue();
  const optimizerQueue = useOptimizerQueueContext();
  const saveOptimizerQueue = useSaveOptimizerQueue();
  const botInfo = useBotInfoContext();
  const currentTentaclesConfig = useTentaclesConfigContext();
  const currentTentaclesTradingConfig =
    currentTentaclesConfig?.[tentacleConfigTypes.tradingTentacles];
  const uiProInstalled = botInfo?.ui_pro_installed;
  useEffect(() => {
    if (uiProInstalled) {
      fetchOptimizerQueue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiProInstalled]);

  return (
    <>
      <OptimizerNotInstalled />
      <div style={{ margin: "1.5rem", textAlign: "center" }}>
        <Button onClick={fetchOptimizerQueue}>
          <Trans i18nKey="optimizer.reload-optimizer-queue"></Trans>
        </Button>
      </div>
      <div id={"optimizer-queue-container"} style={{ height: "100%" }}>
        <OptimizerQueueTables
          currentTentaclesTradingConfig={currentTentaclesTradingConfig}
          optimizerQueue={optimizerQueue}
          saveOptimizerQueue={saveOptimizerQueue}
        />
      </div>
    </>
  );
}

function OptimizerQueueTables({
  optimizerQueue,
  saveOptimizerQueue,
  currentTentaclesTradingConfig,
}: {
  optimizerQueue: OptimizerQueueType | undefined;
  saveOptimizerQueue: (
    updatedQueue: OptimizerQueueUpdateType,
    setIsUpdating: Dispatch<SetStateAction<boolean>>
  ) => void;
  currentTentaclesTradingConfig: TentaclesConfigsRootType | undefined;
}): JSX.Element {
  if (optimizerQueue?.length) {
    return (
      <>
        {optimizerQueue.map((optimizerRun) => {
          if (optimizerRun.runs) {
            return (
              <OptimizerRunQueueTable
                key={optimizerRun.id}
                optimizerRun={optimizerRun}
                currentTentaclesTradingConfig={currentTentaclesTradingConfig}
                saveOptimizerQueue={saveOptimizerQueue}
              />
            );
          }
          return <></>;
        })}
      </>
    );
  }
  return (
    <div
      id={"optimizer-queue-no-message"}
      style={{ margin: "1.5rem", textAlign: "center" }}
    >
      <h4>
        <Trans i18nKey="optimizer.the-optimizer-queue-is-empty"></Trans>
      </h4>
    </div>
  );
}

function OptimizerRunQueueTable({
  optimizerRun,
  saveOptimizerQueue,
  currentTentaclesTradingConfig,
}: {
  optimizerRun: OptimizerQueueElementType;
  saveOptimizerQueue: (
    updatedQueue: OptimizerQueueUpdateType,
    setIsUpdating: Dispatch<SetStateAction<boolean>>
  ) => void;
  currentTentaclesTradingConfig: TentaclesConfigsRootType | undefined;
}): JSX.Element {
  const optimizerId = optimizerRun.id;

  const { data, columns } = generateTableData(
    optimizerRun,
    currentTentaclesTradingConfig
  );
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const somethingSelected = !!selectedRecordIds?.length;

  function updateOptimizerQueue({
    updatedRunData,
    deletedRunIds,
    deleteEveryRun,
  }: {
    updatedRunData?: RunDataTableElementType[];
    deletedRunIds?: string[] | undefined;
    deleteEveryRun?: boolean | undefined;
  }) {
    let UpdatedRuns: UpdatedRunType[] = [];
    if (!deleteEveryRun && deletedRunIds) {
      UpdatedRuns = data.map((record) =>
        createUpdatedRunDataFromTableRow(
          record,
          deletedRunIds.includes(record.id)
        )
      );
    } else if (updatedRunData) {
      UpdatedRuns = updatedRunData.map((record) =>
        createUpdatedRunDataFromTableRow(record, false)
      );
    }
    const updatedQueue: OptimizerQueueUpdateType = {
      updatedQueue: {
        id: optimizerId,
        delete_every_run: !!deleteEveryRun,
        runs: UpdatedRuns,
      },
    };
    saveOptimizerQueue(updatedQueue, setIsUpdating);
  }

  function onReorderRow(reorderedData: RunDataTableElementType[]) {
    updateOptimizerQueue({ updatedRunData: reorderedData });
  }

  function onDelete(deleteEveryRun = false) {
    updateOptimizerQueue({
      deletedRunIds: selectedRecordIds,
      deleteEveryRun:
        deleteEveryRun || selectedRecordIds?.length === data.length,
    });
    setSelectedRecordIds(undefined);
  }

  function randomizeRecords() {
    const randomizedData = randomizeArray(data);
    updateOptimizerQueue({ updatedRunData: randomizedData });
  }
  return (
    <>
      <Title style={{ marginTop: "30px" }} level={3}>
        {t("optimizer.runs-for-optimizer-optimizerid", {
          optimizerId,
        })}
      </Title>
      <AntTable<RunDataTableElementType, RunDataTableColumnType>
        data={data}
        columns={columns}
        maxWidth="100%"
        size="small"
        paginationSize={100}
        setSelectedRowKeys={setSelectedRecordIds}
        selectedRowKeys={selectedRecordIds}
        onChange={onReorderRow}
        header={
          <>
            <Tooltip
              title={t("optimizer.deletes-the-selected-runs-from-the-queue")}
            >
              <div>
                <AntButton
                  antIconComponent={DeleteFilled}
                  colorType={
                    isUpdating ? buttonTypes.font : buttonTypes.fontActive
                  }
                  disabled={!somethingSelected || isUpdating}
                  buttonVariant={buttonVariants.text}
                  onClick={somethingSelected ? () => onDelete() : undefined}
                >
                  <Trans i18nKey="optimizer.queue-delete-selected"></Trans>
                </AntButton>
              </div>
            </Tooltip>
            <Tooltip
              title={
                <Trans i18nKey="optimizer.queue-this-will-delete-all-runs-in-this-optimizer-id"></Trans>
              }
            >
              <div>
                <AntButton
                  antIconComponent={DeleteFilled}
                  colorType={
                    isUpdating ? buttonTypes.font : buttonTypes.fontActive
                  }
                  disabled={isUpdating}
                  buttonVariant={buttonVariants.text}
                  onClick={() => onDelete(true)}
                >
                  <Trans i18nKey="optimizer.queue-delete-all"></Trans>
                </AntButton>
              </div>
            </Tooltip>
            <Tooltip
              title={
                <Trans i18nKey="optimizer.queue-this-will-randomize-all-records-in-this-optimizer-id"></Trans>
              }
            >
              <div>
                <AntButton
                  faIconComponent={faShuffle}
                  colorType={
                    isUpdating ? buttonTypes.font : buttonTypes.fontActive
                  }
                  disabled={isUpdating}
                  buttonVariant={buttonVariants.text}
                  onClick={randomizeRecords}
                >
                  <Trans i18nKey="optimizer.queue-randomize"></Trans>
                </AntButton>
              </div>
            </Tooltip>
          </>
        }
      />
    </>
  );
}

type RunDataTableElementType = AntTableDataType & {
  [inputKey: string]: number | boolean | string;
};

type RunDataTableColumnType = AntTableColumnType<RunDataTableElementType>;

function generateTableData(
  optimizerRun: OptimizerQueueElementType,
  currentTentaclesTradingConfig: TentaclesConfigsRootType | undefined
): {
  data: RunDataTableElementType[];
  columns: RunDataTableColumnType[];
} {
  const columnsObj: {
    [tentacleKey: string]: {
      title: string;
      children: {
        [inputKey: string]: RunDataTableColumnType;
      };
    };
  } = {};

  function addColumn(inputDetail: RunInputType) {
    const tentacleNameStr = `${inputDetail.tentacle}`;
    const key = userInputKey(inputDetail.user_input, inputDetail.tentacle);
    if (columnsObj[tentacleNameStr]?.children[key]) {
      return;
    }
    const { userInputLabel, tentacleLabel } = findUserInputAndTentacleLabel(
      currentTentaclesTradingConfig,
      inputDetail.user_input,
      inputDetail.tentacle
    );
    const columnGroup = columnsObj[tentacleNameStr] || {
      title: tentacleLabel,
      children: {},
    };
    columnGroup.children[key] = {
      key,
      dataIndex: key,
      title: userInputLabel,
      disableSearch: true,
      dsorter: typeof inputDetail.value as "string" | "number" | "boolean",
    };
    columnsObj[tentacleNameStr] = columnGroup;
  }

  const records: RunDataTableElementType[] = Object.values(
    optimizerRun.runs
  ).map((run, index) => {
    const row: RunDataTableElementType = {
      id: `${index}`,
      key: `${index}`,
    };
    run.forEach((runUserInputDetails) => {
      const field = userInputKey(
        runUserInputDetails.user_input,
        runUserInputDetails.tentacle
      );
      row[field] = runUserInputDetails.value;
      addColumn(runUserInputDetails);
    });
    return row;
  });

  const columns: RunDataTableColumnType[] = Object.entries(columnsObj).map(
    ([tentacleKey, columnGroup]) => {
      return {
        key: tentacleKey,
        title: columnGroup.title,
        disableSearch: true,
        children: Object.values(columnGroup.children),
      };
    }
  );

  return {
    columns,
    data: records,
  };
}

function createUpdatedRunDataFromTableRow(
  record: RunDataTableElementType,
  deleted: boolean
) {
  const run: UpdatedRunType = [];
  Object.entries(record).forEach(([inputKey, value]) => {
    if (["id", "key"].includes(inputKey)) {
      return;
    }
    const { userInput, tetacles } = splitUserInputKey(inputKey);
    run.push({
      user_input: userInput,
      tentacle: tetacles,
      value,
      deleted,
    });
  });
  return run;
}

function randomizeArray(array: RunDataTableElementType[]) {
  return array.toSorted(() => Math.random() - 0.5);
}
