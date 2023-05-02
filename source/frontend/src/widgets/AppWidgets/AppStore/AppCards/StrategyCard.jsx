import {deleteProfile, duplicateProfile, selectProfile} from "../../../../api/actions";
import {useBotDomainContext} from "../../../../context/config/BotDomainProvider";
import {useBotInfoContext} from "../../../../context/data/BotInfoProvider";
import AppActions from "./AppActions/AppActions";
import {backendRoutes} from "../../../../constants/backendConstants";
import {useInstallProfile, useUploadToAppStore} from "../../../../context/data/AppStoreDataProvider";
import {useState} from "react";
import AppCard from "./AppCard";
import {strategyModeName} from "../AppStore";
import ProfileModalButton from "../../Modals/ProfileModal/ProfileModalButton";

export default function StrategyCard({
    app,
    setMouseHover,
    category,
    isMouseHover,
    isLoading,
    setIsloading,
    setSelectedCategories
}) {
    const [uploadInfo, setUploadInfo] = useState({})
    const [downloadInfo, setDownloadInfo] = useState({})
    const [cloneAppInfo, setCloneAppInfo] = useState({})
    const botDomain = useBotDomainContext()
    const botInfo = useBotInfoContext()
    function onSuccess() {
        setIsloading(false)
        // handleClose()
        // fetchBotInfo(true)
    }
    async function handleSelectProfile(setOpen) {
        setIsloading(true)
        await selectProfile(botDomain, app.package_id, app.title, onSuccess, () => setIsloading(false))
        setOpen(false)
    }
    const installProfile = useInstallProfile()
    async function handleDownloadProfile(setOpen) {
        installProfile({
            ...downloadInfo,
            ...app
        }, setIsloading, setOpen)
    }
    async function handleDeleteProfile(setOpen) {
        setIsloading(true)
        await deleteProfile(botDomain, app.package_id, app.title, onSuccess, () => setIsloading(false))
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
            onSuccess,
            onFail: () => setIsloading(false)
        })
        setOpen(false)
    }
    const profileDownloadUrl = botDomain + backendRoutes.exportProfile + app.package_id
    const uploadToAppStore = useUploadToAppStore()


    const additionalProfileInfo = botInfo ?. profiles ?. [app.package_id] || {}

    const currentAvatar = additionalProfileInfo ?. profile ?. avatar
    const avatarUrl = currentAvatar === "default_profile.png" ? `${
        botDomain + backendRoutes.staticImg
    }/${currentAvatar}` : `${
        botDomain + backendRoutes.profileMedia
    }/${
        additionalProfileInfo ?. profile ?. name ?. replace(/ /g, "_")
    }/${currentAvatar}`

    return (<AppCard app={app}
        setMouseHover={setMouseHover}
        avatarUrl={avatarUrl}
        category={category}
        isMouseHover={isMouseHover}
        cardActions={
            (<AppActions isMouseHover={isMouseHover}
                // configureDuplication={configureDuplication}
                setSelectedCategories={setSelectedCategories}
                onConfigure={
                    () => setSelectedCategories(strategyModeName)
                }
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
                handleDownload={handleDownloadProfile}
                infoContent={
                    (<div> {
                        app.description
                    } </div>)
                }
                handleDuplication={handleProfileDuplication}
                otherActions={
                    (<ProfileModalButton profile={additionalProfileInfo}
                        isCurrentProfile={
                            app.is_selected
                        }/>)
                }
                app={app}/>)
        }/>)
}
