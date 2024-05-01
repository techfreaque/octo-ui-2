import {
  useState,
  useContext,
  createContext,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import { botLayoutKey } from "../../constants/backendConstants";
import { UiConfigKeyType, useUiConfigContext } from "./UiConfigProvider";
import { PagebuilderComponents } from "../../widgets/AppWidgets/PageBuilder/PageBuilder";
import { PanelPositionType } from "../../widgets/AppWidgets/Buttons/CurrentPanelPosition";
import { ApiActionsType } from "../data/BotInfoProvider";

export interface UiLayoutPageLayoutType {
  title?: string;
  component: PagebuilderComponents;
  faIcon?: string;
  antIcon?: string;
  content?: UiLayoutPageLayoutType[];
  toolBarContent?: UiLayoutPageLayoutType[];
  children?: UiLayoutPageLayoutType[];
  headerContent?: UiLayoutPageLayoutType[];
  pageContent?: UiLayoutPageLayoutType[];
  footerContent?: UiLayoutPageLayoutType[];
  upperContent?: UiLayoutPageLayoutType[];
  lowerContent?: UiLayoutPageLayoutType[];
  rightContent?: UiLayoutPageLayoutType[];
  dontScroll?: boolean;
  displayAsAvatar?: boolean;
  position?: PanelPositionType;
  iconOnly?: boolean;
  width?: string;
  tabs?: UiLayoutPageLayoutType[];
  leftContent?: UiLayoutPageLayoutType[];
  command?: ApiActionsType;
  sideBarContent?: UiLayoutPageLayoutType[];
  settingsContent?: UiLayoutPageLayoutType[];
  configKeys?: UiConfigKeyType[];
  label?: string;
  additionalTabs?: UiLayoutPageLayoutType[];
  noPadding?: boolean;
  tentacleNames?: "RunAnalysisModePlugin";
  minHeights?: string;
}

export interface UiLayoutPageType {
  layout: UiLayoutPageLayoutType[];
  path: string;
  title: string;
}

interface UiDimensionsType {
  header: number;
  main: number;
  footer: number;
}

const defaultUiDimensions: UiDimensionsType = {
  header: 50,
  main: window.innerHeight - 100,
  footer: 50,
};

const BotLayoutContext = createContext<UiLayoutPageType[] | undefined>(
  undefined
);
const UpdateBotLayoutContext = createContext<
  Dispatch<SetStateAction<UiLayoutPageType[] | undefined>>
>((_value) => {});
const UiDimensionsContext = createContext<UiDimensionsType>(
  defaultUiDimensions
);
const UpdateUiDimensionsContext = createContext<
  Dispatch<SetStateAction<UiDimensionsType>>
>((_value) => {});

export const useBotLayoutContext = () => {
  return useContext(BotLayoutContext);
};
export const useUpdateBotLayoutContext = () => {
  return useContext(UpdateBotLayoutContext);
};
export const useUiDimensionsContext = () => {
  return useContext(UiDimensionsContext);
};
export const useUpdateUiDimensionsContext = () => {
  return useContext(UpdateUiDimensionsContext);
};

export const BotLayoutProvider = ({ children }: { children: JSX.Element }) => {
  const [botLayout, setBotLayout] = useState<UiLayoutPageType[] | undefined>();
  const [uiDimensions, setUiDimensions] = useState(defaultUiDimensions);
  const uiConfig = useUiConfigContext();
  const loadedLayout = uiConfig?.[botLayoutKey]?.layouts;
  useEffect(() => {
    setBotLayout(loadedLayout);
  }, [loadedLayout]);
  return (
    <BotLayoutContext.Provider value={botLayout}>
      <UpdateBotLayoutContext.Provider value={setBotLayout}>
        <UiDimensionsContext.Provider value={uiDimensions}>
          <UpdateUiDimensionsContext.Provider value={setUiDimensions}>
            {children}
          </UpdateUiDimensionsContext.Provider>
        </UiDimensionsContext.Provider>
      </UpdateBotLayoutContext.Provider>
    </BotLayoutContext.Provider>
  );
};
