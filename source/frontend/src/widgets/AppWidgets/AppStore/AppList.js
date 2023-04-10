import React from "react";
import { Box } from "@mui/material";
import InstalledAppCard from "./InstalledAppCard";
import AppCard from "./AppCard";

export default function AppList({ selectedCategories, appStoreData }) {
  return (
    <Box>
      {selectedCategories.includes("installed")
        ? Object.values(appStoreData.tentacles).map((tentacle, index) => (
            <InstalledAppCard key={tentacle.name + index} tentacle={tentacle} />
          ))
        : appStoreData.available_apps.apps.map((app, index) => {
            return (
              (selectedCategories.includes("all") ||
                app.categories.some((appCategory) =>
                  selectedCategories.includes(appCategory)
                )) && <AppCard key={app.name + index} app={app} />
            );
          })}
    </Box>
  );
}
