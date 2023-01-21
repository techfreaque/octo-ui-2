import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";
import { useFetchBotInfo } from "../../../context/data/BotInfoProvider";

export default function RefreshBotData() {
  const fetchBotInfo = useFetchBotInfo()
  const [isFinished, setIsFinished] = useState(true)
  return useMemo(() => {
    return (
      <Button onClick={()=>fetchBotInfo(true, setIsFinished)} >
        <FontAwesomeIcon icon={faRefresh} size="2xl" className={isFinished ? "" : "fa-spin"} />
      </Button>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished])
}
