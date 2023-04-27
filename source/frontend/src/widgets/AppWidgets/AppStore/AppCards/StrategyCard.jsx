import {deleteProfile, duplicateProfile, selectProfile} from "../../../../api/actions";
import {useBotDomainContext} from "../../../../context/config/BotDomainProvider";
import {useBotInfoContext} from "../../../../context/data/BotInfoProvider";
import AppActions from "./AppActions";
import {backendRoutes} from "../../../../constants/backendConstants";
import {useUploadToAppStore} from "../../../../context/data/AppStoreDataProvider";
import {useState} from "react";
import UploadApp from "./UploadApp";
import AppCard from "./AppCard";
import ProfileModal from "../../Modals/ProfileModal/ProfileModal";

export default function StrategyCard({
    app,
    setMouseHover,
    category,
    isMouseHover,
    isLoading,
    setIsloading
}) {
    const [uploadInfo, setUploadInfo] = useState({})
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
    async function handleDeleteProfile(setOpen) {
        setIsloading(true)
        await deleteProfile(botDomain, app.package_id, app.title, onSuccess, () => setIsloading(false))
        setOpen(false)
    }
    async function handleProfileDuplication(setOpen) {
        setIsloading(true)
        await duplicateProfile(botDomain, app.package_id, app.title, onSuccess, () => setIsloading(false))
        setOpen(false)
    }
    const uploadToAppStore = useUploadToAppStore()
    async function handleProfileUpload(setOpen) {
        uploadToAppStore({
            ...app,
            ...uploadInfo
        }, setIsloading)
        setOpen(false)
    }

    const additionalProfileInfo = botInfo?.profiles?.[app.package_id] || {}

    const currentAvatar = additionalProfileInfo?.profile?.avatar
    const avatarUrl = currentAvatar === "default_profile.png" ? `${
        botDomain + backendRoutes.staticImg
    }/${currentAvatar}` : `${
        botDomain + backendRoutes.profileMedia
    }/${
        additionalProfileInfo?.profile?.name?.replace(/ /g, "_")
    }/${currentAvatar}`

    function configureAppUpload() {
        return (
            <UploadApp setUploadInfo={setUploadInfo}
                uploadInfo={uploadInfo}
                app={app}/>
        )
    }
    return (
        <AppCard app={app}
            setMouseHover={setMouseHover}
            avatarUrl={avatarUrl}
            category={category}
            isMouseHover={isMouseHover}>
            <AppActions isMouseHover={isMouseHover}
                // configureDuplication={configureDuplication}
                configureUpload={configureAppUpload}
                handleSelect={handleSelectProfile}
                handleUninstall={handleDeleteProfile}
                handleUpload={handleProfileUpload}
                handleDuplication={handleProfileDuplication}
                otherActions={<ProfileModal/>}
                app={app}/>
        </AppCard>
    )
}
