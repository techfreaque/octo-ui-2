import { Dispatch, SetStateAction, useState } from "react";
import AppCard from "./AppCards/AppCard";
import { Grid } from "@mui/material";
import { ErrorBoundary } from "../../WidgetManagement/RenderAppWidgets";
import {
  AppStoreAppType,
  AppStoreDataType,
  StoreCategoryType,
} from "../../../context/data/AppStoreDataProvider";

export default function AppList({
  selectedCategories,
  appStoreData,
  setSelectedCategories,
  currentStrategy,
}: {
  selectedCategories: StoreCategoryType | undefined;
  appStoreData: AppStoreDataType;
  setSelectedCategories: Dispatch<
    SetStateAction<StoreCategoryType | undefined>
  >;
  currentStrategy: AppStoreAppType | undefined;
}) {
  const [isLoading, setIsloading] = useState(false);
  const thisCategoryAppStoreData: AppStoreAppType[] =
    selectedCategories &&
    typeof appStoreData?.[selectedCategories] !== "undefined"
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
