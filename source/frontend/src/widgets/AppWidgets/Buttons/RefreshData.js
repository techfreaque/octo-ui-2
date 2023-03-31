import { Tooltip} from 'antd';
import Button from '@mui/material/Button';
import { useMemo, useState, useEffect } from "react";
import {useFetchBotInfo} from "../../../context/data/BotInfoProvider";
import {useIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";
import {sizes} from '../../../constants/frontendConstants';
import {SyncOutlined} from '@ant-design/icons';
import {AntIconByReactFunc} from '../../../components/Icons/AntIcon';


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
            <Button
                disabled={isFetching}
                onClick={
                    () => {
                        setDidJustStartFetching(true);
                        fetchBotInfo(true, setIsFinished);
                    }
            }>
                <AntIconByReactFunc AntReactIcon={SyncOutlined}
                    size
                    ={ sizes.medium}
                    spin={isFetching}/>

            </Button>
        </Tooltip>);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetching, botIsOnline])
}
