import {ShareAltOutlined} from "@ant-design/icons";
import {useUnpublishApp} from "../../../../../context/data/AppStoreDataProvider";
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
