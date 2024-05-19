import W2uiDataTable from "../Tables/DataTable";
import PlotlyDualCharts from "./MainCharts/PlotlyDualCharts";
import { sizes } from "../../../constants/frontendConstants";
import {
  useChartTypeContext,
  useUpdateChartTypeContext,
} from "../../../context/config/CurrentChartTypeProvider";
import { useEffect, useState } from "react";
import {
  LineChartOutlined,
  PieChartOutlined,
  SettingOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { AntIconByReactFunc } from "../../../components/Icons/AntIcon";
import RadioButtonGroup from "../../../components/Buttons/RadioButtonGroup";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";
import { Trans } from "react-i18next";
import DualPieChart, { pieChartName } from "./PieCharts/DualPieChart";
import {
  usePlotlyLayoutsContext,
  useUpdatePlotlyLayoutsContext,
} from "./MainCharts/PlotlyContext";
import { useVisibleTimeFramesContext } from "../../../context/config/VisibleTimeFrameProvider";
import { setPlotData } from "./MainCharts/PlotlyGenerateData";
import { useVisiblePairsContext } from "../../../context/config/VisiblePairProvider";
import { useUiConfigContext } from "../../../context/config/UiConfigProvider";
import { useBotPlottedElementsContext } from "../../../context/data/BotPlottedElementsProvider";
import { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";
import { ChartLocationType } from "./MainCharts/Plotly";

export type ChartDataType = Plotly.Data & {
  backtesting_id?: string;
  optimizer_id?: string;
  name: string;
};

export type ChartsDataType = {
  [chart in ChartLocationType]?: ChartDataType[];
};

export type ChartType =
  | "chart"
  | "table"
  | "pie"
  | "stats"
  | "runAnalysis"
  | "dictionary";

export const chartTypes: {
  CHART: ChartType;
  TABLE: ChartType;
  PIE: ChartType;
  STATS: ChartType;
  RUN_ANALYSIS: ChartType;
} = {
  CHART: "chart",
  TABLE: "table",
  PIE: "pie",
  STATS: "stats",
  RUN_ANALYSIS: "runAnalysis",
};

export function ChartTypeSelector() {
  const updateChartType = useUpdateChartTypeContext();
  const chartType = useChartTypeContext();

  const _chartTypes: {
    label: JSX.Element;
    toolTipText: JSX.Element;
    key: ChartType;
  }[] = [
    {
      label: (
        <AntIconByReactFunc
          AntReactIcon={LineChartOutlined}
          size={sizes.small}
        />
      ),

      toolTipText: <Trans i18nKey="plotting.switchtotheChartsView" />,
      key: chartTypes.CHART,
      // disabled: true
    },
    {
      label: (
        <AntIconByReactFunc
          AntReactIcon={PieChartOutlined}
          size={sizes.small}
        />
      ),

      toolTipText: <Trans i18nKey="plotting.switchToThePieChartView" />,
      key: chartTypes.PIE,
      // disabled: true
    },
    {
      label: (
        <AntIconByReactFunc
          AntReactIcon={UnorderedListOutlined}
          size={sizes.small}
        />
      ),

      toolTipText: <Trans i18nKey="plotting.switchtotheTablesView" />,
      key: chartTypes.TABLE,
      // disabled: true
    },
    {
      label: (
        <AntIconByReactFunc AntReactIcon={SettingOutlined} size={sizes.small} />
      ),

      toolTipText: <Trans i18nKey="plotting.switchtotheDisplaySettings" />,
      key: chartTypes.RUN_ANALYSIS,
      // disabled: true
    },

    // <PieChartOutlined />

    // {
    //     label: (<FaIconByReactFunc icon={faChartPie}
    //         size={
    //             sizes.medium
    //         }/>),
    //     value: 'pie',
    //     disabled: true
    // }, {
    //     label: (<FaIconByReactFunc icon={faChartLine}
    //         size={
    //             sizes.medium
    //         }/>),
    //     value: 'stats',
    //     disabled: true
    // },
  ];

  return (
    <RadioButtonGroup
      menuItems={_chartTypes}
      onChange={updateChartType as (newValue: string) => void}
      selected={chartType}
    />
  );
}

export default function ChartTablePieCombo({
  settingsContent,
}: UiLayoutPageLayoutType) {
  const [charts, setCharts] = useState<ChartsDataType | undefined>(undefined);
  const layouts = usePlotlyLayoutsContext();
  const setLayouts = useUpdatePlotlyLayoutsContext();
  const chartType = useChartTypeContext();
  const plottedElements = useBotPlottedElementsContext();
  const uiConfig = useUiConfigContext();
  const visiblePairs = useVisiblePairsContext();
  const visibleTimeframes = useVisibleTimeFramesContext();
  useEffect(() => {
    if (visibleTimeframes && visiblePairs && uiConfig) {
      setPlotData(
        plottedElements,
        uiConfig,
        visibleTimeframes,
        visiblePairs,
        setCharts,
        setLayouts
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plottedElements, uiConfig, visiblePairs, visibleTimeframes]);

  if (chartType === chartTypes.CHART) {
    return (
      charts && (
        <PlotlyDualCharts
          charts={charts}
          setLayouts={setLayouts}
          layouts={layouts}
        />
      )
    );
  } else if (chartType === chartTypes.TABLE) {
    return <W2uiDataTable />;
  } else if (chartType === chartTypes.RUN_ANALYSIS) {
    return settingsContent && <AppWidgets layout={settingsContent} />;
  } else if (chartType === chartTypes.PIE) {
    return (
      settingsContent &&
      layouts[pieChartName] &&
      charts && (
        <DualPieChart
          charts={charts}
          setLayouts={setLayouts}
          layout={layouts[pieChartName]}
        />
      )
    );
  } else return <></>;
}
