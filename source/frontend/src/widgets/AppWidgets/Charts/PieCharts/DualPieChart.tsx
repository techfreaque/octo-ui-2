import { useEffect, useState } from "react";
import PlotlyChart from "../MainCharts/Plotly";
import { DataTableSideBarMainItemType, createTradingOrBacktestingTab } from "../../Tables/W2uiDataTable";
import AntSidebar, {
  AntSideBarMenutItemType,
} from "../../../../components/Sidebars/AntSidebar/AntSidebar";
import useMeasure from "react-use-measure";
import { ChartDataType, ChartsDataType } from "../ChartTablePieCombo";
import {
  PlotlyLayoutType,
  UpdatePlotlyLayoutsType,
} from "../MainCharts/PlotlyContext";
import { PlottedElementNameType } from "../../../../context/data/BotPlottedElementsProvider";
export const pieChartName = "pie-chart";
export default function DualPieChart({
  setLayouts,
  layout,
  charts,
}: {
  charts: ChartsDataType;
  setLayouts: UpdatePlotlyLayoutsType;
  layout: PlotlyLayoutType;
}) {
  const [containerRef, { width, height }] = useMeasure();
  const [menuItems, setMenuItems] = useState<AntSideBarMenutItemType[]>();

  const pieCharts: ChartDataType[] | undefined = charts?.[pieChartName];
  useEffect(() => {
    const newMenuItems = generateSidebarMenu(
      { ...layout, width, height },
      pieCharts,
      setLayouts
    );
    setMenuItems(Object.values(newMenuItems));
  }, [height, layout, pieCharts, setLayouts, width]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <AntSidebar menuItems={menuItems} />
    </div>
  );
}

type DualChartsSideBarItemsType = {
  [key in PlottedElementNameType]?: DataTableSideBarMainItemType;
};


function generateSidebarMenu(
  layout: PlotlyLayoutType,
  pieCharts: ChartDataType[] | undefined,
  setLayouts: UpdatePlotlyLayoutsType
) {
  const newMenuItems: DualChartsSideBarItemsType = {};
  pieCharts?.forEach((chart) => {
    const liveOrBacktest: PlottedElementNameType =
      chart.backtesting_id === undefined ? "live" : "backtesting";
    if (!newMenuItems[liveOrBacktest]) {
      newMenuItems[liveOrBacktest] = createTradingOrBacktestingTab(
        liveOrBacktest
      );
    }
    newMenuItems[liveOrBacktest]?.children.push({
      label: chart.name,
      key: chart.name,
      // antIcon: element.config ?. antIcon,
      // faIcon: element.config ?. faIcon,
      noPadding: true,
      content: (
        <PlotlyChart
          chartLocation={pieChartName}
          setLayouts={setLayouts}
          layout={layout}
          chartData={[chart] as ChartDataType[]}
        />
      ),
    });
  });
  return newMenuItems;
}
