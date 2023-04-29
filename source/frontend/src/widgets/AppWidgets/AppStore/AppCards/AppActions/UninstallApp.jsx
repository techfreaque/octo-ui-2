import {DeleteOutlined} from "@ant-design/icons";
import {ConfirmAction} from "./AppActions";

export default function UninstallApp({app, handleUninstall}) {
    return app.is_installed && (<ConfirmAction antIconComponent={DeleteOutlined}
        onConfirm={handleUninstall}
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
