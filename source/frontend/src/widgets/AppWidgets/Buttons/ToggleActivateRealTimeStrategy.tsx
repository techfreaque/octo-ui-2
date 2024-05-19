import { useMemo, useState } from "react";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import {
  useBotInfoContext,
  useFetchBotInfo,
  useIsDemoMode,
} from "../../../context/data/BotInfoProvider";
import { TentaclesConfigByTentacleType, useSaveTentaclesConfigAndSendAction } from "../../../context/config/TentaclesConfigProvider";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import createNotification from "../../../components/Notifications/Notification";
import { saveUserInputs } from "../Configuration/TentaclesConfig";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import {
  errorResponseCallBackParams,
  successResponseCallBackParams,
} from "../../../api/fetchAndStoreFromBot";

export type RealTimeStrategyCommandsType =
  | "activate_realtime_strategy"
  | "disable_realtime_strategy";

export default function ToggleActivateRealTimeStrategy() {
  const COMMAND_ACTIVATE_REALTIME_STRATEGY: RealTimeStrategyCommandsType =
    "activate_realtime_strategy";
  const COMMAND_DISABLE_REALTIME_STRATEGY: RealTimeStrategyCommandsType =
    "disable_realtime_strategy";
  const isOnline = useIsBotOnlineContext();
  const [isExecuting, setIsExecuting] = useState(false);
  const saveTentaclesConfigAndSendAction = useSaveTentaclesConfigAndSendAction();
  const botInfo = useBotInfoContext();
  const fetchBotInfo = useFetchBotInfo();
  const isDemo = useIsDemoMode();
  return useMemo(() => {
    const isActivated = botInfo?.real_time_strategies_active;
    const availableApiActions = botInfo?.available_api_actions;
    const isAvailableApiAction = availableApiActions?.includes(
      COMMAND_ACTIVATE_REALTIME_STRATEGY
    );

    const command = isActivated
      ? COMMAND_DISABLE_REALTIME_STRATEGY
      : COMMAND_ACTIVATE_REALTIME_STRATEGY;
    const failed = (payload: errorResponseCallBackParams) => {
      setIsExecuting(false);
      createNotification({
        title: "Failed to activate real time strategy",
        type: "danger",
      });
    };
    const success = (payload: successResponseCallBackParams) => {
      fetchBotInfo();
      setIsExecuting(false);
      createNotification({
        title: "Successfully activated real time strategy",
      });
    };
    return (
      isAvailableApiAction &&
      (isActivated ? (
        <AntButton
          disabled={!isOnline || isExecuting || isDemo}
          onClick={() =>
            saveUserInputs(
              (currentConfig: TentaclesConfigByTentacleType) =>
                saveTentaclesConfigAndSendAction(
                  currentConfig,
                  command,
                  setIsExecuting,
                  true,
                  success,
                  failed
                ),
              setIsExecuting
            )
          }
          buttonType={buttonTypes.warning}
          faIconComponent={faStop}
        >
          Stop Real Time Strategy
        </AntButton>
      ) : (
        <AntButton
          disabled={!isOnline || isExecuting || isDemo}
          onClick={() =>
            saveUserInputs(
              (currentConfig: TentaclesConfigByTentacleType) =>
                saveTentaclesConfigAndSendAction(
                  currentConfig,
                  command,
                  setIsExecuting,
                  true,
                  success,
                  failed
                ),
              setIsExecuting
            )
          }
          buttonType={buttonTypes.warning}
          faIconComponent={faPlay}
        >
          Start Real Time Strategy
        </AntButton>
      ))
    );
  }, [
    botInfo?.real_time_strategies_active,
    botInfo?.available_api_actions,
    isOnline,
    isExecuting,
    isDemo,
    fetchBotInfo,
    saveTentaclesConfigAndSendAction,
  ]);
}
