import { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
  TentaclesConfigByTentacleType,
  TentaclesConfigValueType,
  TentaclesConfigValuesType,
  TentaclesConfigsRootType,
  tentacleConfigTypes,
  useSaveTentaclesConfig,
  useTentaclesConfigContext,
} from "../../../../context/config/TentaclesConfigProvider";
import {
  BacktestingRunData,
  RunsToDeleteDataType,
  useDeleteBacktestingRunData,
} from "../../../../context/data/BacktestingRunDataProvider";
import {
  DisplayedRunIdsType,
  useDisplayedRunIdsContext,
  useHiddenBacktestingMetadataColumnsContext,
  useUpdateDisplayedRunIdsContext,
} from "../../../../context/data/BotPlottedElementsProvider";
import {
  ID_DATA,
  ID_SEPARATOR,
  METADATA_ADVANCED_HIDDEN_FIELDS,
  METADATA_HIDDEN_FIELDS,
  METADATA_UNDISPLAYED_FIELDS,
  TIMESTAMP_DATA,
} from "../../../../constants/backendConstants";
import AntTable, {
  AntTableColumnType,
  AntTableDataType,
} from "../../../../components/Tables/AntTable";
import { Radio, Tooltip } from "antd";
import AntButton, {
  buttonTypes,
  buttonVariants,
} from "../../../../components/Buttons/AntButton";
import {
  DeleteFilled,
  DownloadOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  findUserInputAndTentacleLabel,
  userInputKey,
} from "../../../../components/UserInputs/utils";
import { isObjectEmpty } from "../../../../helpers/helpers";

export default function AntRunDataTable({
  runData,
  currentCampaignName,
  reloadData,
}: {
  runData: BacktestingRunData[];
  currentCampaignName: string;
  reloadData: (onDone: () => void) => void;
}) {
  const setDisplayedRunIds = useUpdateDisplayedRunIdsContext();
  const displayedRunIds = useDisplayedRunIdsContext();
  const deleteRuns = useDeleteBacktestingRunData();
  const hiddenMetadataColumns = useHiddenBacktestingMetadataColumnsContext();
  const saveTentaclesConfig = useSaveTentaclesConfig();

  return useMemo(() => {
    function restoreSettings(settings: TentaclesConfigByTentacleType) {
      saveTentaclesConfig(settings, undefined, true, true);
    }
    return (
      <MetaDataTable
        metadata={runData}
        forceSelectLatest={false}
        currentCampaignName={currentCampaignName}
        reloadData={reloadData}
        deleteBacktestingRuns={deleteRuns}
        hiddenMetadataColumns={hiddenMetadataColumns}
        setDisplayedRunIds={setDisplayedRunIds}
        displayedRunIds={displayedRunIds}
        restoreSettings={restoreSettings}
      />
    );
  }, [
    currentCampaignName,
    deleteRuns,
    displayedRunIds,
    hiddenMetadataColumns,
    reloadData,
    runData,
    saveTentaclesConfig,
    setDisplayedRunIds,
  ]);
}

function MetaDataTable({
  metadata,
  forceSelectLatest,
  currentCampaignName,
  reloadData,
  deleteBacktestingRuns,
  hiddenMetadataColumns,
  setDisplayedRunIds,
  displayedRunIds,
  restoreSettings,
}: {
  metadata: BacktestingRunData[];
  forceSelectLatest: boolean;
  currentCampaignName: string;
  reloadData: (onDone: () => void) => void;
  deleteBacktestingRuns: (
    runsToDelete: RunsToDeleteDataType,
    isDeleting: Dispatch<SetStateAction<boolean>>
  ) => void;
  hiddenMetadataColumns: string[] | undefined;
  setDisplayedRunIds: Dispatch<SetStateAction<DisplayedRunIdsType>>;
  displayedRunIds: DisplayedRunIdsType;
  restoreSettings: (settings: TentaclesConfigByTentacleType) => void;
}) {
  const currentTentaclesConfig = useTentaclesConfigContext();
  const currentTentaclesTradingConfig =
    currentTentaclesConfig?.[tentacleConfigTypes.tradingTentacles];
  const sortedMetadata = (JSON.parse(
    JSON.stringify(metadata)
  ) as BacktestingRunData[]).toSorted((a, b) => b.timestamp - a.timestamp);
  const firstRow = sortedMetadata[0] as BacktestingRunData;

  const filteredFirstRow = Object.entries(firstRow).filter(
    ([key]) => !METADATA_UNDISPLAYED_FIELDS.includes(key)
  );
  const runDataColumnKeys: string[] = ["runInformation"];
  const runDataColumns: RunDataTableColumnType[] = filteredFirstRow.map(
    ([key, rowValue]) => {
      const _key = key === "id" ? "runId" : key;
      runDataColumnKeys.push(_key);
      return {
        key: _key,
        dataIndex: _key,
        title: key,
        width: 100,
        dsorter: ["string", "number", "boolean"].includes(typeof rowValue)
          ? (typeof rowValue as "string" | "number" | "boolean")
          : undefined,
        render: TIMESTAMP_DATA.includes(key)
          ? (value: any, record: any, index: number) => {
              return <>{new Date(value).toISOString()}</>;
            }
          : ID_DATA.includes(key)
          ? (value: any, record: any, index: number) => {
              return <>{Number(value)}</>;
            }
          : undefined,
      };
    }
  );
  ensureBacktestingMetadataColumnsOrder(runDataColumns);

  // Build user inputs columns. They are hidden by default
  const userInputColumns: UserInpuntColumnsType = {};
  const userInputKeys: string[] = [];

  sortedMetadata.forEach((run_metadata) => {
    if (run_metadata["user inputs"]) {
      Object.entries(run_metadata["user inputs"]).forEach(
        ([inputTentacle, inputConfigs]) => {
          //   const hasTentacle = !addedTentacles.includes(inputTentacle);
          getUserInputColumns({
            userInputColumns,
            inputTentacle,
            tentacleNames: [inputTentacle],
            inputTentacleLabel: inputTentacle,
            userInputKeys,
            inputsByConfig: inputConfigs,
            hiddenMetadataColumns,
            currentTentaclesTradingConfig,
          });
          //   if (!hasTentacle) {
          //     addedTentacles.push(inputTentacle);
          //   }
        }
      );
    }
  });
  //   Object.keys(inputPerTentacle).forEach((key) => {
  //     columnGroups.push({ text: key, span: inputPerTentacle[key] });
  //   });
  //   userInputColumns.sort((a, b) => {
  //     const aField = a.field.split(TENTACLE_SEPARATOR).reverse().join("");
  //     const bField = b.field.split(TENTACLE_SEPARATOR).reverse().join("");
  //     if (aField > bField) {
  //       return 1;
  //     } else if (aField < bField) {
  //       return -1;
  //     }
  //     return 0;
  //   });
  //   const userInputKeySize = `${
  //     (1 /
  //       (userInputColumns.length +
  //         runDataColumns.length -
  //         runDataHidableColumns.length)) *
  //     100
  //   }%`;
  //   userInputColumns.forEach((column) => {
  //     column.size = userInputKeySize;
  //   });
  //   const columns = runDataColumns.concat(userInputColumns);
  const columns: RunDataTableColumnType[] = [
    {
      title: "Run Information",
      key: "runInformation",
      disableSearch: true,
      children: runDataColumns,
    },
    ...userInpuntColumnToArray(userInputColumns),
  ];

  // init searches before formatting rows to access user_inputs objects
  //   const userInputSearches = userInputKeys.map((key) => {
  //     const splitKey = key.split(TENTACLE_SEPARATOR);
  //     let sampleValue = userInputSampleValueByKey[key];
  //     if (sampleValue === null) {
  //       console.error(
  //         `Impossible to guess type of ${key} user input (no sample value). Using text as search type`
  //       );
  //       sampleValue = "";
  //     }
  //     const label =
  //       splitKey[0].length > MAX_SEARCH_LABEL_SIZE
  //         ? `${splitKey[0].slice(0, MAX_SEARCH_LABEL_SIZE)} ...`
  //         : splitKey[0];
  //     return {
  //       field: key,
  //       label: `${label} (${splitKey[1]})`,
  //       type: TIMESTAMP_DATA.includes(key)
  //         ? "datetime"
  //         : _getTableDataType(
  //             null,
  //             {
  //               type: null,
  //               field: key,
  //             },
  //             "text",
  //             sampleValue
  //           ),
  //     };
  //   });
  //   const recordsToSelect = [];

  const records: RunDataTableDataType[] = sortedMetadata.map((row) => {
    _formatMetadataRow(row);
    const id = mergeRunIdentifiers(
      row.id,
      row["optimizer id"],
      row["optimization campaign"]
    );
    return {
      ...row,
      key: id,
      id,
      runId: row.id,
    };
  });

  const runDataSearches = filteredFirstRow.map(([key]) => {
    return {
      field: key,
      label: key,
      type: TIMESTAMP_DATA.includes(key)
        ? "datetime"
        : _getTableDataType(
            records,
            {
              type: null,
              field: key,
            },
            "text",
            null
          ),
    };
  });
  //   ensureBacktestingMetadataColumnsOrder(runDataSearches);
  //   const searches = runDataSearches.concat(userInputSearches);
  //   const searchData = [
  //     {
  //       field: "optimization campaign",
  //       value: currentCampaignName,
  //       operator: "is",
  //       type: "text",
  //     },
  //   ];
  //   const sortData = [
  //     {
  //       field: "timestamp",
  //       direction: "asc",
  //     },
  //   ];
  //   const table = createTable({
  //     elementID: `${tableId}-table`,
  //     name: tableTitle,
  //     tableName: tableId,
  //     searches,
  //     columns,
  //     records,
  //     columnGroups,
  //     searchData,
  //     sortData,
  //     selectable: true,
  //     addToTable: false,
  //     reorderRows: false,
  //     deleteRows: false,
  //     onReorderRowCallback: null,
  //     onDeleteCallback: null,
  //   });
  //   _addBacktestingMetadataTableButtons(
  //     table,
  //     runDataHidableColumns,
  //     userInputColumns,
  //     forceSelectLatest,
  //     currentCampaignName,
  //     reloadData,
  //     deleteBacktestingRuns,
  //     restoreSettings,
  //     records
  //   );
  //   table.on("select", (event) => handleSelection(tableId, event));
  //   table.on("unselect", (event) => handleSelection(tableId, event));
  //   if (records.length) {
  //     _filterOptimizationCampaign(table, currentCampaignName);
  //     table.toolbar.check("show-current-optimization-campaign");
  //     if (forceSelectLatest) {
  //       table.click(table.getFirst());
  //     }
  //     table.select(recordsToSelect);
  //   }

  const [visibleColumns, setVisibleColumns] = useState<
    "info" | "settings" | "allInfo"
  >("info");
  const [showCurrentCampaign, setShowCurrentCampaign] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const somethingSelected = !!displayedRunIds.backtesting?.length;
  function setSelectedRecordIds(selectedRecordIds: string[]) {
    setDisplayedRunIds((prev_selection) => {
      return {
        ...prev_selection,
        backtesting: selectedRecordIds,
      };
    });
  }

  function handleDeleteSelected() {
    setIsUpdating(true);
    deleteBacktestingRuns(
      displayedRunIds.backtesting.map((runId) => {
        const {
          backtestingId,
          optimizerId,
          campaignName,
        } = splitRunIdentifiers(runId);
        return {
          backtesting_id: backtestingId,
          optimizer_id: optimizerId,
          campaign_name: campaignName,
        };
      }),
      setIsUpdating
    );
  }

  return (
    <AntTable<RunDataTableDataType, RunDataTableColumnType>
      data={records}
      columns={columns}
      maxWidth="100%"
      size="small"
      bordered
      scrollWidth={"100%"}
      selectedRowKeys={displayedRunIds.backtesting}
      setSelectedRowKeys={setSelectedRecordIds}
      hiddenColumns={
        visibleColumns === "info"
          ? [...METADATA_HIDDEN_FIELDS, ...userInputKeys]
          : visibleColumns === "allInfo"
          ? [...METADATA_ADVANCED_HIDDEN_FIELDS, ...userInputKeys]
          : [
              ...METADATA_HIDDEN_FIELDS,
              ...runDataColumnKeys.filter(
                (key) =>
                  ![
                    "runId",
                    "optimizer id",
                    "optimization campaign",
                    "runInformation",
                  ].includes(key)
              ),
            ]
      }
      paginationSize={10_000}
      header={
        <>
          <Tooltip title={"Refreshes the run data table"}>
            <div>
              <AntButton
                antIconComponent={ReloadOutlined}
                colorType={
                  isUpdating ? buttonTypes.font : buttonTypes.fontActive
                }
                buttonVariant={buttonVariants.text}
                onClick={() => {
                  setIsUpdating(true);
                  reloadData(() => setIsUpdating(false));
                }}
                spin={isUpdating}
              />
            </div>
          </Tooltip>
          <Tooltip
            title={
              "Toggle displaying data only from the current campaign or from all activated ones"
            }
          >
            <div>
              <AntButton
                antIconComponent={UnorderedListOutlined}
                colorType={
                  showCurrentCampaign
                    ? buttonTypes.fontActive
                    : buttonTypes.font
                }
                buttonVariant={buttonVariants.text}
                onClick={() => {
                  setShowCurrentCampaign((prevSelection) => !!prevSelection);
                }}
              >
                <>Current optimization campaign: {currentCampaignName}</>
              </AntButton>
            </div>
          </Tooltip>
          <Radio.Group
            defaultValue="info"
            style={{ display: "flex" }}
            onChange={(event) => setVisibleColumns(event.target.value)}
          >
            <Tooltip title="Display Run Information">
              <Radio.Button value="info">Info</Radio.Button>
            </Tooltip>
            <Tooltip title="Display All Run Information">
              <Radio.Button value="allInfo">All Info</Radio.Button>
            </Tooltip>
            <Tooltip title="Display Run Settings">
              <Radio.Button value="settings">Settings</Radio.Button>
            </Tooltip>
          </Radio.Group>
          <div style={{ margin: "auto" }} />
          <Tooltip title={"Restores all settings from this run"}>
            <div>
              <AntButton
                antIconComponent={DownloadOutlined}
                colorType={
                  isUpdating ? buttonTypes.font : buttonTypes.fontActive
                }
                disabled={!somethingSelected || isUpdating}
                buttonVariant={buttonVariants.text}
                onClick={somethingSelected ? () => onDelete() : undefined}
              >
                Restore Settings
              </AntButton>
            </div>
          </Tooltip>
          <Tooltip title={"Deletes the selected runs"}>
            <div>
              <AntButton
                antIconComponent={DeleteFilled}
                colorType={
                  isUpdating ? buttonTypes.font : buttonTypes.fontActive
                }
                disabled={!somethingSelected || isUpdating}
                buttonVariant={buttonVariants.text}
                onClick={
                  somethingSelected ? () => handleDeleteSelected() : undefined
                }
              >
                Delete selected
              </AntButton>
            </div>
          </Tooltip>
          <Tooltip title={"This will delete all visible"}>
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
                Delete visible
              </AntButton>
            </div>
          </Tooltip>
        </>
      }
    />
  );
}

export interface RunDataTableDataType extends AntTableDataType {}
export interface RunDataTableColumnType
  extends AntTableColumnType<RunDataTableDataType> {}

function _addBacktestingMetadataTableButtons(
  table,
  runDataHidableColumns,
  userInputColumns,
  forceSelectLatest,
  currentOptimizerCampaignName,
  reloadData,
  deleteBacktestingRuns,
  restoreSettings,
  records
) {
  // tabs
  function showRunInfo() {
    table.showColumn(...runDataHidableColumns.map((column) => column.field));
    table.hideColumn(...userInputColumns.map((column) => column.field));
    table.toolbar.disable("show-run-info");
    table.toolbar.enable("show-user-inputs");
  }
  function showUserInputInfo() {
    table.hideColumn(...runDataHidableColumns.map((column) => column.field));
    table.showColumn(...userInputColumns.map((column) => column.field));
    table.toolbar.disable("show-user-inputs");
    table.toolbar.enable("show-run-info");
  }
  function showCurrentOptimizationCampaignOnly(currentOptimizerCampaignName) {
    const buttonId = "show-current-optimization-campaign";
    const button = table.toolbar.get(buttonId);
    if (button.checked) {
      table.searchReset();
      table.toolbar.uncheck(buttonId);
    } else {
      _filterOptimizationCampaign(table, currentOptimizerCampaignName);
      table.toolbar.check(buttonId);
    }
  }

  function _deleteRuns(selectedIds) {
    const toDeleteRuns = selectedIds.map((recId) => table.get(recId));
    w2confirm(`Delete these ${toDeleteRuns.length} runs ?`).yes(() => {
      deleteBacktestingRuns(
        toDeleteRuns.map((run) => {
          return {
            backtesting_id: getIdFromTableRow(run),
            optimizer_id: getOptimizerIdFromTableRow(run),
            campaign_name: getCampaignNameFromTableRow(run),
          };
        })
      );
    });
  }
  function deleteSelectedRuns(event) {
    event.force = true;
    event.onComplete = () => {
      const selectedIds = table.getSelection();
      if (selectedIds?.length === 0) {
        return createNotification({
          title: "Select a run to delete first",
          type: "danger",
        });
      }
      _deleteRuns(selectedIds);
    };
  }
  function deleteShownRuns(event) {
    event.force = true;
    event.onComplete = () => _deleteRuns(table.last.searchIds);
  }
  table.toolbar.add({
    type: "button",
    id: "show-run-info",
    text: "Run info",
    icon: "fa fa-bolt",
    disabled: true,
    onClick: showRunInfo,
  });
  table.toolbar.add({
    type: "button",
    id: "show-user-inputs",
    text: "User inputs",
    icon: "fa fa-user-cog",
    onClick: showUserInputInfo,
  });
  table.toolbar.add({
    type: "button",
    id: "show-current-optimization-campaign",
    text: `Current optimization campaign: ${currentOptimizerCampaignName}`,
    icon: "fas fa-list",
    onClick: () =>
      showCurrentOptimizationCampaignOnly(currentOptimizerCampaignName),
  });
  table.toolbar.add({ type: "spacer" });

  // function _restoreSettings() {
  //     const selectedRuns = table.getSelection()
  //     if (selectedRuns && selectedRuns.length === 1) {
  //         function removeSpacesOnlyFromKeys(inputs) {
  //             inputs && Object.keys(inputs).forEach((inputKey) => {
  //                 const newInputKey = inputKey?.replace(/ /g, "_")
  //                 if (newInputKey && newInputKey !== inputKey) {
  //                     inputs[newInputKey] = inputs[inputKey]
  //                     delete inputs[inputKey]
  //                 }
  //                 if (typeof inputs[newInputKey] === 'object')
  //                     removeSpacesOnlyFromKeys(inputs[newInputKey]);

  //             })
  //             return inputs
  //         }
  //         const run = selectedRuns[0];
  //         const userInputs = removeSpacesOnlyFromKeys(JSON.parse(records[run]["user inputs"]))
  //         restoreSettings(userInputs)
  //         return;
  //     }
  //     createNotification({title: "Error restoring user iputs", "danger", "You must select one run");
  // }
  // TODO fix restoring objects
  // table.toolbar.add({
  //     type: 'button',
  //     id: 'restore-run',
  //     text: 'Restore settings',
  //     icon: 'fa fa-download',
  //     onClick: _restoreSettings
  // })
  table.toolbar.add({
    type: "button",
    id: "refresh-backtesting-runs",
    text: "Refresh",
    icon: "w2ui-icon-reload",
    onClick: reloadData,
  });
  table.toolbar.add({
    type: "button",
    id: "delete_selected_runs",
    text: "Delete",
    icon: "fa fa-trash",
    onClick: deleteSelectedRuns,
  });
  table.toolbar.add({
    type: "button",
    id: "delete_visible_runs",
    text: "Delete visible",
    icon: "fa fa-trash",
    onClick: deleteShownRuns,
  });
}

export function mergeRunIdentifiers(
  backtestingId: number,
  optimizerId: number,
  campaignName: string
): string {
  return `${backtestingId}${ID_SEPARATOR}${optimizerId}${ID_SEPARATOR}${campaignName}`;
}

export function splitRunIdentifiers(
  runIdentifier: string
): {
  backtestingId: number;
  optimizerId: number;
  campaignName: string;
} {
  const [backtestingId, optimizerId, campaignName] = runIdentifier.split(
    ID_SEPARATOR
  );
  return {
    backtestingId: Number(backtestingId),
    optimizerId: Number(optimizerId),
    campaignName: String(campaignName),
  };
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
    return table.getSelection().map((recid) => {
      const row = table.get(recid);
      return mergeRunIdentifiers(
        getIdFromTableRow(row),
        getOptimizerIdFromTableRow(row),
        getCampaignNameFromTableRow(row)
      );
    });
  }
  return [];
}

function ensureBacktestingMetadataColumnsOrder(
  runDataColumns: RunDataTableColumnType[]
) {
  runDataColumns.sort(
    (a, b) =>
      (backtestingRunDataColumnOrder[a.key] || 0) -
      (backtestingRunDataColumnOrder[b.key] || 0)
  );
}

const backtestingRunDataColumnOrder: { [key: string]: number } = {
  runId: 0,
  "optimizer id": 1,
  "optimization campaign": 2,
  gains: 3,
  "% gains": 4,
  "% draw down": 5,
  "% win rate": 6,
  "R² max balance": 7,
  "R² end balance": 8,
  entries: 9,
  trades: 10,
  wins: 11,
  loses: 12,
  timestamp: 13,
  start_time: 14,
  end_time: 16,
  "markets profitability": 18,
  "end portfolio": 20,
  "start portfolio": 22,
  ref_market: 24,
  symbols: 26,
  "time frames": 28,
  exchanges: 30,
  trading_type: 32,
  future_contracts: 34,
  leverage: 36,
  name: 38,
  duration: 40,
  "backtesting files": 42,
};

type UserInpuntColumnsType = {
  [propertyKey: string]: {
    title: string;
    key?: string;
    dataIndex?: string;
    disableSearch?: boolean;
    dsorter?: "string" | "number" | "boolean" | undefined;
    children: UserInpuntColumnsType;
  };
};

function userInpuntColumnToArray(
  userInputColumns: UserInpuntColumnsType
): RunDataTableColumnType[] {
  return Object.entries(userInputColumns).map(([tentacleKey, columnGroup]) => {
    return {
      key: tentacleKey,
      title: columnGroup.title,
      disableSearch: true,
      // width,
      width: columnGroup.width,
      ...(columnGroup.children
        ? { children: userInpuntColumnToArray(columnGroup.children) }
        : {}),
    };
  });
}

function getUserInputColumns({
  userInputColumns,
  inputTentacle,
  inputTentacleLabel,
  tentacleNames,
  userInputKeys,
  inputsByConfig,
  hiddenMetadataColumns,
  currentTentaclesTradingConfig,
}: {
  userInputColumns: UserInpuntColumnsType;
  inputTentacle: string;
  inputTentacleLabel: string;
  tentacleNames: string[];
  userInputKeys: string[];
  inputsByConfig: TentaclesConfigValueType;
  hiddenMetadataColumns: string[] | undefined;
  currentTentaclesTradingConfig: TentaclesConfigsRootType | undefined;
}) {
  typeof inputsByConfig === "object" &&
    Object.entries(inputsByConfig as TentaclesConfigValuesType).forEach(
      ([propertyKey, propertyValue]) => {
        const inputKey = userInputKey(propertyKey, inputTentacle);
        if (
          !userInputKeys.includes(inputKey) &&
          !hiddenMetadataColumns?.includes(inputKey)
        ) {
          const {
            userInputLabel,
            lastTentacleTitle,
          } = findUserInputAndTentacleLabel(
            currentTentaclesTradingConfig,
            propertyKey,
            tentacleNames
          );
          const columnGroup = userInputColumns[lastTentacleTitle] || {
            title: lastTentacleTitle,
            width: 0,
            ellipsis: true,
            textWrap: "word-break",
            children: {},
          };
          const columnParent: UserInpuntColumnsType =
            inputTentacleLabel === lastTentacleTitle
              ? userInputColumns
              : columnGroup.children;
          if (
            propertyValue instanceof Object &&
            !(propertyValue instanceof Array)
          ) {
            if (inputTentacleLabel === lastTentacleTitle) {
              console.log("");
            }
            getUserInputColumns({
              userInputColumns: columnGroup.children,
              tentacleNames: [...tentacleNames, propertyKey],
              inputTentacleLabel: lastTentacleTitle,
              inputTentacle: propertyKey,
              userInputKeys,
              inputsByConfig: propertyValue,
              hiddenMetadataColumns,
              currentTentaclesTradingConfig,
            });
          } else {
            userInputKeys.push(inputKey);
            userInputKeys.push(lastTentacleTitle);
            // columnGroup.width += 100;
            columnGroup.children[inputKey] = {
              key: inputKey,
              dataIndex: inputKey,
              title: userInputLabel,
              width: 150,
              textWrap: "word-break",
              ellipsis: true,
              disableSearch: true,
              dsorter: typeof propertyValue as "string" | "number" | "boolean",
            };
          }
          if (!isObjectEmpty(columnGroup.children)) {
            userInputColumns[lastTentacleTitle] = columnGroup;
          }
        }
      }
    );
  return userInputColumns;
}

function _getTableDataType(records, search, defaultValue, sampleValue) {
  if (ID_DATA.includes(search.field)) {
    return "int";
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

function _formatUserInputRow(row, userInputData, parentIdentifiers: string) {
  Object.entries(userInputData).forEach(
    ([userInputIdentifier, userInputValue]) => {
      if (
        userInputValue instanceof Object &&
        !(userInputValue instanceof Array)
      ) {
        _formatUserInputRow(row, userInputValue, userInputIdentifier);
      } else {
        row[
          userInputKey(userInputIdentifier, parentIdentifiers)
        ] = userInputValue;
      }
    }
  );
}

function _formatMetadataRow(row: BacktestingRunData) {
  if (row["user inputs"]) {
    _formatUserInputRow(row, row["user inputs"], null);
  }
  Object.entries(row).forEach(([key, rowValue]) => {
    if (typeof rowValue === "object") {
      rowValue = JSON.stringify(rowValue);
    }
  });
}

function _filterOptimizationCampaign(
  table,
  currentOptimizerCampaignName: string
) {
  // default search and sort
  table.search(
    [
      {
        field: "optimization campaign",
        value: currentOptimizerCampaignName,
        operator: "is",
      },
    ],
    "AND"
  );
  // force "is" operator as it is not used in text searches by default
  table.searchData[0].operator = "is";
  table.localSearch();
  table.refresh();
}
