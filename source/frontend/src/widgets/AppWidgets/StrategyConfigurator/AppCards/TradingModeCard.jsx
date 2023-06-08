import {useBotDomainContext} from "../../../../context/config/BotDomainProvider";
import {useBotInfoContext} from "../../../../context/data/BotInfoProvider";
import {updateConfig, updateProfileInfo} from "../../../../api/actions";
import createNotification from "../../../../components/Notifications/Notification";
import {useRestartBot} from "../../../../context/data/IsBotOnlineProvider";
import OtherAppCard from "./OtherAppCard";
import { strategyModeSettingsName } from "../storeConstants";

export default function TradingModeCard({
    app,
    setMouseHover,
    category,
    isMouseHover,
    isLoading,
    setIsloading,
    setSelectedCategories,
    currentStrategy,
    apps,
    didHoverOnce,
    uploadInfo,
    setUploadInfo,
    downloadInfo,
    setDownloadInfo
}) {
    const botInfo = useBotInfoContext()
    const restartBot = useRestartBot()
    const botDomain = useBotDomainContext()

    const selectedApps = apps.filter(app => app.is_selected)
    const newlySelectedRequirements = app?.requirements

    async function handleSelectStrategyMode(setOpen) {
        function onFail() {
            createNotification("Failed to select trading mode", "danger", `Not able to select ${
                app.title
            }`)
        }
        function onSuccessSetRequirements(setOpen) {
            createNotification(`Successfully selected ${
                app.title
            }`)
            setOpen(false)
            restartBot(true)
        }
        function onSuccessSelection(setOpen) {
            updateProfileInfo(botDomain, {
                id: botInfo.current_profile.profile.id,
                required_trading_tentacles: [
                    app.package_id,
                    ...(newlySelectedRequirements || []),
                ]
            }, onFail, () => onSuccessSetRequirements(setOpen))
        }
        setIsloading(true)
        const configUpdate = {
            trading_config: {},
            evaluator_config: {},
            global_config: {},
            removed_elements: [],
            restart_after_save: false
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
        if (newlySelectedRequirements?.length) {

            newlySelectedRequirements.forEach(requirement => configUpdate.evaluator_config[requirement] = true)
        }
        await updateConfig(botDomain, configUpdate, botInfo.current_profile.profile.name, onFail, () => onSuccessSelection(setOpen))
        setIsloading(false)
        setOpen(false)
    }
    return (
        <OtherAppCard app={app}
            isLoading={isLoading}
            setIsloading={setIsloading}
            setMouseHover={setMouseHover}
            category={category}
            didHoverOnce={didHoverOnce}
            setSelectedCategories={setSelectedCategories}
            isMouseHover={isMouseHover}
            onConfigure={
                () => setSelectedCategories(strategyModeSettingsName)
            }
            handleSelect={handleSelectStrategyMode}
            isReadOnlyStrategy={
                currentStrategy?.is_from_store
            }
            uploadInfo={uploadInfo}
            setUploadInfo={setUploadInfo}
            downloadInfo={downloadInfo}
            setDownloadInfo={setDownloadInfo}/>


    )
}

// {/* <AppCardTemplate app={app}
//     setMouseHover={setMouseHover}
//     avatarUrl={"https://tradeciety.com/hubfs/Imported_Blog_Media/GBPUSDH45.png"}
//     category={category}
//     isMouseHover={isMouseHover}
//     cardActions={
//         (
//             <AppActions isMouseHover={isMouseHover}
//                 setSelectedCategories={setSelectedCategories}
//                 infoContent={
//                     app.description
//                 }
//                 isReadOnlyStrategy={
//                     currentStrategy ?. is_from_store
//                 }
//                 onConfigure={
//                     () => setSelectedCategories(strategyModeSettingsName)
//                 }
//                 downloadInfo={downloadInfo}
//                 didHoverOnce={didHoverOnce}
//                 setDownloadInfo={setDownloadInfo}

//                 handleDownload={handleDownloadApp}

//                 handleSelect={handleSelectStrategyMode}
//                 handleUpload={
//                     (setOpen) => uploadToAppStore(app, uploadInfo, profileDownloadUrl, setIsloading, setOpen)
//                 }
//                 setUploadInfo={setUploadInfo}
//                 uploadInfo={uploadInfo}
//                 app={app}/>
//         )
//     }/> */}
