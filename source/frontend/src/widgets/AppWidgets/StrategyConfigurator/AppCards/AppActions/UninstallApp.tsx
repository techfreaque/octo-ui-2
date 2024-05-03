import { DeleteOutlined } from "@ant-design/icons";
import { ConfirmAction } from "./AppActions";
import { AppStoreAppType } from "../../../../../context/data/AppStoreDataProvider";
import { Dispatch, SetStateAction } from "react";

export default function UninstallApp({
  app,
  handleUninstall,
}: {
  app: AppStoreAppType;
  handleUninstall: (setOpen: Dispatch<SetStateAction<boolean>>)=> void;
}) {
  return (
    app.is_installed &&
    !app.is_selected && (
      <ConfirmAction
        antIconComponent={DeleteOutlined}
        onConfirm={handleUninstall}
        isSelected={app.is_selected}
        confirmTitle={`Uninstall ${app.title}?`}
        confirmButtonText={"Uninstall now"}
        buttonTitle={
          "Uninstall"
          //     + (
          //     app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0]
          // )
        }
      />
    )
  );
}
