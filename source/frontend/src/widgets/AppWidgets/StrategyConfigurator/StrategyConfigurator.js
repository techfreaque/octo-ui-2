import {useEffect, useMemo, useState} from "react";
import {useAppStoreDataContext, useAppStoreUserContext, useFetchAppStoreData} from "../../../context/data/AppStoreDataProvider";
import AppList from "./AppList";
import AntSidebar from "../../../components/Sidebars/AntSidebar/AntSidebar";
import ProfileAvatar from "../Stats/ProfileAvatar";
import {useBotInfoContext} from "../../../context/data/BotInfoProvider";
import "./AppCards/appRatingStyle.css"
import {Typography} from "antd";
import {tentacleConfigType, useFetchCurrentTradingTentaclesConfig, useTentaclesConfigContext} from "../../../context/config/TentaclesConfigProvider";
import {useUpdateHiddenBacktestingMetadataColumnsContext} from "../../../context/data/BotPlottedElementsProvider";
import {displayStyles, generateTradingConfigTabs, replaceUppercaseWithSpace, strategyFlowMakerName} from "../Configuration/TentaclesConfig";
import {
    appPackagesName,
    hiddenCategories,
    strategyModeName,
    strategyModeSettingsName,
    strategyName
} from "./storeConstants";
import {BranchesOutlined} from "@ant-design/icons";
import StrategyFlowBuilder from "../Configuration/StrategyFlowBuilder/StrategyFlowBuilder";
import BuildingBlocksSidebar from "../Configuration/StrategyFlowBuilder/BuildingBlocksSideBar";


export default function AppStore() {
    const appStoreData = useAppStoreDataContext();
    const botInfo = useBotInfoContext();
    const appStoreUser = useAppStoreUserContext()
    const isLoggedIn = Boolean(appStoreUser?.token)
    const [selectedCategories, setSelectedCategories] = useState();
    const [tradingConfigTabs, setTradingConfigTabs] = useState();
    const _useFetchAppStoreData = useFetchAppStoreData();
    const fetchCurrentTentaclesConfig = useFetchCurrentTradingTentaclesConfig()
    useEffect(() => {
        _useFetchAppStoreData();
        fetchCurrentTentaclesConfig();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [botInfo, isLoggedIn]);
    const currentTentaclesConfig = useTentaclesConfigContext()
    const setHiddenMetadataColumns = useUpdateHiddenBacktestingMetadataColumnsContext()
    const currentTentaclesTradingConfig = currentTentaclesConfig?.[tentacleConfigType.tradingTentacles]
    const isFlowMode = botInfo?.trading_mode_name === strategyFlowMakerName
    useEffect(() => {
        if (currentTentaclesTradingConfig && ! isFlowMode) {
            setTradingConfigTabs(generateTradingConfigTabs({displayStyle: displayStyles.sidebar, userInputs: currentTentaclesTradingConfig, setHiddenMetadataColumns}))
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTentaclesTradingConfig])

    return useMemo(() => {
        const currentStrategy = appStoreData?.Strategy ? appStoreData.Strategy?.[Object.keys(appStoreData.Strategy).filter(strategy => (appStoreData.Strategy[strategy].is_selected))?.[0]] : {}
        const availableCategories = appStoreData && (Object.keys(appStoreData)?.filter(category => (!hiddenCategories.includes(category))) || [])
        const content = (
            <AppList selectedCategories={selectedCategories}
                currentStrategy={currentStrategy}
                setSelectedCategories={setSelectedCategories}
                appStoreData={appStoreData}/>
        )
        const menuItems = [
            ...(availableCategories?.filter(category => (category === strategyName || category === strategyModeName))?.map(categoryName => {
                if (categoryName === strategyName) {
                    return {
                        label: botInfo?.current_profile?.profile?.name,
                        key: categoryName,
                        content,
                        icon: (
                            <ProfileAvatar marginRight="5px"/>
                        )
                    }
                } else if (categoryName === strategyModeName) {
                    return {
                        label: categoryName,
                        key: categoryName,
                        content,
                        icon: <BranchesOutlined style={
                            {fontSize: "21px"}
                        }/>
                    }
                } else {
                    return {label: categoryName, content, key: categoryName}
                }
            }) || []),
            {
                label: isFlowMode ? replaceUppercaseWithSpace(botInfo.trading_mode_name) : strategyModeSettingsName,
                key: isFlowMode ? botInfo.trading_mode_name : strategyModeSettingsName,
                antIcon: "RocketOutlined",
                dontScroll: true,
                noPadding: true,
                content: isFlowMode ? (
                    <StrategyFlowBuilder tradingModeKey={strategyFlowMakerName}/>
                ) : (
                    <Typography.Title style={
                        {
                            marginLeft: "15px",
                            marginTop: "20px"
                        }
                    }>
                        Select a setting category from the sidebar
                    </Typography.Title>
                ),
                children: isFlowMode ? [
                    {
                        label: (
                            <BuildingBlocksSidebar/>),
                        key: "flowModeSidebar",
                        labelIsContent: true,
                        order: -1
                    }
                ] : [
                    ...(tradingConfigTabs || []),
                ]
            }, {
                label: "Other Apps",
                key: "other_apps",
                antIcon: "AppstoreAddOutlined",
                dontScroll: true,
                noPadding: true,
                content: (
                    <Typography.Title style={
                        {
                            marginLeft: "15px",
                            marginTop: "20px"
                        }
                    }>
                        Select a app category from the sidebar
                    </Typography.Title>
                ),
                children: availableCategories?.filter(category => (category !== strategyName && category !== strategyModeName && category !== appPackagesName))?.map(categoryName => ({label: categoryName, content, key: categoryName}))
            },
        ]
        return (
            <AntSidebar menuItems={menuItems}
                currentlySelectedMenu={selectedCategories}
                defaultSelected={
                    (currentTentaclesTradingConfig?.[botInfo?.trading_mode_name] ? botInfo.trading_mode_name : botInfo?.trading_mode_name) || strategyModeSettingsName
                }
                setCurrentlySelectedMenu={setSelectedCategories}/>
        )
    }, [
        appStoreData,
        botInfo?.current_profile?.profile?.name,
        botInfo?.trading_mode_name,
        currentTentaclesTradingConfig,
        isFlowMode,
        selectedCategories,
        tradingConfigTabs
    ])
}
