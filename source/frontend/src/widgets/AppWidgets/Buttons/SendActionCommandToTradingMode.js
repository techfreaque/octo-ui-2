import React, { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import { useSaveTentaclesConfigAndSendAction } from "../../../api/configs";
import { saveUserInputs } from "../Configuration/TradingConfig";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";

export default function SendActionCommandToTradingMode({ command, title, faIcon, color = "warning", variant = "outlined" }) {
  const isOnline = useIsBotOnlineContext()
  const [isExecuting, setIsExecuting] = useState(false)
  const saveTentaclesConfigAndSendAction = useSaveTentaclesConfigAndSendAction()
  const botInfo = useBotInfoContext()
  const availableApiActions = botInfo.available_api_actions
  const isAvailableApiAction = botInfo.available_api_actions && availableApiActions.indexOf(command) !== -1

  return useMemo(() => {
    return isAvailableApiAction && (
      <Button disabled={!isOnline || isExecuting}
        onClick={() => saveUserInputs(saveTentaclesConfigAndSendAction, command, setIsExecuting)}
        variant={variant} color={color}>
        {faIcon && <i className={"fa-2xl fas fa-" + faIcon} size="3x" style={{ marginRight: "5px" }}></i>}
        {title}
      </Button>
    );
  }, [isAvailableApiAction, isOnline, isExecuting, variant, color, faIcon, title, saveTentaclesConfigAndSendAction, command])
}
