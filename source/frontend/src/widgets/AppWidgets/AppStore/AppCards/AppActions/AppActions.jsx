import {Popconfirm} from "antd";
import AntButton, {buttonTypes, buttonVariants} from "../../../../../components/Buttons/AntButton";
import {useState} from "react";
import AppInfoModal from "./AppInfoModal";
import SelectApp from "./SelectApp";
import ConfigureApp from "./ConfigureApp";
import CloneApp from "./CloneApp/CloneApp";
import UninstallApp from "./UninstallApp";
import AppUpDownload from "./UpDownloadApp/AppUpDownload";
import AppIconButton from "../../../../../components/Buttons/AppIconButton";
import ExportApp from "./ExportApp";


export default function AppActions({
    app,
    handleSelect,
    handleDuplication,
    handleUninstall,
    isMouseHover,
    handleUpload,
    setCloneAppInfo,
    cloneAppInfo,
    setUploadInfo,
    uploadInfo,
    otherActions,
    infoContent,
    onConfigure,
    exportUrl,
    handleDownload,
    setDownloadInfo,
    downloadInfo,
    isReadOnlyStrategy
}) { // const = isMouseHover = true
    const buttonStyle = {
        display: "flex",
        flexWrap: "wrap",
        // minHeight: "76px"
    }
    return (<div style={
        {
            width: '100%',
            margin: "auto"
        }
    }>
        <div style={
            {
                width: "100%",
                position: "relative"
            }
        }>
            <div style={
                (app?.is_selected ? {
                    ...buttonStyle,
                    marginTop: "20px"
                } : (isMouseHover ? {
                    ...buttonStyle,
                    // marginTop: "20px",
                    // position: "absolute",
                    // top: "auto",
                    // bottom: "auto",
                    margin: "auto",
                    // left: "0px",
                    justifyContent: "center"
                } : {
                    ...buttonStyle,
                    display: "none"
                }))
            }>
                <OnHoverActions handleSelect={handleSelect}
                    setUploadInfo={setUploadInfo}
                    setDownloadInfo={setDownloadInfo}
                    uploadInfo={uploadInfo}
                    setCloneAppInfo={setCloneAppInfo}
                    cloneAppInfo={cloneAppInfo}
                    downloadInfo={downloadInfo}
                    onConfigure={onConfigure}
                    handleDownload={handleDownload}
                    handleDuplication={handleDuplication}
                    handleUninstall={handleUninstall}
                    handleUpload={handleUpload}
                    otherActions={otherActions}
                    infoContent={infoContent}
                    isReadOnlyStrategy={isReadOnlyStrategy}
                    exportUrl={exportUrl}
                    app={app}/>
            </div>
            <div style={
                (isMouseHover | app?.is_selected) ? {
                    ...buttonStyle,
                    display: "none"
                } : {
                    ...buttonStyle,
                    position: "absolute",
                    top: "-20px",
                    left: "-10px",
                    // marginLeft: "-20px"
                }
            }>
                <NoHoverActions app={app}/>
            </div>
        </div>
    </div>)
}
function NoHoverActions({app}) {
    let actionText
    if (app.is_owner || !app.is_from_store) {
        if (app.price) {
            actionText = `${
                app.price
            }$`
        } else if (app.is_from_store) {
            actionText = "Free"
        } else {
            actionText = `Sell ${
                app.categories[0]
            }`
        }
    } else if (app.is_installed) {
        actionText = `Select ${
            app.categories[0]
        }`
    } else if (app.price) {
        actionText = `${
            app.price
        }$`
    } else {
        actionText = "Free"
    }
    return (<>
        <AntButton style={
                { // margin: "3px"
                }
            }
            buttonType={
                buttonTypes.fontSecondary
            }
            buttonVariant={
                buttonVariants.text
        }> {actionText} </AntButton>
    </>)
    // if (app.is_owner)

}

function OnHoverActions({
    app,
    handleSelect,
    handleDuplication,
    setCloneAppInfo,
    cloneAppInfo,
    handleUninstall,
    handleUpload,
    setUploadInfo,
    uploadInfo,
    handleDownload,
    otherActions,
    infoContent,
    onConfigure,
    exportUrl,
    setDownloadInfo,
    downloadInfo,
    isReadOnlyStrategy
}) {
    return (<>
        <AppUpDownload app={app}
            handleUpload={handleUpload}
            setUploadInfo={setUploadInfo}
            downloadInfo={downloadInfo}
            setDownloadInfo={setDownloadInfo}
            uploadInfo={uploadInfo}
            handleDownload={handleDownload}/>
        <SelectApp app={app} isReadOnlyStrategy={isReadOnlyStrategy}
            handleSelect={handleSelect}/>
        <AppInfoModal app={app}
            infoContent={infoContent}/> {
        onConfigure && (<ConfigureApp app={app}
            onConfigure={onConfigure}/>)
    }
        {otherActions}
        {
        handleDuplication && (<CloneApp app={app}
            handleDuplication={handleDuplication}
            setCloneAppInfo={setCloneAppInfo}
            cloneAppInfo={cloneAppInfo}/>)
    }
        {
        exportUrl && (<ExportApp app={app}
            exportUrl={exportUrl}/>)
    }
        <UninstallApp app={app}
            handleUninstall={handleUninstall}/>
    </>)
}

export function ConfirmAction({
    onConfirm,
    confirmDescription,
    confirmTitle,
    confirmButtonText,
    buttonTitle,
    faIconComponent,
    antIconComponent,
    isSelected,
    okButtonProps = {}
}) {
    const [open, setOpen] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showPopconfirm = () => {
        setOpen(true);
    };
    return (<Popconfirm title={confirmTitle}
        description={confirmDescription}
        open={open}
        onConfirm={
            () => onConfirm(setOpen)
        }
        okButtonProps={
            {
                loading: confirmLoading,
                ...okButtonProps
            }
        }
        okText={confirmButtonText}
        onCancel={
            () => setOpen(false)
    }>
        <AppIconButton isSelected={isSelected}
            buttonTitle={buttonTitle}
            faIconComponent={faIconComponent}
            antIconComponent={antIconComponent}
            onClick={showPopconfirm}/>
    </Popconfirm>)
}
