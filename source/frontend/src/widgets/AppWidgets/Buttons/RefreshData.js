import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";
import { useFetchBotInfo } from "../../../context/data/BotInfoProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";

export default function RefreshBotData() {
  const fetchBotInfo = useFetchBotInfo()
  const botIsOnline = useIsBotOnlineContext()
  const [isFinished, setIsFinished] = useState(true)
  const isFetching = !isFinished || !botIsOnline
  return useMemo(() => {
    return (
      <Button disabled={isFetching} onClick={() => fetchBotInfo(true, setIsFinished)} >
        <FontAwesomeIcon icon={faRefresh} size="2xl" className={isFetching ? "fa-spin" : ""} />
      </Button>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished, botIsOnline])
}
