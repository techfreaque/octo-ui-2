import {Button, Tooltip} from 'antd';
import {useMemo, useState, useEffect} from "react";
import {useFetchBotInfo} from "../../../context/data/BotInfoProvider";
import {useIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";
import {SyncOutlined} from "@ant-design/icons";
import {buttonStyles} from "../../../components/Icons/AntIcon";

export default function RefreshBotData() {
    const fetchBotInfo = useFetchBotInfo()
    const botIsOnline = useIsBotOnlineContext()
    const [isFinished, setIsFinished] = useState(true)
    const [didJustStartFetching, setDidJustStartFetching] = useState(false);

    const isFetching = !isFinished || ! botIsOnline || didJustStartFetching;

    useEffect(() => {
        let timer;
        if (didJustStartFetching) {
            timer = setTimeout(() => {
                setDidJustStartFetching(false);
            }, 1500);
        }

        return() => clearTimeout(timer);
    }, [didJustStartFetching]);

    return useMemo(() => {
        return (<Tooltip placement="top"
            title={"Soft Refresh"}
            arrow={false}>
            <Button type="text"
                style={
                    {
                        padding: "5px",
                        height: buttonStyles.size.medium.buttonSize,
                        width: buttonStyles.size.medium.buttonSize,
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center"
                    }
                }
                disabled={isFetching}
                onClick={
                    () => {
                        setDidJustStartFetching(true);
                        fetchBotInfo(true, setIsFinished);
                    }
            }>
                <SyncOutlined spin={isFetching}
                    style={
                        {fontSize: buttonStyles.size.medium.fontSize}
                    }/>
            </Button>
        </Tooltip>);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetching, botIsOnline])
}
