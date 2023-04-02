import React, {useMemo, useState} from "react";
import {useIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";
import {useBotInfoContext} from "../../../context/data/BotInfoProvider";
import {useSaveTentaclesConfigAndSendAction} from "../../../context/config/TentaclesConfigProvider";
import IconFromString from "../../../components/Icons/IconFromString";
import { saveUserInputs } from "../Configuration/TentaclesConfig";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import WarningButton from "../../../components/Buttons/WarningButton";

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
    const availableApiActions = botInfo?.available_api_actions
    const isAvailableApiAction = availableApiActions?.includes(command)
    const botColors = useBotColorsContext();

    return useMemo(() => {
        return isAvailableApiAction && (
            <WarningButton 
                disabled={! isOnline || isExecuting}
                onClick={
                    () => sendActionCommandToTradingMode(command, saveTentaclesConfigAndSendAction, setIsExecuting)
                }
                variant={variant}
                color={botColors.warning}
                icon={<IconFromString faIcon={faIcon} antIcon={antIcon}/>}
                text={title} 
            />
        );
    }, [isAvailableApiAction, isOnline, isExecuting, variant, botColors.warning, faIcon, antIcon, title, command, saveTentaclesConfigAndSendAction])
}

export function sendActionCommandToTradingMode(command, saveTentaclesConfigAndSendAction, setIsExecuting, successCallback, failCallback) {
    saveUserInputs((currentConfig) => saveTentaclesConfigAndSendAction(currentConfig, command, setIsExecuting, true, successCallback, failCallback), setIsExecuting)
}
