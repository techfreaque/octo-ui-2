import { Grid } from "@mui/material";
import React from "react";
import {
  useAppStoreDataContext,
  useFetchAppStoreData,
} from "../../../context/data/AppStoreDataProvider";
import AppList from "./AppList";
import Categories from "./Categories";

export default function AppStore() {
  const appStoreData = useAppStoreDataContext();

  const [selectedCategories, setSelectedCategories] = React.useState(["all"]);

  const handleCategoryClick = (event, index) => {
    if (
      index !== "all" &&
      index !== "installed" &&
      !selectedCategories.includes(index) &&
      !selectedCategories.includes("all") &&
      !selectedCategories.includes("installed")
    ) {
      setSelectedCategories((prevIndex) => {
        const newCategories = prevIndex.concat(index);
        return newCategories;
      });
    } else if (!selectedCategories.includes(index)) {
      setSelectedCategories([index]);
    } else {
      setSelectedCategories((prevIndex) => {
        const newCategories = prevIndex.filter((item) => item !== index);
        return newCategories;
      });
    }
  };
  const _useFetchAppStoreData = useFetchAppStoreData();
  React.useEffect(() => {
    _useFetchAppStoreData();
  }, [_useFetchAppStoreData]);

  return (
    appStoreData &&
    appStoreData.available_apps && (
      <Grid container spacing={0}>
        <Grid item xs={12} md={4} lg={3}>
          <Categories
            categories={appStoreData.available_apps.categories}
            handleCategoryClick={handleCategoryClick}
            selectedCategories={selectedCategories}
          />
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <AppList
            selectedCategories={selectedCategories}
            appStoreData={appStoreData}
          />
        </Grid>
      </Grid>
    )
  );
}
