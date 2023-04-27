import AppActions from "./AppActions";
import {useUploadToAppStore} from "../../../../context/data/AppStoreDataProvider";
import {useState} from "react";
import UploadApp from "./UploadApp";
import AppCard from "./AppCard";

export default function TradingModeCard({
    app,
    setMouseHover,
    category,
    isMouseHover,
    isLoading,
    setIsloading
}) {
    const uploadToAppStore = useUploadToAppStore()
    const [uploadInfo, setUploadInfo] = useState({})
    async function handleProfileUpload(setOpen) {
        uploadToAppStore({
            ...app,
            ...uploadInfo
        }, setIsloading)
        setOpen(false)
    }
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
            avatarUrl={"https://tradeciety.com/hubfs/Imported_Blog_Media/GBPUSDH45.png"}
            category={category}
            isMouseHover={isMouseHover}>
            <AppActions isMouseHover={isMouseHover}
                handleUpload={handleProfileUpload}
                configureUpload={configureAppUpload}
                app={app}/>
        </AppCard>
    )
}
