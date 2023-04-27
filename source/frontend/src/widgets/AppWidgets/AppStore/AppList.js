import React, {useState} from "react";
import AppCards from "./AppCards/AppCards";
import {Grid} from "@mui/material";

export default function AppList({selectedCategories, appStoreData, setSelectedCategories}) {
    const [isLoading, setIsloading] = useState(false)

    const thisCategoryAppStoreData = appStoreData?.[selectedCategories] && Object.values(appStoreData[selectedCategories])
    const preSortedAppStoreData = thisCategoryAppStoreData?.sort((a, b) => ((b?.is_selected && 1) - (a?.is_selected && 1)))
    return preSortedAppStoreData && (
        <Grid container
            spacing={2}>
            {
            preSortedAppStoreData.map((app, index) => {
                return (
                    <AppCards key={
                            app.package_id + index
                        }
                        setSelectedCategories={setSelectedCategories}
                        app={app}
                        isLoading={isLoading}
                        setIsloading={setIsloading}/>
                )
            })
        } </Grid>
    );
}
