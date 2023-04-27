import {Popconfirm} from "antd";
import AntButton, {buttonTypes, buttonVariants} from "../../../../components/Buttons/AntButton";
import {faCopy} from "@fortawesome/free-solid-svg-icons";
import {
    BranchesOutlined,
    CloudDownloadOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    DollarOutlined,
    ShoppingCartOutlined
} from "@ant-design/icons";
import {useState} from "react";
import AppInfoModal from "./AppInfoModal";
import {strategyModeName} from "../AppStore";


export default function AppActions({
    app,
    handleSelect,
    handleDuplication,
    handleUninstall,
    isMouseHover,
    handleUpload,
    configureDuplication,
    configureUpload,
    otherActions,
    infoContent,
    onConfigure
}) { // const isMouseHover = true
    const buttonStyle = {
        display: "flex",
        flexWrap: "wrap",
        // minHeight: "76px"
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
                    (app ?. is_selected ? {
                        ... buttonStyle,
                        marginTop: "20px"
                    } : (isMouseHover ? {
                        ... buttonStyle,
                        // marginTop: "20px",
                        // position: "absolute",
                        // top: "auto",
                        // bottom: "auto",
                        margin: "auto",
                        // left: "0px",
                        justifyContent: "center"
                    } : {
                        ... buttonStyle,
                        display: "none"
                    }))
                }>
                    <OnHoverActions handleSelect={handleSelect}
                        configureDuplication={configureDuplication}
                        configureUpload={configureUpload}
                        onConfigure={onConfigure}
                        handleDuplication={handleDuplication}
                        handleUninstall={handleUninstall}
                        handleUpload={handleUpload}
                        otherActions={otherActions}
                        infoContent={infoContent}
                        app={app}/>
                </div>
                <div style={
                    (isMouseHover | app ?. is_selected) ? {
                        ... buttonStyle,
                        display: "none"
                    } : {
                        ... buttonStyle,
                        position: "absolute",
                        top: "-18px",
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
    otherActions,
    infoContent,
    onConfigure
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
                buttonText = `Sell`
                // ${
                //     app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0]
                // }`
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
                    `${buttonText}?`
                }
                confirmDescription={confirmDescription}
                confirmButtonText={buttonText}
                buttonTitle={buttonText}/> {
            !app.is_selected && (
                <ConfirmAction faIconComponent={faCopy}
                    onConfirm={handleSelect}
                    confirmTitle={
                        `Select ${app.title}?`
                    }
                    confirmButtonText={"Select now"}
                    buttonTitle={
                        "Select "
                        //     + (
                        //     app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0]
                        // )
                    }/>
            )
        }
            {
            (
                <AppInfoModal app={app}
                    infoContent={infoContent}/>
            )
        }
            {
            app.is_selected && (
                <AntButton style={
                        {margin: "3px"}
                    }
                    antIconComponent={BranchesOutlined}
                    onClick={onConfigure}
                    buttonVariant="text">
                    {`Configure ${app.categories[0]}`}
                </AntButton>
            )
        }
            {otherActions}
            {
            app.is_installed && (
                <ConfirmAction faIconComponent={faCopy}
                    onConfirm={handleDuplication}
                    confirmDescription={
                        configureDuplication ?. ()
                    }
                    confirmTitle={
                        `Clone ${app.title}?`
                    }
                    confirmButtonText={"Clone now"}
                    buttonTitle={"Clone & Customize"}/>
            )
        }
            {
            app.is_installed && (
                <ConfirmAction antIconComponent={DeleteOutlined}
                    onConfirm={handleUninstall}
                    confirmTitle={
                        `Uninstall ${app.title}?`
                    }
                    confirmButtonText={"Uninstall now"}
                    buttonTitle={
                        "Uninstall"
                        //     + (
                        //     app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0]
                        // )
                    }/>
            )
        } </>
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
    // eslint-disable-next-line no-unused-vars
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
