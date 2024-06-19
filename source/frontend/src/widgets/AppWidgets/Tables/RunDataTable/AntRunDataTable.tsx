import {
  DeleteFilled,
  DownloadOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Radio, Switch, Tooltip } from "antd";
import { t } from "i18next";
import { useMemo, useState } from "react";
import { Trans } from "react-i18next";

import AntButton, {
  buttonTypes,
  buttonVariants,
} from "../../../../components/Buttons/AntButton";
import createNotification from "../../../../components/Notifications/Notification";
import type {
  AntTableColumnType,
  AntTableDataType,
} from "../../../../components/Tables/AntTable";
import AntTable from "../../../../components/Tables/AntTable";
import {
  findUserInputAndTentacleLabel,
  userInputKey,
} from "../../../../components/UserInputs/utils";
import {
  ID_DATA,
  ID_SEPARATOR,
  METADATA_ADVANCED_HIDDEN_FIELDS,
  METADATA_HIDDEN_FIELDS,
  METADATA_UNDISPLAYED_FIELDS,
  TIMESTAMP_DATA,
} from "../../../../constants/backendConstants";
import { tableSizes } from "../../../../constants/frontendConstants";
import type {
  TentaclesConfigByTentacleType,
  TentaclesConfigsRootType,
  TentaclesConfigValuesType,
  TentaclesConfigValueType,
} from "../../../../context/config/TentaclesConfigProvider";
import {
  tentacleConfigTypes,
  useSaveTentaclesConfig,
  useTentaclesConfigContext,
} from "../../../../context/config/TentaclesConfigProvider";
import type {
  BacktestingRunData,
  BacktestingRunDataWithoutID,
} from "../../../../context/data/BacktestingRunDataProvider";
import { useDeleteBacktestingRunData } from "../../../../context/data/BacktestingRunDataProvider";
import type { DisplayedRunIdsType } from "../../../../context/data/BotPlottedElementsProvider";
import {
  defaultDisplayedRunIds,
  useDisplayedRunIdsContext,
  useHiddenBacktestingMetadataColumnsContext,
  useUpdateDisplayedRunIdsContext,
} from "../../../../context/data/BotPlottedElementsProvider";
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
  return useMemo(() => {
    return (
      <MetaDataTable
        metadata={runData}
        currentCampaignName={currentCampaignName}
        reloadData={reloadData}
      />
    );
  }, [currentCampaignName, reloadData, runData]);
}

function MetaDataTable({
  metadata,
  currentCampaignName,
  reloadData,
}: {
  metadata: BacktestingRunData[];
  currentCampaignName: string;
  reloadData: (onDone: () => void) => void;
}) {
  const setDisplayedRunIds = useUpdateDisplayedRunIdsContext();
  const displayedRunIds = useDisplayedRunIdsContext();
  const deleteBacktestingRuns = useDeleteBacktestingRunData();
  const hiddenMetadataColumns = useHiddenBacktestingMetadataColumnsContext();
  const saveTentaclesConfig = useSaveTentaclesConfig();
  const currentTentaclesConfig = useTentaclesConfigContext();
  const currentTentaclesTradingConfig =
    currentTentaclesConfig?.[tentacleConfigTypes.tradingTentacles];
  const [visibleColumns, setVisibleColumns] = useState<
    "info" | "settings" | "allInfo"
  >("info");
  const [showCurrentCampaign, setShowCurrentCampaign] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [loadSelectedRuns, setLoadSelectedRuns] = useState<boolean>(true);
  const [_selectedRunIds, _setSelectedRunIds] = useState<DisplayedRunIdsType>(
    defaultDisplayedRunIds
  );
  const selectedRunIds = loadSelectedRuns ? displayedRunIds : _selectedRunIds;
  const setSelectedRunIds = loadSelectedRuns
    ? setDisplayedRunIds
    : _setSelectedRunIds;
  const somethingSelected = !!selectedRunIds.backtesting?.length;
  const onlyOneIsSelected = selectedRunIds.backtesting?.length === 1;

  const {
    columns,
    records,
    runDataColumnKeys,
    userInputKeys,
  } = useFormatTableData(
    metadata,
    hiddenMetadataColumns,
    currentTentaclesTradingConfig,
    showCurrentCampaign,
    currentCampaignName
  );
  return useMemo(() => {
    function setSelectedRecordIds(selectedRecordIds: string[]) {
      setSelectedRunIds((prev_selection) => {
        return {
          ...prev_selection,
          backtesting: selectedRecordIds,
        };
      });
    }

    function handleDeleteSelected() {
      setIsUpdating(true);
      deleteBacktestingRuns(
        selectedRunIds.backtesting.map((runId) => {
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
        setIsUpdating,
        () => setSelectedRecordIds([])
      );
    }
    function restoreSettings(settings: TentaclesConfigValuesType | undefined) {
      if (settings) {
        saveTentaclesConfig(
          settings as TentaclesConfigByTentacleType,
          setIsUpdating,
          true,
          true
        );
      } else {
        createNotification({
          title: t("backtesting.runDataTable.failed-to-restore-settings"),
          message: t("backtesting.runDataTable.no-settings-found-for-this-run"),
          type: "danger",
        });
      }
    }
    return (
      <AntTable<RunDataTableDataType, RunDataTableColumnType>
        data={records}
        columns={columns}
        maxWidth="100%"
        height="100%"
        size={tableSizes.small}
        bordered
        scrollWidth={"100%"}
        selectedRowKeys={selectedRunIds.backtesting}
        setSelectedRowKeys={setSelectedRecordIds}
        hiddenColumns={
          visibleColumns === "info"
            ? [
                ...METADATA_HIDDEN_FIELDS,
                ...userInputKeys,
                ...(showCurrentCampaign ? ["optimization campaign"] : []),
              ]
            : visibleColumns === "allInfo"
            ? [
                ...METADATA_ADVANCED_HIDDEN_FIELDS,
                ...userInputKeys,
                ...(showCurrentCampaign ? ["optimization campaign"] : []),
              ]
            : [
                ...METADATA_HIDDEN_FIELDS,
                ...(showCurrentCampaign ? ["optimization campaign"] : []),
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
        paginationSize={500}
        header={
          <>
            <Tooltip
              title={t("backtesting.runDataTable.refreshes-the-run-data-table")}
            >
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
              title={t(
                "backtesting.runDataTable.toggle-displaying-data-only-from-the-current-campaign-or-from-all-activated-ones-tooltip"
              )}
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
                    setShowCurrentCampaign((prevSelection) => {
                      return !prevSelection;
                    });
                  }}
                >
                  {t("backtesting.runDataTable.current-campaign-campaignName", {
                    currentCampaignName,
                  })}
                </AntButton>
              </div>
            </Tooltip>
            <Radio.Group
              defaultValue="info"
              style={{ display: "flex" }}
              onChange={(event) => setVisibleColumns(event.target.value)}
            >
              <Tooltip
                title={t("backtesting.runDataTable.display-run-information")}
              >
                <Radio.Button value="info">
                  <Trans i18nKey="backtesting.runDataTable.backtesting-info" />
                </Radio.Button>
              </Tooltip>
              <Tooltip
                title={t(
                  "backtesting.runDataTable.display-all-run-information"
                )}
              >
                <Radio.Button value="allInfo">
                  <Trans i18nKey="backtesting.runDataTable.backtesting-all-info" />
                </Radio.Button>
              </Tooltip>
              <Tooltip
                title={t("backtesting.runDataTable.display-run-settings")}
              >
                <Radio.Button value="settings">
                  <Trans i18nKey="backtesting.runDataTable.backtestings-settings" />
                </Radio.Button>
              </Tooltip>
            </Radio.Group>
            <Tooltip
              title={t(
                "backtesting.runDataTable.load-plots-for-selected-runs-or-just-select-them-tooltip"
              )}
            >
              <Switch
                checkedChildren={"plot"}
                unCheckedChildren={"select"}
                onChange={() =>
                  setLoadSelectedRuns((prevSelection) => {
                    setDisplayedRunIds((prevState) => ({
                      ...prevState,
                      backtesting: prevSelection
                        ? []
                        : selectedRunIds.backtesting,
                    }));

                    return !prevSelection;
                  })
                }
                defaultChecked
              />
            </Tooltip>
            <div style={{ margin: "auto" }} />
            <Tooltip
              title={
                onlyOneIsSelected ? (
                  <Trans i18nKey="backtesting.runDataTable.restores-all-settings-from-this-run" />
                ) : (
                  <Trans i18nKey="backtesting.runDataTable.select-only-one-run-to-be-able-to-restore-the-settings" />
                )
              }
            >
              <div>
                <AntButton
                  antIconComponent={DownloadOutlined}
                  colorType={
                    isUpdating ? buttonTypes.font : buttonTypes.fontActive
                  }
                  disabled={!onlyOneIsSelected || isUpdating}
                  buttonVariant={buttonVariants.text}
                  onClick={
                    onlyOneIsSelected
                      ? () => {
                          const selectedRow = records.find(
                            (record) =>
                              record.id === selectedRunIds.backtesting[0]
                          );
                          restoreSettings(selectedRow?.["user inputs"]);
                        }
                      : undefined
                  }
                >
                  <Trans i18nKey="backtesting.runDataTable.restore-settings" />
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
                  <Trans i18nKey="backtesting.runDataTable.backtesting-delete-selected" />
                </AntButton>
              </div>
            </Tooltip>
          </>
        }
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    records,
    columns,
    selectedRunIds.backtesting,
    visibleColumns,
    userInputKeys,
    showCurrentCampaign,
    runDataColumnKeys,
    isUpdating,
    currentCampaignName,
    onlyOneIsSelected,
    somethingSelected,
    setSelectedRunIds,
  ]);
}

function useFormatTableData(
  metadata: BacktestingRunData[],
  hiddenMetadataColumns: string[] | undefined,
  currentTentaclesTradingConfig: TentaclesConfigsRootType | undefined,
  showCurrentCampaign: boolean,
  currentCampaignName: string
) {
  return useMemo(() => {
    const preFilteredMetadata = showCurrentCampaign
      ? (JSON.parse(JSON.stringify(metadata)) as BacktestingRunData[]).filter(
          (row) => row["optimization campaign"] === currentCampaignName
        )
      : (JSON.parse(JSON.stringify(metadata)) as BacktestingRunData[]);
    preFilteredMetadata.sort((a, b) => b.timestamp - a.timestamp);
    const firstRow = preFilteredMetadata[0] as BacktestingRunData | undefined;

    const filteredFirstRow =
      firstRow &&
      Object.entries(firstRow).filter(
        ([key]) => !METADATA_UNDISPLAYED_FIELDS.includes(key)
      );
    const runDataColumnKeys: string[] = ["runInformation"];
    const runDataColumns:
      | RunDataTableColumnType[]
      | undefined = filteredFirstRow?.map(([key, rowValue]) => {
      const _key = key === "id" ? "runId" : key;
      runDataColumnKeys.push(_key);
      return {
        key: _key,
        dataIndex: _key,
        title: key,
        width: 100,
        textWrap: "word-break",
        ellipsis: true,
        dsorter: ["string", "number", "boolean"].includes(typeof rowValue)
          ? (typeof rowValue as "string" | "number" | "boolean")
          : undefined,
        render: TIMESTAMP_DATA.includes(key)
          ? (value: number) => {
              return <>{new Date(value*1000).toISOString()}</>;
            }
          : ID_DATA.includes(key)
          ? (value: number | string) => {
              return <>{Number(value)}</>;
            }
          : undefined,
      };
    });
    runDataColumns && ensureBacktestingMetadataColumnsOrder(runDataColumns);

    // Build user inputs columns. They are hidden by default
    const userInputColumns: UserInpuntColumnsType = {};
    const userInputKeys: string[] = [];

    preFilteredMetadata.forEach((run_metadata) => {
      if (run_metadata["user inputs"]) {
        Object.entries(run_metadata["user inputs"]).forEach(
          ([inputTentacle, inputConfigs]) => {
            //   const hasTentacle = !addedTentacles.includes(inputTentacle);
            getUserInputColumns({
              userInputColumns,
              inputTentacle,
              tentacleNames: [inputTentacle],
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
        title: t("backtesting.runDataTable.run-information"),
        key: "runInformation",
        disableSearch: true,
        children: runDataColumns || [],
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

    const records: RunDataTableDataType[] = preFilteredMetadata.map((row) => {
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

    // const runDataSearches = filteredFirstRow.map(([key]) => {
    //   return {
    //     field: key,
    //     label: key,
    //     type: TIMESTAMP_DATA.includes(key)
    //       ? "datetime"
    //       : _getTableDataType(
    //           records,
    //           {
    //             type: null,
    //             field: key,
    //           },
    //           "text",
    //           null
    //         ),
    //   };
    // });
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
    return {
      columns,
      records,
      runDataColumnKeys,
      userInputKeys,
    };
  }, [
    currentCampaignName,
    currentTentaclesTradingConfig,
    hiddenMetadataColumns,
    metadata,
    showCurrentCampaign,
  ]);
}

export type RunDataTableDataType = BacktestingRunDataWithoutID &
  AntTableDataType & { [key: string]: any };
export type RunDataTableColumnType = AntTableColumnType<RunDataTableDataType>;

export function mergeRunIdentifiers(
  backtestingId: number | string,
  optimizerId: number | string,
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
    width: number;
    key?: string;
    dataIndex?: string;
    ellipsis?: boolean;
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
      dataIndex: tentacleKey,
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
  tentacleNames,
  userInputKeys,
  inputsByConfig,
  hiddenMetadataColumns,
  currentTentaclesTradingConfig,
}: {
  userInputColumns: UserInpuntColumnsType;
  inputTentacle: string;
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
            children: {} as UserInpuntColumnsType,
          };
          if (
            propertyValue instanceof Object &&
            !(propertyValue instanceof Array)
          ) {
            getUserInputColumns({
              userInputColumns: columnGroup.children,
              tentacleNames: [...tentacleNames, propertyKey],
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
              ellipsis: true,
              disableSearch: true,
              children: {},
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

// function _getTableDataType(records, search, defaultValue, sampleValue) {
//   if (ID_DATA.includes(search.field)) {
//     return "int";
//   }
//   if (search.type !== null) {
//     return search.type;
//   }
//   const _sampleValue =
//     sampleValue === null ? records[0][search.field] : sampleValue;
//   if (typeof _sampleValue === "undefined") {
//     return defaultValue;
//   }
//   if (typeof _sampleValue === "number") {
//     return "float";
//   }
//   if (typeof _sampleValue === "string") {
//     return "text";
//   }
//   if (typeof _sampleValue === "object") {
//     return "list";
//   }
//   return defaultValue;
// }

function _formatUserInputRow(
  row: BacktestingRunData,
  userInputData: TentaclesConfigValuesType,
  parentIdentifiers: string
) {
  Object.entries(userInputData).forEach(
    ([userInputIdentifier, userInputValue]) => {
      if (
        userInputValue instanceof Object &&
        !(userInputValue instanceof Array)
      ) {
        _formatUserInputRow(row, userInputValue, userInputIdentifier);
      } else {
        (row as any)[
          userInputKey(userInputIdentifier, parentIdentifiers)
        ] = String(userInputValue);
      }
    }
  );
}

function _formatMetadataRow(row: BacktestingRunData) {
  if (row["user inputs"]) {
    _formatUserInputRow(row, row["user inputs"], "");
  }
  Object.values(row).forEach((rowValue) => {
    if (typeof rowValue === "object") {
      rowValue = JSON.stringify(rowValue);
    }
  });
}
