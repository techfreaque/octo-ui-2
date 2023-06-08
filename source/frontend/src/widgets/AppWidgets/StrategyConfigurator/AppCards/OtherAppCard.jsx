import AppActions from "./AppActions/AppActions";
import {useInstallAnyAppPackage, useUnInstallAppPackage, useUploadToAppStore} from "../../../../context/data/AppStoreDataProvider";
import {useBotDomainContext} from "../../../../context/config/BotDomainProvider";
import {backendRoutes} from "../../../../constants/backendConstants";
import AppCardTemplate from "./AppCardTemplate";


export default function OtherAppCard({
    app,
    setMouseHover,
    category,
    isMouseHover,
    setIsloading,
    setSelectedCategories,
    didHoverOnce,
    onConfigure,
    handleSelect,
    isReadOnlyStrategy,
    uploadInfo,
    setUploadInfo,
    downloadInfo,
    setDownloadInfo
}) {
    const botDomain = useBotDomainContext()
    const profileDownloadUrl = botDomain + backendRoutes.exportApp + app.origin_package
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
    const uninstallAppPackage = useUnInstallAppPackage()
    async function handleUninstallApp(setOpen) {
        uninstallAppPackage(app, setIsloading, setOpen)
    }
    const uploadToAppStore = useUploadToAppStore()
    return (
        <AppCardTemplate app={app}
            setMouseHover={setMouseHover}
            avatarUrl={"https://tradeciety.com/hubfs/Imported_Blog_Media/GBPUSDH45.png"}
            category={category}
            isMouseHover={isMouseHover}
            cardActions={
                (
                    <AppActions isMouseHover={isMouseHover}
                        setSelectedCategories={setSelectedCategories}
                        infoContent={
                            app.description
                        }
                        handleUninstall={handleUninstallApp}
                        isReadOnlyStrategy={isReadOnlyStrategy}
                        onConfigure={onConfigure}
                        downloadInfo={downloadInfo}
                        didHoverOnce={didHoverOnce}
                        setDownloadInfo={setDownloadInfo}
                        handleDownload={handleDownloadApp}
                        handleSelect={handleSelect}
                        handleUpload={
                            (setOpen) => uploadToAppStore(app, uploadInfo, profileDownloadUrl, setIsloading, setOpen)
                        }
                        setUploadInfo={setUploadInfo}
                        uploadInfo={uploadInfo}
                        app={app}/>
                )
            }/>
    )
}
