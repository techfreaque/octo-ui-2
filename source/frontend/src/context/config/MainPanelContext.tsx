import type { Dispatch, SetStateAction} from "react";
import { useCallback, useContext } from "react";
import { createContext } from "react";
import { useState } from "react";

import { emptyValueFunction } from "../../helpers/helpers";

interface PanelSizeType {
  percent: number;
  shouldUpdate: boolean;
}

const defaultPanelSize: PanelSizeType = {
  percent: 50,
  shouldUpdate: false,
};

const CurrentPanelContext = createContext<PanelSizeType>(defaultPanelSize);
const UpdateCurrentPanelContext = createContext<
  Dispatch<SetStateAction<PanelSizeType>>
>(emptyValueFunction);

export const useCurrentPanelContext = () => {
  return useContext(CurrentPanelContext);
};

export const useUpdateCurrentPanelContext = () => {
  return useContext(UpdateCurrentPanelContext);
};

export const useSetCurrentPanelPercent = () => {
  const setPanelSize = useUpdateCurrentPanelContext();
  return useCallback(
    (percent: number) => {
      setPanelSize({ percent, shouldUpdate: true });
    },
    [setPanelSize]
  );
};

export function MainPanelProvider({ children }: { children: JSX.Element }) {
  const [panelSize, setPanelSize] = useState<PanelSizeType>(defaultPanelSize);
  return (
    <UpdateCurrentPanelContext.Provider value={setPanelSize}>
      <CurrentPanelContext.Provider value={panelSize}>
        {children}
      </CurrentPanelContext.Provider>
    </UpdateCurrentPanelContext.Provider>
  );
}
