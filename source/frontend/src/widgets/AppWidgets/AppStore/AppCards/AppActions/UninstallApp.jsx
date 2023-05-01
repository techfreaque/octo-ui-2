import {DeleteOutlined} from "@ant-design/icons";
import {ConfirmAction} from "./AppActions";

export default function UninstallApp({app, handleUninstall}) {
    return (app.is_installed && !app.is_selected) && (<ConfirmAction antIconComponent={DeleteOutlined}
        onConfirm={handleUninstall}
        isSelected={app.is_selected}
        confirmTitle={
            `Uninstall ${
                app.title
            }?`
        }
        confirmButtonText={"Uninstall now"}
        buttonTitle={
            "Uninstall"
            //     + (
            //     app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0]
            // )
        }/>)
}
