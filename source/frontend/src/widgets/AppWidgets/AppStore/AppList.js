import React, {useState} from "react";
import AppCard from "./AppCards/AppCard";
import {Grid} from "@mui/material";
import {ErrorBoundary} from "../../WidgetManagement/RenderAppWidgets";

export default function AppList({selectedCategories, appStoreData, setSelectedCategories, currentStrategy}) {
    const [isLoading, setIsloading] = useState(false)

    const thisCategoryAppStoreData = appStoreData?.[selectedCategories] && Object.values(appStoreData[selectedCategories])
    const preSortedAppStoreData = thisCategoryAppStoreData?.sort((a, b) => ((b?.is_selected ? 1 : 0) - (a?.is_selected ? 1 : 0)))

    return preSortedAppStoreData && (<Grid container
        spacing={2}> {
        preSortedAppStoreData.map((app, index) => {
            return (<ErrorBoundary key={
                        app.package_id + index
                    }>
                <AppCard
                    currentStrategy={currentStrategy}
                    setSelectedCategories={setSelectedCategories}
                    app={app}
                    apps={preSortedAppStoreData}
                    isLoading={isLoading}
                    setIsloading={setIsloading}/>
            </ErrorBoundary>)
        })
    } </Grid>);
}
