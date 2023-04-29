import {deleteProfile, duplicateProfile, selectProfile} from "../../../../api/actions";
import {useBotDomainContext} from "../../../../context/config/BotDomainProvider";
import {useBotInfoContext} from "../../../../context/data/BotInfoProvider";
import AppActions from "./AppActions/AppActions";
import {backendRoutes} from "../../../../constants/backendConstants";
import {useUploadToAppStore} from "../../../../context/data/AppStoreDataProvider";
import {useState} from "react";
import AppCard from "./AppCard";
import ProfileModal from "../../Modals/ProfileModal/ProfileModal";
import {strategyModeName} from "../AppStore";
import {getFile} from "../../../../api/fetchAndStoreFromBot";

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
        const profileDownloadUrl = botDomain + backendRoutes.exportProfile + app.package_id
        function uploadProfile(profileZip) {
            uploadToAppStore({
                ...app,
                ...uploadInfo
            }, profileZip, setIsloading)
            setOpen(false)
        }
        getFile(profileDownloadUrl, uploadProfile)
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
                handleSelect={handleSelectProfile}
                handleUninstall={handleDeleteProfile}
                handleUpload={handleProfileUpload}
                setUploadInfo={setUploadInfo}
                uploadInfo={uploadInfo}
                infoContent={
                    (<div> {
                        app.description
                    } </div>)
                }
                handleDuplication={handleProfileDuplication}
                otherActions={
                    (<>
                        <ProfileModal profile={additionalProfileInfo}
                            isCurrentProfile={
                                app.is_selected
                            }/>
                    </>)
                }
                app={app}/>)
        }/>)
}
