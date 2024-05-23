import { Grid } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

import {
  AppStoreAppType,
  AppStoreDataType,
  StoreCategoryType,
} from "../../../context/data/AppStoreDataProvider";
import { ErrorBoundary } from "../../WidgetManagement/RenderAppWidgets";
import AppCard from "./AppCards/AppCard";
import {
  strategyModeSettingsName,
  StrategyModeSettingsNameType,
} from "./storeConstants";

export default function AppList({
  selectedCategories,
  appStoreData,
  setSelectedCategories,
  currentStrategy,
}: {
  selectedCategories:
    | StoreCategoryType
    | StrategyModeSettingsNameType
    | undefined;
  appStoreData: AppStoreDataType | undefined;
  setSelectedCategories: Dispatch<
    SetStateAction<StoreCategoryType | StrategyModeSettingsNameType | undefined>
  >;
  currentStrategy: AppStoreAppType | undefined;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsloading] = useState(false);
  const thisCategoryAppStoreData: AppStoreAppType[] =
    selectedCategories &&
    selectedCategories !== strategyModeSettingsName &&
    appStoreData?.[selectedCategories]
      ? Object.values(appStoreData[selectedCategories])
      : [];
  const preSortedAppStoreData = thisCategoryAppStoreData?.sort(
    (a, b) => (b?.is_selected ? 1 : 0) - (a?.is_selected ? 1 : 0)
  );

  return (
    preSortedAppStoreData && (
      <Grid container spacing={2}>
        {preSortedAppStoreData.map((app, index) => {
          return (
            <ErrorBoundary
              key={(app.package_id || app.origin_package) + index}
              componentName={`Strategy Manager ${app.title}`}
            >
              <AppCard
                currentStrategy={currentStrategy}
                setSelectedCategories={setSelectedCategories}
                app={app}
                apps={preSortedAppStoreData}
                setIsloading={setIsloading}
              />
            </ErrorBoundary>
          );
        })}
      </Grid>
    )
  );
}
