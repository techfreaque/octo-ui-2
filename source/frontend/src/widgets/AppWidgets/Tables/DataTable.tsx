import { CloseCircleOutlined } from "@ant-design/icons";
import type { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import { Tooltip, Typography } from "antd";
import { t } from "i18next";
import type { Dispatch, SetStateAction} from "react";
import { useMemo } from "react";
import { useState } from "react";
import { Trans } from "react-i18next";

import { cancelOrders } from "../../../api/actions";
import AntButton, {
  buttonTypes,
  buttonVariants,
} from "../../../components/Buttons/AntButton";
import type {
  AntSideBarMenutItemType,
} from "../../../components/Sidebars/AntSidebar/AntSidebar";
import AntSidebar from "../../../components/Sidebars/AntSidebar/AntSidebar";
import type {
  AntTableColumnType,
  AntTableDataType,
} from "../../../components/Tables/AntTable";
import AntTable from "../../../components/Tables/AntTable";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import type {
  PlottedBacktestingElementType,
  PlottedElementNameType,
  PlottedElementsType,
  PlottedLiveElementType,
  PlottedSubSubElementType} from "../../../context/data/BotPlottedElementsProvider";
import {
  useBotPlottedElementsContext,
  useFetchPlotData,
} from "../../../context/data/BotPlottedElementsProvider";
import { objectEntries } from "../../../helpers/helpers";

export default function W2uiDataTable() {
  const plottedElements = useBotPlottedElementsContext();
  const botDomain = useBotDomainContext();
  return useMemo(() => {
    const menuItems = generateTables(plottedElements, botDomain);
    return menuItems?.length ? (
      <AntSidebar menuItems={menuItems} />
    ) : (
      <div
        style={{
          marginLeft: "20px",
          marginTop: "20px",
        }}
      >
        <Typography.Title>
          <Trans i18nKey="dataTable.there-are-no-historical-trading-data-tables-to-display" />
        </Typography.Title>
        <Typography.Title level={2}>
          <Trans i18nKey="dataTable.to-display-tables-for-trades-orders-etc-you-can" />
        </Typography.Title>
        <ul>
          <li><Trans i18nKey="dataTable.noDataYetText.select-a-backtesting-run" /></li>
          <li><Trans i18nKey="dataTable.noDataYetText.enter-valid-exchange-api-keys-and-activate-real-trading" /></li>
          <li>
            <Trans i18nKey="dataTable.noDataYetText.in-simulation-mode-wait-until-your-strategy-takes-the-first-trade" />
          </li>
        </ul>
      </div>
    );
  }, [botDomain, plottedElements]);
}

function generateTables(
  plottedElements: PlottedElementsType<PlottedElementNameType> | undefined,
  botDomain: string
): AntSideBarMenutItemType[] {
  const newMenuItems: {
    [key: string]: DataTableSideBarMainItemType;
  } = {};
  plottedElements &&
    objectEntries(plottedElements).forEach(([liveOrBacktest, subElements]) => {
      if (liveOrBacktest === "live") {
        generateTablesAndSidebarItems({
          plottedElements: subElements,
          liveOrBacktest,
          newMenuItems,
          botDomain,
        });
      } else {
        subElements &&
          Object.entries(subElements as PlottedBacktestingElementType).forEach(
            ([campaignName, campaignElements]) => {
              Object.entries(campaignElements).forEach(
                ([optimizerId, optimizerElements]) => {
                  generateTablesAndSidebarItems({
                    plottedElements: optimizerElements,
                    liveOrBacktest,
                    newMenuItems,
                    campaignName,
                    optimizerId,
                    botDomain,
                  });
                }
              );
            }
          );
      }
    });
  return Object.values(newMenuItems);
}

function generateTablesAndSidebarItems({
  plottedElements,
  liveOrBacktest,
  newMenuItems,
  campaignName,
  optimizerId,
  botDomain,
}: {
  plottedElements: PlottedLiveElementType | undefined;
  liveOrBacktest: PlottedElementNameType;
  newMenuItems: {
    [key: string]: DataTableSideBarMainItemType;
  };
  campaignName?: string;
  optimizerId?: string;
  botDomain: string;
}) {
  plottedElements &&
    Object.keys(plottedElements).forEach((runId) => {
      const thisRun = plottedElements[runId];
      thisRun &&
        Object.values(thisRun).forEach((symbolElements) => {
          symbolElements &&
            Object.keys(symbolElements).forEach((timeframe) => {
              const subElements = symbolElements[timeframe]?.data?.sub_elements;
              subElements?.forEach((subElement) => {
                if (subElement.name === "table") {
                  _generateTablesAndSidebarItems({
                    subElement,
                    liveOrBacktest,
                    newMenuItems,
                    campaignName,
                    optimizerId,
                    runId,
                    botDomain,
                  });
                }
              });
            });
        });
    });
}

export interface DataTableSideBarMainItemType extends AntSideBarMenutItemType {
  children: AntSideBarMenutItemType[];
}

export function createTradingOrBacktestingTab(
  liveOrBacktest: PlottedElementNameType
): DataTableSideBarMainItemType {
  return {
    title: liveOrBacktest === "live" ? t('dataTable.live-trading') : t('dataTable.backtesting-trading'),
    key: liveOrBacktest,
    antIcon: liveOrBacktest === "live" ? "DollarOutlined" : "RobotOutlined",
    dontScroll: true,
    content: (
      <Typography.Title level={2}>
        <Trans i18nKey="dataTable.select-a-table-from-the-sidebar" />
      </Typography.Title>
    ),
    children: [],
  };
}

function _generateTablesAndSidebarItems({
  subElement,
  liveOrBacktest,
  newMenuItems,
  campaignName,
  optimizerId,
  runId,
  botDomain,
}: {
  subElement: PlottedSubSubElementType;
  liveOrBacktest: PlottedElementNameType;
  newMenuItems: {
    [key: string]: DataTableSideBarMainItemType;
  };
  campaignName: string | undefined;
  optimizerId: string | undefined;
  runId: string;
  botDomain: string;
}) {
  subElement?.data?.elements?.forEach((element) => {
    if (!(element.rows && element.columns)) {
      return;
    }
    const liveOrBacktestingItems: DataTableSideBarMainItemType =
      newMenuItems[liveOrBacktest] ||
      createTradingOrBacktestingTab(liveOrBacktest);
    let label;
    let cancelOrdersDetails: CancelOrderDetailsType | undefined = undefined;
    if (liveOrBacktest === "live") {
      label = `${element.title} ${runId}`;
      if (element.title.startsWith(t('dataTable.orders'))) {
        cancelOrdersDetails = {
          text: t('dataTable.cancel-selected-orders'),
          tooltip: t('dataTable.cancel-selected-orders'),
          icon: CloseCircleOutlined,
          cancelCallback: (
            orderIdsToCancel: string[],
            setIsCancelling: Dispatch<SetStateAction<boolean>>,
            upDateOrders: (isLive?: boolean) => void
          ) =>
            cancelOrders(
              botDomain,
              orderIdsToCancel,
              setIsCancelling,
              upDateOrders
            ),
        };
      }
    } else {
      label = `${element.title} ${campaignName} ${optimizerId} ${runId}`;
    }
    liveOrBacktestingItems.children.push({
      title: label,
      antIcon: element.config?.antIcon,
      faIcon: element.config?.faIcon,
      key: label,
      noPadding: true,
      dontScroll: true,
      content: (
        <TableFromElement
          data={element.rows}
          columns={element.columns}
          cancelOrdersDetails={cancelOrdersDetails}
        />
      ),
    });
    newMenuItems[liveOrBacktest] = liveOrBacktestingItems;
  });
}

interface CancelOrderDetailsType {
  text: string;
  tooltip: string;
  icon: React.ForwardRefExoticComponent<
    Omit<AntdIconProps, "ref"> & React.RefAttributes<HTMLSpanElement>
  >;
  cancelCallback: (
    orderIdsToCancel: string[],
    setIsCancelling: Dispatch<SetStateAction<boolean>>,
    upDateOrders: () => void
  ) => void;
}

export type DataTableDataType = AntTableDataType
export type DataTableColumnType = AntTableColumnType<DataTableDataType>

function TableFromElement({
  data,
  columns,
  cancelOrdersDetails,
}: {
  data: DataTableDataType[];
  columns: DataTableColumnType[];
  cancelOrdersDetails: CancelOrderDetailsType | undefined;
}) {
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>();
  const updateTable = useFetchPlotData();
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const somethingSelected = !!selectedRecordIds?.length;
  return (
    <AntTable<DataTableDataType, DataTableColumnType>
      data={data}
      columns={columns}
      maxWidth="100%"
      size="small"
      selectedRowKeys={cancelOrdersDetails ? selectedRecordIds : undefined}
      setSelectedRowKeys={
        cancelOrdersDetails ? setSelectedRecordIds : undefined
      }
      header={
        cancelOrdersDetails ? (
          <Tooltip title={cancelOrdersDetails.tooltip}>
            <div>
              <AntButton
                antIconComponent={cancelOrdersDetails.icon}
                colorType={
                  isCancelling ? buttonTypes.font : buttonTypes.fontActive
                }
                disabled={!somethingSelected}
                buttonVariant={buttonVariants.text}
                onClick={
                  somethingSelected
                    ? () =>
                        cancelOrdersDetails.cancelCallback(
                          selectedRecordIds,
                          setIsCancelling,
                          updateTable
                        )
                    : undefined
                }
                spin={isCancelling}
              >
                {cancelOrdersDetails.text}
              </AntButton>
            </div>
          </Tooltip>
        ) : undefined
      }
    />
  );
}
