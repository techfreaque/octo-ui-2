import React, {useMemo, useState} from "react";
import Button from "@mui/material/Button";
import {useIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";
import {saveUserInputs} from "../Configuration/TradingConfig";
import {useBotInfoContext} from "../../../context/data/BotInfoProvider";
import {useSaveTentaclesConfigAndSendAction} from "../../../context/config/TentaclesConfigProvider";
import FontAwesomeIconByString from "../../../components/Icons/FontAwesome";
import {AntIconByString} from "../../../components/Icons/AntIcon";

export default function SendActionCommandToTradingMode({
    command,
    title,
    faIcon,
    icon,
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
                faIcon && (
                    <FontAwesomeIconByString faIcon={faIcon}/>
                )
            }
                {
                icon && (
                    <AntIconByString iconString={icon}/>
                )
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
        icon,
        title,
        command,
        saveTentaclesConfigAndSendAction
    ])
}

export function sendActionCommandToTradingMode(command, saveTentaclesConfigAndSendAction, setIsExecuting, successCallback, failCallback) {
    saveUserInputs((currentConfig) => saveTentaclesConfigAndSendAction(currentConfig, command, setIsExecuting, true, successCallback, failCallback), setIsExecuting)
}
