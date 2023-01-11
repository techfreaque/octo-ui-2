import React, { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import { useSaveTentaclesConfigAndSendAction } from "../../../api/configs";
import { saveUserInputs } from "../Configuration/TradingConfig";

export default function SendActionCommandToTradingMode({ command, title, faIcon, color = "warning", variant = "outlined" }) {
  const isOnline = useIsBotOnlineContext()
  const [isExecuting, setIsExecuting] = useState(false)
  const saveTentaclesConfigAndSendAction = useSaveTentaclesConfigAndSendAction()

  // todo get available actions with botinfo
  return useMemo(() => {
    return (
      <Button disabled={!isOnline || isExecuting}
        onClick={() => saveUserInputs(saveTentaclesConfigAndSendAction, command, setIsExecuting)}
        variant={variant} color={color}>
        {faIcon && <i className={"fa-2xl fas fa-" + faIcon} size="3x" style={{ marginRight: "5px" }}></i>}
        {title}
      </Button>
    );
  }, [color, command, faIcon, isExecuting, isOnline, saveTentaclesConfigAndSendAction, title, variant])
}
