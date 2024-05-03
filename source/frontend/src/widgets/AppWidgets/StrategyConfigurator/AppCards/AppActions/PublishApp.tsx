import { ShareAltOutlined } from "@ant-design/icons";
import {
  AppStoreAppType,
  usePublishApp,
} from "../../../../../context/data/AppStoreDataProvider";
import { ConfirmAction } from "./AppActions";
import { AppPublishStatus } from "../../storeConstants";
import { Dispatch, SetStateAction } from "react";
import createNotification from "../../../../../components/Notifications/Notification";

export default function PublishApp({ app }: { app: AppStoreAppType }) {
  const publishApp = usePublishApp();
  return app.publish_status &&
    [AppPublishStatus.draft, AppPublishStatus.unpublished].includes(
      app.publish_status
    ) ? (
    <ConfirmAction
      antIconComponent={ShareAltOutlined}
      onConfirm={(setOpen: Dispatch<SetStateAction<boolean>>) => {
        if (app.package_id) {
          publishApp(app.package_id, setOpen);
        } else {
          createNotification({
            title: "Failed to publish app.",
            message: "App doesnt have a package id",
            type: "danger",
          });
        }
      }}
      isSelected={app.is_selected}
      confirmTitle={`Publish ${app.title}?`}
      confirmButtonText={"Publish now"}
      buttonTitle={
        "Publish"
        //     + (
        //     app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0]
        // )
      }
    />
  ) : (
    <></>
  );
}
