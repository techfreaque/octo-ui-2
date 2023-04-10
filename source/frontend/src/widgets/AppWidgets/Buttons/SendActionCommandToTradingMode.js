import React, {useMemo, useState} from "react";
import {useIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";
import {useBotInfoContext} from "../../../context/data/BotInfoProvider";
import {useSaveTentaclesConfigAndSendAction} from "../../../context/config/TentaclesConfigProvider";
import { saveUserInputs } from "../Configuration/TentaclesConfig";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";

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
    const availableApiActions = botInfo?.available_api_actions
    const isAvailableApiAction = availableApiActions?.includes(command)
    return useMemo(() => {
        return isAvailableApiAction && (
            <AntButton 
                disabled={! isOnline || isExecuting}
                onClick={
                    () => sendActionCommandToTradingMode(command, saveTentaclesConfigAndSendAction, setIsExecuting)
                }
                variant={variant}
                buttonType={color}
                faIcon={faIcon}
                antIcon={antIcon}
                text={title} 
            />
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAvailableApiAction, isOnline, isExecuting, variant, color, faIcon, antIcon, title, command])
}

export function sendActionCommandToTradingMode(command, saveTentaclesConfigAndSendAction, setIsExecuting, successCallback, failCallback) {
    saveUserInputs((currentConfig) => saveTentaclesConfigAndSendAction(currentConfig, command, setIsExecuting, true, successCallback, failCallback), setIsExecuting)
}
