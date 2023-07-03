import {ShareAltOutlined} from "@ant-design/icons";
import {useDeleteApp, useUnpublishApp} from "../../../../../context/data/AppStoreDataProvider";
import {ConfirmAction} from "./AppActions";
import {AppPublishStatus} from "../../storeConstants";

export default function UnpublishApp({app}) {
    const unpublishApp = useUnpublishApp()
    return(app.publish_status === AppPublishStatus.published && app.is_owner) && (<ConfirmAction antIconComponent={ShareAltOutlined}
        onConfirm={
            (setLoading) => unpublishApp(app.package_id, setLoading)
        }
        isSelected={
            app.is_selected
        }
        confirmTitle={
            `Unpublish ${
                app.title
            }?`
        }
        confirmButtonText={"Unpublish now"}
        buttonTitle={
            "Unpublish"
            //     + (
            //     app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0]
            // )
        }/>)
}

export function DeleteApp({app}) {
    const deleteApp = useDeleteApp()
    return(app.can_delete) && (<ConfirmAction antIconComponent={ShareAltOutlined}
        onConfirm={
            (setLoading) => deleteApp(app.package_id, setLoading)
        }
        isSelected={
            app.is_selected
        }
        confirmTitle={
            `Delete ${
                app.title
            }?`
        }
        confirmButtonText={"Delete now"}
        buttonTitle={
            "Delete"
            //     + (
            //     app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0]
            // )
        }/>)
}
