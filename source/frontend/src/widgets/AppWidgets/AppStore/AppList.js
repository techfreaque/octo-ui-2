import React from "react";

import AppCard from "./AppCards/AppCard";
import {Grid} from "@mui/material";

export default function AppList({selectedCategories, appStoreData}) {
    const thisCategoryAppStoreData = appStoreData ?. [selectedCategories] && Object.values(appStoreData[selectedCategories])
    const preSortedAppStoreData = thisCategoryAppStoreData?.sort((a, b) => ((b?.is_selected && 1) - (a?.is_selected && 1)))
    return preSortedAppStoreData && (
        <Grid container
            spacing={2}>
            {
            preSortedAppStoreData.map((app, index) => {
                return (
                    <AppCard key={
                            app.package_id + index
                        }
                        app={app}/>
                )
            })
        } </Grid>
    );
}

// {selectedCategories.includes("installed")
// ? Object.values(appStoreData.tentacles).map((tentacle, index) => (
//       <InstalledAppCard key={tentacle.name + index} tentacle={tentacle} />
//     ))
// :
