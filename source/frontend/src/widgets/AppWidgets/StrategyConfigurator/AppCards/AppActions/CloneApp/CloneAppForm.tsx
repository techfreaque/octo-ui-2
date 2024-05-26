import { Input, Switch } from "antd";
import type { Dispatch, SetStateAction} from "react";
import { useEffect } from "react";

import UserInputLabel from "../../../../../../components/UserInputs/UserInputLabel";
import type { AppStoreAppType } from "../../../../../../context/data/AppStoreDataProvider";

export interface CloneAppInfoType {
  newProfileName?: string;
  selectNewProfile?: boolean;
}

export default function CloneAppForm({
  setCloneAppInfo,
  cloneAppInfo,
  app,
}: {
  setCloneAppInfo: Dispatch<SetStateAction<CloneAppInfoType | undefined>>;
  cloneAppInfo: CloneAppInfoType | undefined;
  app: AppStoreAppType;
}) {
  useEffect(() => {
    setCloneAppInfo({
      newProfileName: `${app.title} Copy`,
      selectNewProfile: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function handleInputChange(
    key: "newProfileName" | "selectNewProfile",
    value: string | boolean
  ) {
    setCloneAppInfo((prevInfo) => ({
      ...prevInfo,
      [key]: value,
    }));
  }
  return (
    <div style={{ marginRight: "20px" }}>
      <UserInputLabel title={"Define a new title for your strategy"}>
        <Input
          onChange={(event) =>
            handleInputChange("newProfileName", event?.target?.value)
          }
          value={cloneAppInfo?.newProfileName}
        />
      </UserInputLabel>
      <UserInputLabel title={"Do you want to select the new strategy?"}>
        <Switch
          onChange={(value) => handleInputChange("selectNewProfile", value)}
          checked={cloneAppInfo?.selectNewProfile || false}
        />
      </UserInputLabel>
    </div>
  );
}
