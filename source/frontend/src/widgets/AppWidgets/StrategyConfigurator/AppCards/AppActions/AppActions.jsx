import {Popconfirm, Tooltip} from "antd";
import AntButton, {buttonTypes, buttonVariants} from "../../../../../components/Buttons/AntButton";
import AppInfoModal from "./AppInfoModal";
import SelectApp from "./SelectApp";
import ConfigureApp from "./ConfigureApp";
import CloneApp from "./CloneApp/CloneApp";
import UninstallApp from "./UninstallApp";
import AppUpDownload from "./UpDownloadApp/AppUpDownload";
import AppIconButton from "../../../../../components/Buttons/AppIconButton";
import ExportApp from "./ExportApp";
import {useState} from "react";
import PublishApp from "./PublishApp";
import UnpublishApp from "./UnpublishApp";


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
    isReadOnlyStrategy,
    didHoverOnce
}) {
    const buttonStyle = {
        display: "flex",
        flexWrap: "wrap",
    }

    return (
        <div style={
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
                        margin: "auto",
                        justifyContent: "center"
                    } : {
                                ...buttonStyle,
                        display : "none"
                    }))
                }>
                    {
                    (didHoverOnce || app?.is_selected) && (<OnHoverActions handleSelect={handleSelect}
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
                        app={app}/>)
                } </div>
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
        </div>
    )
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
        } else if (app.updated_by_distro){
            actionText = ""
        } else {
            actionText = `Sell ${
                app?.categories?.[0] || "App"
            }`
        }
    } else if (app.is_installed) {
        actionText = `Select ${
            app.categories[0]
        }`
    } else if (app.price) {
        // actionText = `${
        //     app.price
        // }$`
        actionText = "Download"
    } else {
        actionText = "Free"
    }
    return (
        <AntButton style={
                { // margin: "3px"
                }
            }
            buttonType={
                buttonTypes.fontSecondary
            }
            buttonVariant={
                buttonVariants.text
        }>
            {actionText} </AntButton>
    )
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
    return (
        <>
            <AppUpDownload app={app}
                handleUpload={handleUpload}
                setUploadInfo={setUploadInfo}
                downloadInfo={downloadInfo}
                setDownloadInfo={setDownloadInfo}
                uploadInfo={uploadInfo}
                handleDownload={handleDownload}/>
            <SelectApp app={app}
                isReadOnlyStrategy={isReadOnlyStrategy}
                handleSelect={handleSelect}/>
            <AppInfoModal app={app}
                infoContent={infoContent}/> {
            onConfigure && (
                <ConfigureApp app={app}
                    onConfigure={onConfigure}/>
            )
        }
            {otherActions}
            {
            handleDuplication && (
                <CloneApp app={app}
                    handleDuplication={handleDuplication}
                    setCloneAppInfo={setCloneAppInfo}
                    cloneAppInfo={cloneAppInfo}/>
            )
        }
            {
            exportUrl && (
                <ExportApp app={app}
                    exportUrl={exportUrl}/>
            )
        }
            <UninstallApp app={app}
                handleUninstall={handleUninstall} />
            <PublishApp app={app} />
            <UnpublishApp app={app} />
        </>
    )
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
    okButtonProps = {},
    disabled = false,
    disabledTooltipTitle = false,
    formIsValidated = true,
    confirmLoading,
    open,
    setOpen
}) {
    const [_open, _setOpen] = useState(false);
    const actualOpen = setOpen ? open : _open
    const actualSetOpen = setOpen ? setOpen : _setOpen

    if (disabled) {
        return (
            <Tooltip title={disabledTooltipTitle}>
                <div>
                    <AppIconButton isSelected={isSelected}
                        buttonTitle={buttonTitle}
                        disabled={true}
                        faIconComponent={faIconComponent}
                        antIconComponent={antIconComponent}
                        // onClick={showPopconfirm}
                    />
                </div>
            </Tooltip>
        )
    }
    return (
        <Popconfirm title={confirmTitle}
            description={confirmDescription}
            open={actualOpen}
            onConfirm={
                () => onConfirm(actualSetOpen)
            }
            okButtonProps={
                {
                    loading: confirmLoading,
                    ...okButtonProps,
                    disabled: !formIsValidated
                }
            }
            okText={confirmButtonText}
            onCancel={
                () => actualSetOpen(false)
        }>
            <AppIconButton isSelected={isSelected}
                buttonTitle={buttonTitle}
                faIconComponent={faIconComponent}
                antIconComponent={antIconComponent}
                onClick={
                    () => actualSetOpen(true)
                }/>
        </Popconfirm>
    )
}

export function handlePopConfirmOpen(setInfo, isOpen) {
    setInfo(prevIfo => ({
        ...prevIfo,
        open: isOpen
    }))
}
