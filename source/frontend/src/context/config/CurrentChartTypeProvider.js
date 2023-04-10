import {createContext, useContext, useState} from "react";
import {chartTypes} from "../../widgets/AppWidgets/Charts/ChartTablePieCombo";

const updateChartTypeContext = createContext();
const ChartTypeContext = createContext();

export const useUpdateChartTypeContext = () => {
    return useContext(updateChartTypeContext);
};

export const useChartTypeContext = () => {
    return useContext(ChartTypeContext);
};

export function CurrentChartTypeProvider({children}) {
    const [chartType, setChartType] = useState(chartTypes.CHART);
    return (<ChartTypeContext.Provider value={chartType}>
        <updateChartTypeContext.Provider value={setChartType}> {children} </updateChartTypeContext.Provider>
    </ChartTypeContext.Provider>);
}
