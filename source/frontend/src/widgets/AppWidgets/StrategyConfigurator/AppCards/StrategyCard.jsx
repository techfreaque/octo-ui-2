import {deleteProfile, duplicateProfile, selectProfile} from "../../../../api/actions";
import {useBotDomainContext} from "../../../../context/config/BotDomainProvider";
import {useBotInfoContext} from "../../../../context/data/BotInfoProvider";
import AppActions from "./AppActions/AppActions";
import {backendRoutes} from "../../../../constants/backendConstants";
import {useInstallAnyAppPackage, useUploadToAppStore} from "../../../../context/data/AppStoreDataProvider";
import {useState} from "react";
import ProfileModalButton from "../../Modals/ProfileModal/ProfileModalButton";
import AppCardTemplate from "./AppCardTemplate";
import {useRestartBot} from "../../../../context/data/IsBotOnlineProvider";
import createNotification from "../../../../components/Notifications/Notification";
import {strategyModeName} from "../storeConstants";

export default function StrategyCard({
    app,
    setMouseHover,
    category,
    isMouseHover,
    isLoading,
    setIsloading,
    setSelectedCategories,
    didHoverOnce,
    uploadInfo,
    setUploadInfo,
    downloadInfo,
    setDownloadInfo
}) {
    const [cloneAppInfo, setCloneAppInfo] = useState({})
    const botDomain = useBotDomainContext()
    const botInfo = useBotInfoContext()
    const restartBot = useRestartBot()

    async function handleSelectProfile(setOpen) {
        function onSuccess() {
            setIsloading(false)
            createNotification(`Successfully selected ${
                app.title
            }`)
            setOpen(false)
            restartBot(true)
        }
        const onFail = (updated_data, update_url, result, msg, status) => {
            createNotification(`Failed to select ${
                app.title
            }`, "danger")
        }
        setIsloading(true)
        await selectProfile(botDomain, app.package_id, app.title, onSuccess, onFail)
    }
    const installAnyAppPackage = useInstallAnyAppPackage()
    async function handleDownloadApp(setOpen, otherApp) {
        const theApp = otherApp ? {
            ...otherApp,
            bug_fix_version: 0,
            major_version: 0,
            minor_version: 0
        } : app
        installAnyAppPackage(downloadInfo, theApp, setIsloading, setOpen)
    }
    async function handleDeleteProfile(setOpen) {
        setIsloading(true)
        await deleteProfile(botDomain, app.package_id, app.title, () => setIsloading(false), () => setIsloading(false))
        setOpen(false)
    }
    async function handleProfileDuplication(setOpen) {
        setIsloading(true)

        await duplicateProfile({
            botDomain,
            profileId: app.package_id,
            profileName: app.title,
            newProfileName: cloneAppInfo.newProfileName,
            selectNewProfile: cloneAppInfo.selectNewProfile,
            onSuccess: () => setIsloading(false),
            onFail: () => setIsloading(false)
        })
        setOpen(false)
    }
    const profileDownloadUrl = botDomain + backendRoutes.exportProfile + app.package_id
    const uploadToAppStore = useUploadToAppStore()


    const additionalProfileInfo = botInfo?.profiles?.[app.package_id] || {}

    const currentAvatar = additionalProfileInfo?.profile?.avatar
    const avatarUrl = currentAvatar === "default_profile.png" ? `${
        botDomain + backendRoutes.staticImg
    }/${currentAvatar}` : `${
        botDomain + backendRoutes.profileMedia
    }/${
        additionalProfileInfo?.profile?.name?.replace(/ /g, "_")
    }/${currentAvatar}`

    return (
        <AppCardTemplate app={app}
            setMouseHover={setMouseHover}
            avatarUrl={avatarUrl}
            category={category}
            isMouseHover={isMouseHover}
            cardActions={
                (
                    <AppActions isMouseHover={isMouseHover}
                        // configureDuplication={configureDuplication}
                        setSelectedCategories={setSelectedCategories}
                        onConfigure={
                            () => setSelectedCategories(strategyModeName)
                        }
                        didHoverOnce={didHoverOnce}
                        downloadInfo={downloadInfo}
                        handleSelect={handleSelectProfile}
                        handleUninstall={handleDeleteProfile}
                        setCloneAppInfo={setCloneAppInfo}
                        cloneAppInfo={cloneAppInfo}
                        handleUpload={
                            (setOpen) => uploadToAppStore(app, uploadInfo, profileDownloadUrl, setIsloading, setOpen)
                        }
                        setUploadInfo={setUploadInfo}
                        setDownloadInfo={setDownloadInfo}
                        uploadInfo={uploadInfo}
                        exportUrl={
                            backendRoutes.exportProfile + app.package_id
                        }
                        handleDownload={handleDownloadApp}
                        infoContent={
                            (
                                <div> {
                                    app.description
                                } </div>
                            )
                        }
                        handleDuplication={handleProfileDuplication}
                        otherActions={
                            (
                                <ProfileModalButton profile={additionalProfileInfo}
                                    isCurrentProfile={
                                        app.is_selected
                                    }/>
                            )
                        }
                        app={app}/>
                )
            }/>
    )
}
