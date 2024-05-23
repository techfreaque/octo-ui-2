import { SaveOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useMemo, useState } from "react";

import AntButton from "../../../components/Buttons/AntButton";
import { TentaclesConfigByTentacleType, useSaveTentaclesConfig } from "../../../context/config/TentaclesConfigProvider";
import { useIsDemoMode } from "../../../context/data/BotInfoProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import {
  saveUserInputs,
  strategyFlowMakerName,
} from "../Configuration/TentaclesConfig";
import { useCurrentTradingConfig } from "../Configuration/TradingConfig";

export default function SaveTradingModeSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const saveTentaclesConfig = useSaveTentaclesConfig();
  const isOnline = useIsBotOnlineContext();
  const currentTentaclesConfig = useCurrentTradingConfig();
  const isDemo = useIsDemoMode();
  return useMemo(() => {
    function handleUserInputSave() {
      saveUserInputs(
        (newConfigs: TentaclesConfigByTentacleType) =>
          saveTentaclesConfig(newConfigs, setIsSaving, true, true),
        setIsSaving,
        "tradingConfig"
      );
    }
    const tentacleNames =
      currentTentaclesConfig && Object.keys(currentTentaclesConfig);
    return (
      !tentacleNames?.includes(strategyFlowMakerName) && (
        <div
          style={{
            marginTop: "auto",
            marginBottom: "auto",
            marginRight: "5px",
          }}
        >
          <Tooltip
            placement="topRight"
            title={"Save Strategy Mode Settings"}
            arrow={false}
          >
            <div>
              <AntButton
                onClick={handleUserInputSave}
                disabled={isSaving || !isOnline || isDemo}
                // buttonVariant="text"
                antIconComponent={SaveOutlined}
                // style={
                //     {fontSize: '22px'}
                // }
              >
                Save Strategy Mode Settings
              </AntButton>
            </div>
          </Tooltip>
        </div>
      )
    );
  }, [currentTentaclesConfig, isDemo, isOnline, isSaving, saveTentaclesConfig]);
}
