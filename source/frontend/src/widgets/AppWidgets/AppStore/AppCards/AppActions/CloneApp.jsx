import {CopyOutlined} from "@ant-design/icons";
import {ConfirmAction} from "./AppActions";

export default function CloneApp({app, handleDuplication, configureDuplication}) {
    return app.is_installed && (<ConfirmAction antIconComponent={CopyOutlined}
        onConfirm={handleDuplication}
        confirmDescription={
            configureDuplication ?. ()
        }
        confirmTitle={
            `Clone ${
                app.title
            }?`
        }
        confirmButtonText={"Clone now"}
        buttonTitle={"Clone & Customize"}/>)
}
