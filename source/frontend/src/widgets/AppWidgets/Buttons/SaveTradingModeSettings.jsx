import {Tooltip} from "antd";
import AntButton from "../../../components/Buttons/AntButton";
import {SaveOutlined} from "@ant-design/icons";
import {useState} from "react";
import {useSaveTentaclesConfig} from "../../../context/config/TentaclesConfigProvider";
import {saveUserInputs} from "../Configuration/TentaclesConfig";
import {useIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";

export default function SaveTradingModeSettings() {
    const [isSaving, setIsSaving] = useState(false);

    const saveTentaclesConfig = useSaveTentaclesConfig()
    const isOnline = useIsBotOnlineContext()
    function handleUserInputSave() {
        saveUserInputs((newConfigs) => saveTentaclesConfig(newConfigs, setIsSaving, true, true), setIsSaving, "tradingConfig")
    }
    return (
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
                    <AntButton onClick={
                            handleUserInputSave
                        }
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
}
