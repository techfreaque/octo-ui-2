import { useUpdateHiddenBacktestingMetadataColumnsContext } from "../../../context/data/BotPlottedElementsProvider";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";
import { tentacleConfigType, useFetchCurrentTradingTentaclesConfig, useSaveTentaclesConfig, useTentaclesConfigContext } from "../../../context/config/TentaclesConfigProvider";
import { AbstractTentaclesConfig } from "./TentaclesConfig";

export default function TradingConfig({ content }) {
    const botInfo = useBotInfoContext()
    const fetchCurrentTentaclesConfig = useFetchCurrentTradingTentaclesConfig()
    const currentTentaclesConfig = useTentaclesConfigContext()
    const currentTentaclesTradingConfig = currentTentaclesConfig?.[tentacleConfigType.tradingTentacles]
    const saveTentaclesConfig = useSaveTentaclesConfig()
    const setHiddenMetadataColumns = useUpdateHiddenBacktestingMetadataColumnsContext()
    return (<AbstractTentaclesConfig botInfo={botInfo}
        fetchCurrentTentaclesConfig={fetchCurrentTentaclesConfig}
        currentTentaclesTradingConfig={currentTentaclesTradingConfig}
        saveTentaclesConfig={saveTentaclesConfig}
        setHiddenMetadataColumns={setHiddenMetadataColumns}
        content={content}/>)
}
