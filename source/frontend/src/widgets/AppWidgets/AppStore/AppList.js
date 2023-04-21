import React from "react";
import InstalledAppCard from "./InstalledAppCard";
import AppCard from "./AppCard";
import { Row } from "antd";

export default function AppList({ selectedCategories, appStoreData }) {
  return (
    <Row>
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
    </Row>
  );
}
