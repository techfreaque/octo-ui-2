import {Tooltip} from 'antd';
import {useMemo, useState, useEffect} from "react";
import {useFetchBotInfo} from "../../../context/data/BotInfoProvider";
import {useIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";
import {sizes} from '../../../constants/frontendConstants';
import {SyncOutlined} from '@ant-design/icons';
import {AntIconByReactFunc} from '../../../components/Icons/AntIcon';
import { Trans } from 'react-i18next';
import AntButton from '../../../components/Buttons/AntButton';


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
        return (
            <Tooltip placement="top"
                title={<Trans i18nKey="buttons.softRefresh" />}
                arrow={false}>
                <div>
                    <AntButton disabled={isFetching}
                        onClick={
                            (() => {
                                setDidJustStartFetching(true);
                                fetchBotInfo(true, setIsFinished);
                            })
                    }
                        buttonVariant="text">
                        <AntIconByReactFunc AntReactIcon={SyncOutlined}
                            size={
                                sizes.medium
                            }
                            spin={isFetching}/>
                    </AntButton>
                </div>
            </Tooltip>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetching, botIsOnline])
}
