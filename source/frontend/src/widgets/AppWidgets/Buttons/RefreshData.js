import { Button } from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import { useFetchBotInfo } from "../../../context/data/BotInfoProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import { SyncOutlined } from "@ant-design/icons";


export default function RefreshBotData() {
  const fetchBotInfo = useFetchBotInfo()
  const botIsOnline = useIsBotOnlineContext()
  const [isFinished, setIsFinished] = useState(true)
  const [isSearching, setIsSearching] = useState(false);

  const isFetching = !isFinished || !botIsOnline || isSearching;

  useEffect(() => {
    let timer;
    if (isSearching) {
      timer = setTimeout(() => {
        setIsSearching(false);
      }, 1800);
    }
    return () => clearTimeout(timer);
  }, [isSearching]);

  return useMemo(() => {
    return (
      <Button disabled={isFetching} onClick={() => {
        setIsSearching(true);
        fetchBotInfo(true, setIsFinished);
      }}>
        <SyncOutlined spin={isSearching} style={{fontSize:'24px'}}/>
      </Button>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished, botIsOnline, isSearching])
}

