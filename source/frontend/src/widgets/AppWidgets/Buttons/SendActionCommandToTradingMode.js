import React, {useMemo, useState} from "react";
import {useIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";
import {useBotInfoContext, useIsDemoMode} from "../../../context/data/BotInfoProvider";
import {useSaveTentaclesConfigAndSendAction} from "../../../context/config/TentaclesConfigProvider";
import {saveUserInputs} from "../Configuration/TentaclesConfig";
import AntButton, {buttonTypes} from "../../../components/Buttons/AntButton";

export default function SendActionCommandToTradingMode({
    command,
    title,
    faIcon,
    antIcon,
    color = buttonTypes.warning,
    variant = "outlined"
}) {
    const isOnline = useIsBotOnlineContext()
    const [isExecuting, setIsExecuting] = useState(false)
    const saveTentaclesConfigAndSendAction = useSaveTentaclesConfigAndSendAction()
    const botInfo = useBotInfoContext()
    const isDemo = useIsDemoMode()
    return useMemo(() => {
        const availableApiActions = botInfo?.available_api_actions
        const isAvailableApiAction = availableApiActions?.includes(command)
        return isAvailableApiAction && (
            <AntButton disabled={
                    ! isOnline || isExecuting || isDemo
                }
                onClick={
                    () => sendActionCommandToTradingMode(command, saveTentaclesConfigAndSendAction, setIsExecuting)
                }
                variant={variant}
                buttonType={color}
                faIcon={faIcon}
                antIcon={antIcon}
                text={title}/>
        );
    }, [
        botInfo?.available_api_actions,
        command,
        isOnline,
        isExecuting,
        isDemo,
        variant,
        color,
        faIcon,
        antIcon,
        title,
        saveTentaclesConfigAndSendAction
    ])
}

export function sendActionCommandToTradingMode(command, saveTentaclesConfigAndSendAction, setIsExecuting, successCallback, failCallback) {
    saveUserInputs((currentConfig) => saveTentaclesConfigAndSendAction(currentConfig, command, setIsExecuting, true, successCallback, failCallback), setIsExecuting)
}
