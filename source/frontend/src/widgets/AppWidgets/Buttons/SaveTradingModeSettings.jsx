import {Tooltip} from "antd";
import AntButton from "../../../components/Buttons/AntButton";
import {SaveOutlined} from "@ant-design/icons";
import {useMemo, useState} from "react";
import {useSaveTentaclesConfig} from "../../../context/config/TentaclesConfigProvider";
import {saveUserInputs, strategyFlowMakerName} from "../Configuration/TentaclesConfig";
import {useIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";
import {useCurrentTradingConfig} from "../Configuration/TradingConfig";

export default function SaveTradingModeSettings() {
    const [isSaving, setIsSaving] = useState(false);
    const saveTentaclesConfig = useSaveTentaclesConfig()
    const isOnline = useIsBotOnlineContext()
    const currentTentaclesConfig = useCurrentTradingConfig()
    return useMemo(() => {
        function handleUserInputSave() {
            saveUserInputs((newConfigs) => saveTentaclesConfig(newConfigs, setIsSaving, true, true), setIsSaving, "tradingConfig")
        }
        const tentacleNames = currentTentaclesConfig && Object.keys(currentTentaclesConfig)
        return ! tentacleNames?.includes(strategyFlowMakerName) && (
            <div style={
                {
                    marginTop: "auto",
                    marginBottom: "auto",
                    marginRight: "5px"
                }
            }>
                <Tooltip placement="topRight"
                    title={"Save Strategy Mode Settings"}
                    arrow={false}>
                    <div>
                        <AntButton onClick={handleUserInputSave}
                            disabled={
                                isSaving || ! isOnline
                            }
                            // buttonVariant="text"
                            antIconComponent={SaveOutlined}
                            // style={
                            //     {fontSize: '22px'}
                            // }
                        >Save Strategy Mode Settings</AntButton>
                    </div>
                </Tooltip>
            </div>
        )
    }, [currentTentaclesConfig, isOnline, isSaving, saveTentaclesConfig])
}
