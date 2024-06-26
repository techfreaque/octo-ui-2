import { DeleteOutlined } from "@ant-design/icons";
import type { Dispatch, SetStateAction } from "react";

import type { AppStoreAppType } from "../../../../../context/data/AppStoreDataProvider";
import { ConfirmAction } from "./AppActions";

export default function UninstallApp({
  app,
  handleUninstall,
}: {
  app: AppStoreAppType;
  handleUninstall: (setOpen: Dispatch<SetStateAction<boolean>>) => void;
}) {
  return app.is_installed && !app.is_selected ? (
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
  ) : (
    <></>
  );
}
