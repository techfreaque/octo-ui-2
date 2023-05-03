import AppActions from "./AppActions/AppActions";
import {useUploadToAppStore} from "../../../../context/data/AppStoreDataProvider";
import {useState} from "react";
import AppCard from "./AppCard";
import {strategyModeSettingsName} from "../AppStore";
import {useBotDomainContext} from "../../../../context/config/BotDomainProvider";
import {backendRoutes} from "../../../../constants/backendConstants";
import {useBotInfoContext} from "../../../../context/data/BotInfoProvider";
import {updateConfig} from "../../../../api/actions";
import createNotification from "../../../../components/Notifications/Notification";

export default function TradingModeCard({
    app,
    setMouseHover,
    category,
    isMouseHover,
    isLoading,
    setIsloading,
    setSelectedCategories,
    currentStrategy,
    apps
}) {
    const [uploadInfo, setUploadInfo] = useState({})
    const botDomain = useBotDomainContext()
    const botInfo = useBotInfoContext()
    const profileDownloadUrl = botDomain + backendRoutes.exportApp + app.package_id

    const selectedApps = apps.filter(app => app.is_selected)

    const uploadToAppStore = useUploadToAppStore()
    function onSuccess() {
        createNotification(`Successfully selected ${
            app.title
        }`)
        // handleClose()
        // fetchBotInfo(true)
    }
    function onFail() {
        createNotification("Failed to select trading mode", "danger", `Not able to select ${
            app.title
        }`)
    }
    async function handleSelectStrategyMode(setOpen) {
        const selectedRequirements = app?.requirements
        setIsloading(true)
        const configUpdate = {
            trading_config: {},
            evaluator_config: {},
            removed_elements: [],
            restart_after_save: true
        }
        // disable previous apps
        if (selectedApps?.[0]) {
            configUpdate.trading_config[selectedApps?.[0].package_id] = "false"
            if (selectedApps?.[0]?.requirements?.length) {
                selectedApps[0].requirements.forEach(requirement => configUpdate.evaluator_config[requirement] = false)
            }
        }
        // enable selected apps
        configUpdate.trading_config[app.package_id] = "true"
        if (selectedRequirements?.length) {
            selectedRequirements.forEach(requirement => configUpdate.evaluator_config[requirement] = true)
        }
        await updateConfig(botDomain, configUpdate, botInfo.current_profile.profile.name, onFail, onSuccess)
        setIsloading(false)
        setOpen(false)

    }
    return (<AppCard app={app}
        setMouseHover={setMouseHover}
        avatarUrl={"https://tradeciety.com/hubfs/Imported_Blog_Media/GBPUSDH45.png"}
        category={category}
        isMouseHover={isMouseHover}
        cardActions={
            (<AppActions isMouseHover={isMouseHover}
                setSelectedCategories={setSelectedCategories}
                infoContent={
                    app.description
                }
                isReadOnlyStrategy={currentStrategy?.is_from_store}
                onConfigure={
                    () => setSelectedCategories(strategyModeSettingsName)
                }
                handleSelect={handleSelectStrategyMode}
                // handleUpload={
                //     (setOpen) => uploadToAppStore(app, uploadInfo, profileDownloadUrl, setIsloading, setOpen)
                // }
                setUploadInfo={setUploadInfo}
                uploadInfo={uploadInfo}
                app={app}/>)
        }/>)
}
