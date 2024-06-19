import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";
import { useMemo, useState } from "react";
import { Trans } from "react-i18next";

import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import createNotification from "../../../components/Notifications/Notification";
import type { TentaclesConfigByTentacleType } from "../../../context/config/TentaclesConfigProvider";
import { useSaveTentaclesConfigAndSendAction } from "../../../context/config/TentaclesConfigProvider";
import {
  useBotInfoContext,
  useFetchBotInfo,
  useIsDemoMode,
} from "../../../context/data/BotInfoProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import { saveUserInputs } from "../Configuration/TentaclesConfig";

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
  const saveTentaclesConfigAndSendAction =
    useSaveTentaclesConfigAndSendAction();
  const botInfo = useBotInfoContext();
  const fetchBotInfo = useFetchBotInfo();
  const isDemo = useIsDemoMode();
  return useMemo(() => {
    const isActivated = botInfo?.real_time_strategies_active;
    const availableApiActions = botInfo?.available_api_actions;
    const isAvailableApiAction = availableApiActions?.includes(
      COMMAND_ACTIVATE_REALTIME_STRATEGY,
    );

    const command = isActivated
      ? COMMAND_DISABLE_REALTIME_STRATEGY
      : COMMAND_ACTIVATE_REALTIME_STRATEGY;
    const failed = () => {
      setIsExecuting(false);
      createNotification({
        title: t("failed-to-activate-real-time-strategy"),
        type: "danger",
      });
    };
    const success = () => {
      fetchBotInfo();
      setIsExecuting(false);
      createNotification({
        title: t("successfully-activated-real-time-strategy"),
      });
    };
    return isAvailableApiAction ? (
      isActivated ? (
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
                  failed,
                ),
              setIsExecuting,
            )
          }
          buttonType={buttonTypes.warning}
          faIconComponent={faStop}
        >
          <Trans i18nKey="stop-real-time-strategy" />
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
                  failed,
                ),
              setIsExecuting,
            )
          }
          buttonType={buttonTypes.warning}
          faIconComponent={faPlay}
        >
          <Trans i18nKey="start-real-time-strategy" />
        </AntButton>
      )
    ) : (
      <></>
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
