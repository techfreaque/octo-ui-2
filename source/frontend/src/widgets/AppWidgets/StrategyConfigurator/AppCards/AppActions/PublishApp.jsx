import { ShareAltOutlined } from "@ant-design/icons";
import {usePublishApp} from "../../../../../context/data/AppStoreDataProvider";
import { ConfirmAction } from "./AppActions";
import { AppPublishStatus } from "../../storeConstants";

export default function PublishApp({app}) {
    const publishApp = usePublishApp()
    // useUnpublishApp
    return([AppPublishStatus.draft, AppPublishStatus.unpublished].includes(app.publish_status )) && (<ConfirmAction antIconComponent={ShareAltOutlined}
        onConfirm={(setLoading)=>publishApp(app.package_id, setLoading)}
        isSelected={
            app.is_selected
        }
        confirmTitle={
            `Publish ${
                app.title
            }?`
        }
        confirmButtonText={"Publish now"}
        buttonTitle={
            "Publish"
            //     + (
            //     app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0]
            // )
        }/>)
}
