import { RocketOutlined } from "@ant-design/icons";
import { t } from "i18next";

import AntButton, { buttonSizes } from "../../../components/Buttons/AntButton";
import { projectName } from "../../../constants/frontendConstants";
import {
  useIsDemoMode,
  useUpdateProjectInfoOpenContext,
} from "../../../context/data/BotInfoProvider";

export default function DemoInfo() {
  const isDemo = useIsDemoMode();
  const setProjectInfoOpen = useUpdateProjectInfoOpenContext();
  return isDemo ? (
    <AntButton
      size={buttonSizes.large}
      onClick={() => setProjectInfoOpen(true)}
      antIconComponent={RocketOutlined}
      style={{ marginRight: "5px" }}
    >
      {t("projectInfoPage.get-projectname-now", { projectName })}
    </AntButton>
  ) : (
    <></>
  );
}
