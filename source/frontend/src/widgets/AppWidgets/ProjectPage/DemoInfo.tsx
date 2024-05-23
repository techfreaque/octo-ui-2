import { RocketOutlined } from "@ant-design/icons";

import AntButton, { buttonSizes } from "../../../components/Buttons/AntButton";
import {
  useIsDemoMode,
  useUpdateProjectInfoOpenContext,
} from "../../../context/data/BotInfoProvider";

export default function DemoInfo() {
  const isDemo = useIsDemoMode();
  const setProjectInfoOpen = useUpdateProjectInfoOpenContext();
  return (
    isDemo && (
      <AntButton
        size={buttonSizes.large}
        onClick={() => setProjectInfoOpen(true)}
        antIconComponent={RocketOutlined}
        style={{ marginRight: "5px" }}
      >
        Get Octane Now
      </AntButton>
    )
  );
}
