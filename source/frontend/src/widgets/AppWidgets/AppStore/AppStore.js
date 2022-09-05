import { Box, Grid } from "@mui/material";
import * as React from "react";
import AppCard from "./AppCard";
import Categories from "./Categories";

const defaultAppStoreSources = [
  {
    name: "Matrix-Repo",
    description: "This is a repo full of OctoBot apps",
    url: "https://github.com/techfreaque/OctoBot-Tentacles/blob/master/okteto-stack.yaml?raw=true",
  },
  {
    name: "Another Repo without a server",
    description: "This is a repo full of OctoBot apps",
    apps: [
      {
        name: "Sample Octobot Tentacle",
        description: "This is a sample OctoBot app",
        url: "https://github.com/techfreaque/OctoBot-Tentacles/blob/master/okteto-stack.yaml?raw=true",
        categories: ["UI", "Strategies"],
      },
      {
        name: "Sample Octobot Tentacle",
        description: "This is a sample OctoBot app",
        url: "https://github.com/techfreaque/OctoBot-Tentacles/blob/master/okteto-stack.yaml?raw=true",
        categories: ["UI", "Strategies"],
      },
      {
        name: "Sample Octobot Tentacle",
        description: "This is a sample OctoBot app",
        url: "https://github.com/techfreaque/OctoBot-Tentacles/blob/master/okteto-stack.yaml?raw=true",
        categories: ["UI", "Strategies"],
      },
    ],
  },
];

function fetchAppListFromRepo() {
  return [];
}

function fetchAppstoreDataFromRepos() {
  const appStoreData = { categories: {}, apps: [] };
  defaultAppStoreSources.forEach((repo) => {
    const appList = repo.url ? fetchAppListFromRepo(repo) : repo.apps;
    appList.forEach((app) => {
      appStoreData.apps.push({
        name: app.name,
        description: app.description,
        url: app.url,
        categories: app.categories,
      });
      app.categories.forEach((category) => {
        appStoreData.categories[category] = appStoreData.categories[category]
          ? appStoreData.categories[category]
          : { title: category };
      });
    });
  });
  return appStoreData;
}

export default function AppStore() {
  const [appStoreData, setAppStoreData] = React.useState({});
  React.useEffect(() => {
    const _appStoreData = fetchAppstoreDataFromRepos();
    setAppStoreData(_appStoreData);
  }, []);
  return (
    <Grid container spacing={0}>
      <Grid xs={12} md={4} lg={3}>
        <Categories categories={appStoreData.categories} />
      </Grid>
      <Grid xs={12} md={8} lg={9}>
        <Box>
          {appStoreData.apps &&
            appStoreData.apps.map((app) => {
              return <AppCard app={app} />;
            })}
        </Box>
      </Grid>
    </Grid>
  );
}
