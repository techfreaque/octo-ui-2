import { CopyOutlined } from "@ant-design/icons";
import type { Dispatch, SetStateAction } from "react";

import type { AppStoreAppType } from "../../../../../../context/data/AppStoreDataProvider";
import { ConfirmAction } from "../AppActions";
import type { CloneAppInfoType } from "./CloneAppForm";
import CloneAppForm from "./CloneAppForm";

export default function CloneApp({
  app,
  handleDuplication,
  setCloneAppInfo,
  cloneAppInfo,
}: {
  app: AppStoreAppType;
  handleDuplication: (setOpen: Dispatch<SetStateAction<boolean>>) => void;
  setCloneAppInfo: Dispatch<SetStateAction<CloneAppInfoType | undefined>>;
  cloneAppInfo: CloneAppInfoType | undefined;
}) {
  return app.is_installed ? (
    <ConfirmAction
      antIconComponent={CopyOutlined}
      isSelected={app.is_selected}
      onConfirm={handleDuplication}
      confirmDescription={
        <CloneAppForm
          setCloneAppInfo={setCloneAppInfo}
          app={app}
          cloneAppInfo={cloneAppInfo}
        />
      }
      confirmTitle={`Clone ${app.title}?`}
      confirmButtonText={
        cloneAppInfo?.selectNewProfile ? "Clone And Restart Now" : "Clone Now"
      }
      buttonTitle={"Clone & Customize"}
    />
  ) : (
    <></>
  );
}
