import {CopyOutlined} from "@ant-design/icons";
import {ConfirmAction} from "../AppActions";
import CloneAppForm from "./CloneAppForm";

export default function CloneApp({app, handleDuplication, setCloneAppInfo, cloneAppInfo}) {
    return app.is_installed && (<ConfirmAction antIconComponent={CopyOutlined}
        isSelected={
            app.is_selected
        }
        onConfirm={handleDuplication}
        confirmDescription={
            (<CloneAppForm setCloneAppInfo={setCloneAppInfo}
                app={app}
                cloneAppInfo={cloneAppInfo}/>)
        }
        confirmTitle={
            `Clone ${
                app.title
            }?`
        }
        confirmButtonText={cloneAppInfo.selectNewProfile ?"Clone And Restart Now" : "Clone Now"}
        buttonTitle={"Clone & Customize"}/>)
}
