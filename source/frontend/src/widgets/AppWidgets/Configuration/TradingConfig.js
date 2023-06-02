import {useUpdateHiddenBacktestingMetadataColumnsContext} from "../../../context/data/BotPlottedElementsProvider";
import {useBotInfoContext} from "../../../context/data/BotInfoProvider";
import {tentacleConfigType, useFetchCurrentTradingTentaclesConfig, useSaveTentaclesConfig, useTentaclesConfigContext} from "../../../context/config/TentaclesConfigProvider";
import {AbstractTentaclesConfig} from "./TentaclesConfig";
import { useMemo } from "react";

export default function TradingConfigTabs({content}) {
    const botInfo = useBotInfoContext()
    const fetchCurrentTentaclesConfig = useFetchCurrentTradingTentaclesConfig()
    const currentTentaclesConfig = useCurrentTradingConfig()
    const saveTentaclesConfig = useSaveTentaclesConfig()
    const setHiddenMetadataColumns = useUpdateHiddenBacktestingMetadataColumnsContext()
    return (
        <AbstractTentaclesConfig botInfo={botInfo}
            fetchCurrentTentaclesConfig={fetchCurrentTentaclesConfig}
            currentTentaclesTradingConfig={currentTentaclesConfig}
            saveTentaclesConfig={saveTentaclesConfig}
            setHiddenMetadataColumns={setHiddenMetadataColumns}
            // additionalTabs={
            //     [{
            //             title: (
            //                 <Tab key={"strategyConfigTab"}
            //                     label={"Trading Modes"}
            //                     value={"strategyConfigTab"}
            //                     sx={
            //                         {textTransform: 'none'}
            //                     }/>
            //             ),
            //             tabId: "strategyConfigTab",
            //             // content: (
            //             //     <StraegyConfigurator/>)
            //         }]
            // }
            content={content}/>
    )
}

export function useCurrentTradingConfig() {
    const currentTentaclesConfig = useTentaclesConfigContext()
    return useMemo(() => {
        return currentTentaclesConfig?.[tentacleConfigType.tradingTentacles]
    }, [currentTentaclesConfig])
} 