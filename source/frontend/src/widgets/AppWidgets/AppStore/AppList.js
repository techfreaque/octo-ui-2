import React, {useState} from "react";
import AppCards from "./AppCards/AppCards";
import {Grid} from "@mui/material";

export default function AppList({selectedCategories, appStoreData, setSelectedCategories, currentStrategy}) {
    const [isLoading, setIsloading] = useState(false)

    const thisCategoryAppStoreData = appStoreData?.[selectedCategories] && Object.values(appStoreData[selectedCategories])
    const preSortedAppStoreData = thisCategoryAppStoreData?.sort((a, b) => ((b?.is_selected ? 1 : 0) - (a?.is_selected ? 1:0)))

    return preSortedAppStoreData && (
        <Grid container
            spacing={2}>
            {
            preSortedAppStoreData.map((app, index) => {
                return (
                    <AppCards key={
                            app.package_id + index
                        }
                        currentStrategy={currentStrategy}
                        setSelectedCategories={setSelectedCategories}
                        app={app}
                        apps={preSortedAppStoreData}
                        isLoading={isLoading}
                        setIsloading={setIsloading}/>
                )
            })
        } </Grid>
    );
}
