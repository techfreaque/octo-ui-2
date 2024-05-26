import { BranchesOutlined } from "@ant-design/icons";

import AppIconButton from "../../../../../components/Buttons/AppIconButton";
import type { AppStoreAppType } from "../../../../../context/data/AppStoreDataProvider";

export default function ConfigureApp({
  app,
  onConfigure,
}: {
  app: AppStoreAppType;
  onConfigure: () => void;
}): JSX.Element {
  return app.is_selected ? (
    <AppIconButton
      isSelected={app.is_selected}
      buttonTitle={`Configure ${app.categories[0]}`}
      antIconComponent={BranchesOutlined}
      onClick={onConfigure}
    />
  ) : (
    <></>
  );
}
