import { useCallback, useContext } from "react";
import { createContext } from "react";
import { useState } from "react";

const CurrentPanelContext = createContext();
const UpdateCurrentPanelContext = createContext();

export const useCurrentPanelContext = () => {
    return useContext(CurrentPanelContext);
};

export const useUpdateCurrentPanelContext = () => {
    return useContext(UpdateCurrentPanelContext);
};

export const useSetCurrentPanelPercent = () => {
    const setPanelSize = useUpdateCurrentPanelContext()
    const logic = useCallback((percent) => {
        setPanelSize({ percent, shouldUpdate: true, });
    }, [setPanelSize]);
    return logic;
}

export function MainPanelProvider({ children }) {
    const [panelSize, setPanelSize] = useState({ percent: 60, shouldUpdate: false, });
    return (
        <UpdateCurrentPanelContext.Provider value={setPanelSize}>
            <CurrentPanelContext.Provider value={panelSize}>
                {children}
            </CurrentPanelContext.Provider>
        </UpdateCurrentPanelContext.Provider>
    );
}
