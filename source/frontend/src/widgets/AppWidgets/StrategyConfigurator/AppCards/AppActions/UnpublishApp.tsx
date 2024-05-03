import { ShareAltOutlined } from "@ant-design/icons";
import {
  AppStoreAppType,
  useDeleteApp,
  useUnpublishApp,
} from "../../../../../context/data/AppStoreDataProvider";
import { ConfirmAction } from "./AppActions";
import { AppPublishStatus } from "../../storeConstants";
import { Dispatch, SetStateAction } from "react";
import createNotification from "../../../../../components/Notifications/Notification";

export default function UnpublishApp({ app }: { app: AppStoreAppType }) {
  const unpublishApp = useUnpublishApp();
  return (
    app.publish_status === AppPublishStatus.published &&
    app.is_owner && (
      <ConfirmAction
        antIconComponent={ShareAltOutlined}
        onConfirm={(setOpen: Dispatch<SetStateAction<boolean>>) =>
          unpublishApp(app.package_id, setOpen)
        }
        isSelected={app.is_selected}
        confirmTitle={`Unpublish ${app.title}?`}
        confirmButtonText={"Unpublish now"}
        buttonTitle={
          "Unpublish"
          //     + (
          //     app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0]
          // )
        }
      />
    )
  );
}

export function DeleteApp({ app }: { app: AppStoreAppType }) {
  const deleteApp = useDeleteApp();
  return (
    app.can_delete && (
      <ConfirmAction
        antIconComponent={ShareAltOutlined}
        onConfirm={(setOpen: Dispatch<SetStateAction<boolean>>) => {
          if (app.package_id) {
            deleteApp(app.package_id, setOpen);
          } else {
            createNotification({
              title: "Failed to delete app.",
              message: "App doesnt have a package id",
              type: "danger",
            });
          }
        }}
        isSelected={app.is_selected}
        confirmTitle={`Delete ${app.title}?`}
        confirmButtonText={"Delete now"}
        buttonTitle={
          "Delete"
          //     + (
          //     app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0]
          // )
        }
      />
    )
  );
}
