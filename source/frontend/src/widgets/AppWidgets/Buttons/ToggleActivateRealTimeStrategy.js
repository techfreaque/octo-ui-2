
import React, { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import { saveUserInputs } from "../Configuration/TradingConfig";
import { useBotInfoContext, useFetchBotInfo } from "../../../context/data/BotInfoProvider";
import { useSaveTentaclesConfigAndSendAction } from "../../../context/config/TentaclesConfigProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import createNotification from "../../../components/Notifications/Notification";

export default function ToggleActivateRealTimeStrategy() {
  const COMMAND_ACTIVATE_REALTIME_STRATEGY = "activate_realtime_strategy"
  const COMMAND_DISABLE_REALTIME_STRATEGY = "disable_realtime_strategy"
  const isOnline = useIsBotOnlineContext()
  const [isExecuting, setIsExecuting] = useState(false)
  const saveTentaclesConfigAndSendAction = useSaveTentaclesConfigAndSendAction()
  const botInfo = useBotInfoContext()
  const fetchBotInfo = useFetchBotInfo();

  const isActivated = botInfo?.real_time_strategies_active
  const availableApiActions = botInfo.available_api_actions
  const isAvailableApiAction = botInfo.available_api_actions
    && availableApiActions.indexOf(COMMAND_ACTIVATE_REALTIME_STRATEGY) !== -1
    && availableApiActions.indexOf(COMMAND_DISABLE_REALTIME_STRATEGY) !== -1

  const command = isActivated ? COMMAND_DISABLE_REALTIME_STRATEGY : COMMAND_ACTIVATE_REALTIME_STRATEGY
  return useMemo(() => {
    const failed = (updated_data, update_url, result, msg, status) => {
      setIsExecuting(false)
      createNotification("Failed to activate real time strategy", "danger")
    }
    const success = (updated_data, update_url, result, msg, status) => {
      fetchBotInfo()
      setIsExecuting(false)
      createNotification("Successfully activated real time strategy")
    }
    return isAvailableApiAction && (isActivated ? (
      <Button disabled={!isOnline || isExecuting}
        onClick={() => saveUserInputs((currentConfig) => saveTentaclesConfigAndSendAction(currentConfig, command, setIsExecuting, true, success, failed), setIsExecuting)}
        variant="outlined" color="warning" style={{ marginRight: "5px" }}>
        <FontAwesomeIcon icon={faStop} style={{ marginRight: "5px" }} />
        Stop Real Time Strategy
      </Button>
    )
      : (
        <Button disabled={!isOnline || isExecuting}
          onClick={() => saveUserInputs((currentConfig) => saveTentaclesConfigAndSendAction(currentConfig, command, setIsExecuting, true, success, failed), setIsExecuting)}
          variant="outlined" color="warning" style={{ marginRight: "5px" }}>
          <FontAwesomeIcon icon={faPlay} style={{ marginRight: "5px" }} />
          Start Real Time Strategy
        </Button>
      ))
  }, [isAvailableApiAction, isActivated, isOnline, isExecuting, fetchBotInfo, saveTentaclesConfigAndSendAction, command])
}
