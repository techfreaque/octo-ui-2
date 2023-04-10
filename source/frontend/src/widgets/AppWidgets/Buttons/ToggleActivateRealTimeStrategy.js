import React, {useMemo, useState} from "react";
import {useIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";
import {useBotInfoContext, useFetchBotInfo} from "../../../context/data/BotInfoProvider";
import {useSaveTentaclesConfigAndSendAction} from "../../../context/config/TentaclesConfigProvider";
import {faPlay, faStop} from "@fortawesome/free-solid-svg-icons";
import createNotification from "../../../components/Notifications/Notification";
import {saveUserInputs} from "../Configuration/TentaclesConfig";
import AntButton , { buttonTypes }from "../../../components/Buttons/AntButton";

export default function ToggleActivateRealTimeStrategy() {
    const COMMAND_ACTIVATE_REALTIME_STRATEGY = "activate_realtime_strategy"
    const COMMAND_DISABLE_REALTIME_STRATEGY = "disable_realtime_strategy"
    const isOnline = useIsBotOnlineContext()
    const [isExecuting, setIsExecuting] = useState(false)
    const saveTentaclesConfigAndSendAction = useSaveTentaclesConfigAndSendAction()
    const botInfo = useBotInfoContext()
    const fetchBotInfo = useFetchBotInfo();

    const isActivated = botInfo?.real_time_strategies_active
    const availableApiActions = botInfo?.available_api_actions
    const isAvailableApiAction = availableApiActions?.includes(COMMAND_ACTIVATE_REALTIME_STRATEGY)

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
        return isAvailableApiAction && (isActivated ? (<AntButton disabled={
                ! isOnline || isExecuting
            }
            onClick={
                () => saveUserInputs((currentConfig) => saveTentaclesConfigAndSendAction(currentConfig, command, setIsExecuting, true, success, failed), setIsExecuting)
            }
            buttonType={buttonTypes.warning}
            faIconComponent={faStop}
            text="Stop Real Time Strategy"/>) : (<AntButton disabled={
                ! isOnline || isExecuting
            }
            onClick={
                () => saveUserInputs((currentConfig) => saveTentaclesConfigAndSendAction(currentConfig, command, setIsExecuting, true, success, failed), setIsExecuting)
            }
            buttonType={
                buttonTypes.warning
            }
            faIconComponent={faPlay}
            text="Start Real Time Strategy"/>))
    }, [
        isAvailableApiAction,
        isActivated,
        isOnline,
        isExecuting,
        fetchBotInfo,
        saveTentaclesConfigAndSendAction,
        command
    ])
}
