import { SyncOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Trans } from "react-i18next";

import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import { AntIconByReactFunc } from "../../../components/Icons/AntIcon";
import { sizes } from "../../../constants/frontendConstants";
import { useFetchBotInfo } from "../../../context/data/BotInfoProvider";
import { useFetchPlotData } from "../../../context/data/BotPlottedElementsProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";

export default function RefreshBotData() {
  const fetchBotInfo = useFetchBotInfo();
  const fetchPlotData = useFetchPlotData();
  const botIsOnline = useIsBotOnlineContext();
  const [isFinished, setIsFinished] = useState(true);
  const [didJustStartFetching, setDidJustStartFetching] = useState(false);
  const isFetching = !isFinished || !botIsOnline;
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (didJustStartFetching) {
      timer = setTimeout(() => {
        setDidJustStartFetching(false);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [didJustStartFetching]);
  return useMemo(() => {
    return (
      <Tooltip
        placement="top"
        title={<Trans i18nKey="footer.softRefresh" />}
        arrow={false}
      >
        <div>
          <AntButton
            disabled={isFetching}
            onClick={() => {
              setDidJustStartFetching(true);
              fetchBotInfo(true, () => {
                fetchPlotData(() => setIsFinished(true));
              });
            }}
            buttonType={buttonTypes.error}
            buttonVariant="text"
          >
            <AntIconByReactFunc
              AntReactIcon={SyncOutlined}
              size={sizes.medium}
              spin={isFetching || didJustStartFetching}
            />
          </AntButton>
        </div>
      </Tooltip>
    );
  }, [isFetching, didJustStartFetching, fetchBotInfo, fetchPlotData]);
}
