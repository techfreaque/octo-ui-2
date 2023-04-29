import {Popconfirm} from "antd";
import AntButton, {buttonTypes, buttonVariants} from "../../../../../components/Buttons/AntButton";
import {useState} from "react";
import AppInfoModal from "./AppInfoModal";
import SelectApp from "./SelectApp";
import ConfigureApp from "./ConfigureApp";
import CloneApp from "./CloneApp";
import UninstallApp from "./UninstallApp";
import AppUpDownload from "./UpDownloadApp/AppUpDownload";


export default function AppActions({
    app,
    handleSelect,
    handleDuplication,
    handleUninstall,
    isMouseHover,
    handleUpload,
    configureDuplication,
    setUploadInfo,
    uploadInfo,
    otherActions,
    infoContent,
    onConfigure
 }) { //const = isMouseHover = true
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
                    configureDuplication={configureDuplication}
                    setUploadInfo={setUploadInfo}
                    uploadInfo={uploadInfo}
                    onConfigure={onConfigure}
                    handleDuplication={handleDuplication}
                    handleUninstall={handleUninstall}
                    handleUpload={handleUpload}
                    otherActions={otherActions}
                    infoContent={infoContent}
                    app={app}/>
            </div>
            <div style={
                (isMouseHover | app?.is_selected) ? {
                    ...buttonStyle,
                    display: "none"
                } : {
                    ...buttonStyle,
                    position: "absolute",
                    top: "-18px",
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
    configureDuplication,
    handleUninstall,
    handleUpload,
    setUploadInfo,
    uploadInfo,
    handleDownload,
    otherActions,
    infoContent,
    onConfigure
}) {
    return (<>
        <AppUpDownload app={app}
            handleUpload={handleUpload}
            setUploadInfo={setUploadInfo}
            uploadInfo={uploadInfo}
            handleDownload={handleDownload}/>
        <SelectApp app={app}
            handleSelect={handleSelect}/>
        <AppInfoModal app={app}
            infoContent={infoContent}/>
        <ConfigureApp app={app}
            onConfigure={onConfigure}/> {otherActions}
        <CloneApp app={app}
            handleDuplication={handleDuplication}
            configureDuplication={configureDuplication}/>
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
    is_selected
}) {
    const [open, setOpen] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showPopconfirm = () => {
        setOpen(true);
    };
    
    const splitText = (text) => {
        const words = text.split(" ");
        const limit = 10;
        const result = words.reduce((lines, word) => {
          const lastLine = lines[lines.length - 1];
          if (word.length < 3 || lastLine.length + word.length + 1 > limit) {
            lines.push(word);
          } else {
            lines[lines.length - 1] += " " + word;
          }
          return lines;
        }, [""]);
        
        const newResult = result.includes('&') ? result.join(" ").replace(/& /g, "&\n") : result.join("\n")
        
        return newResult;
        
      };
    const noIconMargin = is_selected ? false : true
    const size = is_selected ? undefined : 'small'
    const buttonTitle_ = is_selected ? buttonTitle : splitText(buttonTitle);
    const buttonStyle = is_selected ? undefined : {margin: "3px", display: 'block', height: 'fit-content',}
    const spanStyle = is_selected ? undefined : {whiteSpace: 'pre-line', 
                                            wordWrap: 'break-word',
                                            fontSize: '12px',
                                            lineHeight: '14px',
                                            marginTop: '5px',}

    return (<Popconfirm title={confirmTitle}
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
        <AntButton style={buttonStyle}
            noIconMargin={noIconMargin}
            size={size}
            spanStyle={spanStyle}
            faIconComponent={faIconComponent}
            antIconComponent={antIconComponent}
            onClick={showPopconfirm}
            buttonVariant="text"> {buttonTitle_} </AntButton>
    </Popconfirm>)
}

