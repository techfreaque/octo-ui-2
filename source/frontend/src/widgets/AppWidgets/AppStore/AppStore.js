import {useEffect, useState} from "react";
import {useAppStoreDataContext, useAppStoreUserContext, useFetchAppStoreData} from "../../../context/data/AppStoreDataProvider";
import AppList from "./AppList";
import AntSidebar from "../../../components/Sidebars/AntSidebar/AntSidebar";
import ProfileAvatar from "../Stats/ProfileAvatar";
import {useBotInfoContext} from "../../../context/data/BotInfoProvider";
import "./AppCards/appRatingStyle.css"
import {Typography} from "antd";
import {tentacleConfigType, useFetchCurrentTradingTentaclesConfig, useSaveTentaclesConfig, useTentaclesConfigContext} from "../../../context/config/TentaclesConfigProvider";
import {useUpdateHiddenBacktestingMetadataColumnsContext} from "../../../context/data/BotPlottedElementsProvider";
import {displayStyles, saveUserInputs, generateTradingConfigTabs} from "../Configuration/TentaclesConfig";
import {useIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";

const hiddenCategories = ["Legacy Strategy"]
export const strategyModeSettingsName = "Strategy Mode Settings"
export const strategyName = "Strategy"
export const strategyModeName = "Strategy Mode"

export default function AppStore() {
    const appStoreData = useAppStoreDataContext();
    const botInfo = useBotInfoContext();
    const isOnline = useIsBotOnlineContext();
    const appStoreUser = useAppStoreUserContext()
    const isLoggedIn = Boolean(appStoreUser?.token)
    const availableCategories = appStoreData && (Object.keys(appStoreData)?.filter(category => (! hiddenCategories.includes(category))) || [])
    const [selectedCategories, setSelectedCategories] = useState();
    const [tradingConfigTabs, setTradingConfigTabs] = useState();
    const [isSaving, setIsSaving] = useState(false);
    const _useFetchAppStoreData = useFetchAppStoreData();
    const fetchCurrentTentaclesConfig = useFetchCurrentTradingTentaclesConfig()
    useEffect(() => {
        _useFetchAppStoreData();
        fetchCurrentTentaclesConfig();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [botInfo, isLoggedIn]);
    const currentTentaclesConfig = useTentaclesConfigContext()
    const saveTentaclesConfig = useSaveTentaclesConfig()
    function handleUserInputSave() {
        saveUserInputs((newConfigs) => saveTentaclesConfig(newConfigs, setIsSaving, true, true), setIsSaving, "tradingConfig")
    }
    const setHiddenMetadataColumns = useUpdateHiddenBacktestingMetadataColumnsContext()
    const currentStrategy = appStoreData.Strategy ? appStoreData.Strategy?.[Object.keys(appStoreData.Strategy).filter(strategy => (appStoreData.Strategy[strategy].is_selected))?.[0]] : {}
    const currentTentaclesTradingConfig = currentTentaclesConfig?.[tentacleConfigType.tradingTentacles]

    useEffect(() => {
        if (currentTentaclesTradingConfig) {
            setTradingConfigTabs(generateTradingConfigTabs({displayStyle: displayStyles.sidebar, userInputs: currentTentaclesTradingConfig, setHiddenMetadataColumns}))
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTentaclesTradingConfig])

    const content = (<AppList selectedCategories={selectedCategories}
        currentStrategy={currentStrategy}
        setSelectedCategories={setSelectedCategories}
        appStoreData={appStoreData}/>)
    const menuItems = [
        ...(availableCategories?.filter(category => (category === strategyName || category === strategyModeName))?.map(categoryName => {
            if (categoryName === strategyName) {
                return {
                    label: botInfo?.current_profile?.profile?.name,
                    key: categoryName,
                    content,
                    icon: (<ProfileAvatar marginRight="5px"/>)
                }
            } else if (categoryName === strategyModeName) {
                return {label: categoryName, key: categoryName, content, antIcon: "BranchesOutlined"}
            } else {
                return {label: categoryName, content, key: categoryName}
            }
        }) || []),
        {
            label: strategyModeSettingsName,
            key: strategyModeSettingsName,
            antIcon: "ControlOutlined",
            dontScroll: true,
            noPadding: true,
            content: (<Typography.Title style={
                {
                    marginLeft: "15px",
                    marginTop: "20px"
                }
            }>
                Select a setting category from the sidebar
            </Typography.Title>),
            children: [
                ...(tradingConfigTabs || []), {
                    label: "Save Settings",
                    key: "saveSettings",
                    antIcon: "SaveOutlined",
                    onClick: handleUserInputSave,
                    disabled: isSaving || ! isOnline
                }
            ]
        },
        {
            label: "Other Apps",
            key: "other_apps",
            antIcon: "AppstoreAddOutlined",
            dontScroll: true,
            noPadding: true,
            content: (<Typography.Title style={
                {
                    marginLeft: "15px",
                    marginTop: "20px"
                }
            }>
                Select a app category from the sidebar
            </Typography.Title>),
            children: availableCategories?.filter(category => (category !== strategyName && category !== strategyModeName))?.map(categoryName=>({label: categoryName, content, key: categoryName}))
        },
    ]
    return (<AntSidebar menuItems={menuItems}
        currentlySelectedMenu={selectedCategories}
        defaultSelected={
            (currentTentaclesTradingConfig?.[botInfo?.trading_mode_name] ? botInfo.trading_mode_name : botInfo?.trading_mode_name) || strategyModeSettingsName
        }
        setCurrentlySelectedMenu={setSelectedCategories}/>)
}
