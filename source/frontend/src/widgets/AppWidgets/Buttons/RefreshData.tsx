import { Tooltip } from "antd";
import { useMemo, useState, useEffect } from "react";
import { useFetchBotInfo } from "../../../context/data/BotInfoProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import { sizes } from "../../../constants/frontendConstants";
import { SyncOutlined } from "@ant-design/icons";
import { AntIconByReactFunc } from "../../../components/Icons/AntIcon";
import { Trans } from "react-i18next";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";

export default function RefreshBotData() {
  const fetchBotInfo = useFetchBotInfo();
  const botIsOnline = useIsBotOnlineContext();
  const [isFinished, setIsFinished] = useState(true);
  const [didJustStartFetching, setDidJustStartFetching] = useState(false);
  const isFetching = !isFinished || !botIsOnline || didJustStartFetching;
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (didJustStartFetching) {
      timer = setTimeout(() => {
        setDidJustStartFetching(false);
      }, 1500);
    }

    return () => clearTimeout(timer);
  }, [didJustStartFetching]);
  return useMemo(() => {
    return (
      <Tooltip
        placement="top"
        title={<Trans i18nKey="buttons.softRefresh" />}
        arrow={false}
      >
        <div>
          <AntButton
            disabled={isFetching}
            onClick={() => {
              setDidJustStartFetching(true);
              fetchBotInfo(true, setIsFinished);
            }}
            buttonType={buttonTypes.error}
            buttonVariant="text"
          >
            <AntIconByReactFunc
              AntReactIcon={SyncOutlined}
              size={sizes.medium}
              spin={isFetching}
            />
          </AntButton>
        </div>
      </Tooltip>
    );
  }, [isFetching, fetchBotInfo]);
}
