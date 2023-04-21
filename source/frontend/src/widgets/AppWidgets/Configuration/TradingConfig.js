import {useUpdateHiddenBacktestingMetadataColumnsContext} from "../../../context/data/BotPlottedElementsProvider";
import {useBotInfoContext} from "../../../context/data/BotInfoProvider";
import {tentacleConfigType, useFetchCurrentTradingTentaclesConfig, useSaveTentaclesConfig, useTentaclesConfigContext} from "../../../context/config/TentaclesConfigProvider";
import {AbstractTentaclesConfig} from "./TentaclesConfig";
import {Tab} from "@mui/material";
import StraegyConfigurator from "./StrategyConfigurator";

export default function TradingConfig({content}) {
    const botInfo = useBotInfoContext()
    const fetchCurrentTentaclesConfig = useFetchCurrentTradingTentaclesConfig()
    const currentTentaclesConfig = useTentaclesConfigContext()
    const currentTentaclesTradingConfig = currentTentaclesConfig?.[tentacleConfigType.tradingTentacles]
    const saveTentaclesConfig = useSaveTentaclesConfig()
    const setHiddenMetadataColumns = useUpdateHiddenBacktestingMetadataColumnsContext()
    return (
        <AbstractTentaclesConfig botInfo={botInfo}
            fetchCurrentTentaclesConfig={fetchCurrentTentaclesConfig}
            currentTentaclesTradingConfig={currentTentaclesTradingConfig}
            saveTentaclesConfig={saveTentaclesConfig}
            setHiddenMetadataColumns={setHiddenMetadataColumns}
            additionalTabs={
                [{
                        title: (
                            <Tab key={"strategyConfigTab"}
                                label={"Trading Modes"}
                                value={"strategyConfigTab"}
                                sx={
                                    {textTransform: 'none'}
                                }/>
                        ),
                        tabId: "strategyConfigTab",
                        content: (
                            <StraegyConfigurator/>)
                    }]
            }
            content={content}/>
    )
}
