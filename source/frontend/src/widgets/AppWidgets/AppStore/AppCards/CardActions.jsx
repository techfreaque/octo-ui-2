import {Popconfirm} from "antd";
import AntButton, {buttonTypes, buttonVariants} from "../../../../components/Buttons/AntButton";
import {faCopy} from "@fortawesome/free-solid-svg-icons";
import {
    CloudDownloadOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    DollarOutlined,
    ShoppingCartOutlined
} from "@ant-design/icons";
import {useState} from "react";


export default function AppActions({
    app,
    handleSelect,
    handleDuplication,
    handleUninstall,
    isMouseHover,
    handleUpload,
    configureDuplication,
    configureUpload,
    otherActions
}) {
    const buttonStyle = {
        display: "flex",
        flexWrap: "wrap",
        minHeight: "76px"
    }
    return (
        <div style={
            {width: '100%'}
        }>

            <div key="productCardPrice"
                style={
                    {width: "100%"}
            }>
                <div style={
                    isMouseHover ? buttonStyle : {
                        ... buttonStyle,
                        display: "none"
                    }
                }>
                    <OnHoverActions handleSelect={handleSelect}
                        configureDuplication={configureDuplication}
                        configureUpload={configureUpload}
                        handleDuplication={handleDuplication}
                        handleUninstall={handleUninstall}
                        handleUpload={handleUpload}
                        otherActions={otherActions}
                        app={app}/>
                </div>
                <div style={
                    isMouseHover ? {
                        ... buttonStyle,
                        display: "none"
                    } : buttonStyle
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
    return (
        <>

            <AntButton style={
                    {margin: "3px"}
                }
                buttonType={
                    buttonTypes.fontSecondary
                }
                buttonVariant={
                    buttonVariants.text
            }>
                {actionText} </AntButton>
        </>
    )
    // if (app.is_owner)

}

function OnHoverActions({
    app,
    handleSelect,
    handleDuplication,
    configureDuplication,
    handleUninstall,
    handleUpload,
    configureUpload,
    handleDownload,
    otherActions
}) {
    let buttonText
    let buttonIcon
    let onButtonClick
    let confirmDescription
    if (app.is_installed) {
        if (app.is_owner) {
            if (app.is_from_store) {
                onButtonClick = handleUpload
                buttonText = "Publish Update"
                buttonIcon = CloudUploadOutlined
                confirmDescription = configureUpload ?. ()
            } else {
                onButtonClick = handleUpload
                buttonIcon = DollarOutlined
                buttonText = `Sell ${
                    app.categories[0]
                }`
                confirmDescription = configureUpload ?. ()
            }
        } else {
            onButtonClick = handleDownload
            buttonIcon = CloudDownloadOutlined
            buttonText = `Update ${
                app.categories[0]
            }`
        }
    } else if (app.price) {
        buttonIcon = ShoppingCartOutlined
        buttonText = `Buy for ${
            app.price
        }$ / month`
    } else {
        onButtonClick = handleDownload
        buttonIcon = CloudDownloadOutlined
        buttonText = 'Free download'
    }
    return (
        <>
            <ConfirmAction onConfirm={onButtonClick}
                antIconComponent={buttonIcon}
                confirmTitle={
                    buttonText + "?"
                }
                confirmDescription={confirmDescription}
                confirmButtonText={buttonText}
                buttonTitle={buttonText}/> {
            !app.is_selected && (
                <ConfirmAction faIconComponent={faCopy}
                    onConfirm={handleSelect}
                    confirmTitle={
                        "Select " + app.title + "?"
                    }
                    confirmButtonText={"Select now"}
                    buttonTitle={
                        "Select " + app.categories[0]
                    }/>
            )
        }
            {
            app.is_installed && (
                <ConfirmAction faIconComponent={faCopy}
                    onConfirm={handleDuplication}
                    confirmDescription={
                        configureDuplication ?. ()
                    }
                    confirmTitle={
                        "Duplicate " + app.title + "?"
                    }
                    confirmButtonText={"Duplicate now"}
                    buttonTitle={"Duplicate & Customize"}/>
            )
        }
            {
            app.is_installed && (
                <ConfirmAction antIconComponent={DeleteOutlined}
                    onConfirm={handleUninstall}
                    confirmTitle={
                        "Uninstall " + app.title + "?"
                    }
                    confirmButtonText={"Uninstall now"}
                    buttonTitle={
                        "Uninstall " + app.categories[0]
                    }/>
            )
        }
            {otherActions} </>
    )
}


export function ConfirmAction({
    onConfirm,
    confirmDescription,
    confirmTitle,
    confirmButtonText,
    buttonTitle,
    faIconComponent,
    antIconComponent
}) {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showPopconfirm = () => {
        setOpen(true);
    };

    return (
        <Popconfirm title={confirmTitle}
            description={confirmDescription}
            open={open}
            onConfirm={
                () => onConfirm(setOpen)
            }
            okButtonProps={
                {loading: confirmLoading}
            }
            okText={confirmButtonText}
            onCancel={
                () => setOpen(false)
        }>
            <AntButton style={
                    {margin: "3px"}
                }
                faIconComponent={faIconComponent}
                antIconComponent={antIconComponent}
                onClick={showPopconfirm}
                buttonVariant="text">
                {buttonTitle} </AntButton>
        </Popconfirm>
    )
}
