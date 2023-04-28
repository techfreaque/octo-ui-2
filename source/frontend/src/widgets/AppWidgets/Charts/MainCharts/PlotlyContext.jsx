import { createContext, useContext, useState } from "react";

const UpdatePlotlyLayoutsContext = createContext();
const PlotlyLayoutsContext = createContext();

export const useUpdatePlotlyLayoutsContext = () => {
    return useContext(UpdatePlotlyLayoutsContext);
};

export const usePlotlyLayoutsContext = () => {
    return useContext(PlotlyLayoutsContext);
};

export const PlotlyLayoutsProvider = ({ children }) => {
    const [mainLayouts, setMainLayouts] = useState({});
    const [subLayouts, setSubLayouts] = useState({});
    const [pieChartLayouts, setPieChartLayouts] = useState({});
    const [backtestingLayouts, setBacktestingLayouts] = useState({});
    return (
        <UpdatePlotlyLayoutsContext.Provider value={{
            "main-chart": setMainLayouts,
            "sub-chart": setSubLayouts,
            "pie-chart": setPieChartLayouts,
            "b": setBacktestingLayouts,
        }}>
            <PlotlyLayoutsContext.Provider value={{
                "main-chart": mainLayouts,
                "sub-chart": subLayouts,
                "pie-chart": pieChartLayouts,
                "b": backtestingLayouts,
            }}>
                {children}
            </PlotlyLayoutsContext.Provider>
        </UpdatePlotlyLayoutsContext.Provider>
    );
};
