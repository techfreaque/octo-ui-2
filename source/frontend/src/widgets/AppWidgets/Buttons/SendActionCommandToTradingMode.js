import React, {useMemo, useState} from "react";
import Button from "@mui/material/Button";
import {useIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";
import {saveUserInputs} from "../Configuration/TradingConfig";
import {useBotInfoContext} from "../../../context/data/BotInfoProvider";
import {useSaveTentaclesConfigAndSendAction} from "../../../context/config/TentaclesConfigProvider";
import IconFromString from "../../../components/Icons/IconFromString";

export default function SendActionCommandToTradingMode({
    command,
    title,
    faIcon,
    antIcon,
    color = "warning",
    variant = "outlined"
}) {
    const isOnline = useIsBotOnlineContext()
    const [isExecuting, setIsExecuting] = useState(false)
    const saveTentaclesConfigAndSendAction = useSaveTentaclesConfigAndSendAction()
    const botInfo = useBotInfoContext()
    const availableApiActions = botInfo.available_api_actions
    const isAvailableApiAction = availableApiActions?.includes(command)

    return useMemo(() => {
        return isAvailableApiAction && (
            <Button disabled={
                    ! isOnline || isExecuting
                }
                onClick={
                    () => sendActionCommandToTradingMode(command, saveTentaclesConfigAndSendAction, setIsExecuting)
                }
                variant={variant}
                color={color}>
                {
            <IconFromString  faIcon={faIcon}
                        antIcon={antIcon} />
            }
                {title} </Button>
        );
    }, [
        isAvailableApiAction,
        isOnline,
        isExecuting,
        variant,
        color,
        faIcon,
        antIcon,
        title,
        command,
        saveTentaclesConfigAndSendAction
    ])
}

export function sendActionCommandToTradingMode(command, saveTentaclesConfigAndSendAction, setIsExecuting, successCallback, failCallback) {
    saveUserInputs((currentConfig) => saveTentaclesConfigAndSendAction(currentConfig, command, setIsExecuting, true, successCallback, failCallback), setIsExecuting)
}
