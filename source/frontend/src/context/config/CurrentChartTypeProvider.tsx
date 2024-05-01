import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { ChartType } from "../../widgets/AppWidgets/Charts/ChartTablePieCombo";

const defaultChartType = "chart";

const updateChartTypeContext = createContext<
  Dispatch<SetStateAction<ChartType>>
>((_value) => {});
const ChartTypeContext = createContext<ChartType>(defaultChartType);

export const useUpdateChartTypeContext = () => {
  return useContext(updateChartTypeContext);
};

export const useChartTypeContext = () => {
  return useContext(ChartTypeContext);
};

export function CurrentChartTypeProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [chartType, setChartType] = useState<ChartType>(defaultChartType);
  return (
    <ChartTypeContext.Provider value={chartType}>
      <updateChartTypeContext.Provider value={setChartType}>
        {children}
      </updateChartTypeContext.Provider>
    </ChartTypeContext.Provider>
  );
}
