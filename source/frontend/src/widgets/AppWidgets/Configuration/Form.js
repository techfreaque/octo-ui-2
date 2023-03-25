import React from "react";
import {useGetBotConfig} from "../../../context/config/BotConfigProvider";
import defaultJsonEditorSettings from "../../../components/Forms/JsonEditor/JsonEditorDefaults";
import JsonEditor from "@techfreaque/json-editor-react";

export const availableConfigKeys = {
    cryptoCurrencies: "profile/crypto-currencies",
    exchanges: "profile/exchanges",
    trading: "profile/trading",
    trader: "profile/trader",
    traderSimulator: "profile/trader-simulator"
}

export const availableConfigKeysList = [
    availableConfigKeys.cryptoCurrencies,
    availableConfigKeys.exchanges,
    availableConfigKeys.trading,
    availableConfigKeys.trader,
    availableConfigKeys.traderSimulator,
]

export default function Configuration({configKey}) {
    const getBotConfigs = useGetBotConfig()
    const botConfigs = getBotConfigs([configKey])
    // const _saveBotConfigs = useSaveFormBotConfig();
    // function handleSaveForm(dataToStore) {
    // console.log("fsdjkfjsd");
    // _saveBotConfigs(configKey, dataToStore);
    // createNotification(
    //     botConfigs[configKey].schema.title +
    //     " saved successfully (saving isnt supported yet)",
    //     "success"
    // );
    // }
    // function handleFormSaveError() {
    // createNotification(
    //     "error saving " + botConfigs[configKey].schema.title,
    //     "danger"
    // );
    // }

    return botConfigs[configKey]?.schema && (
        <JsonEditor {...defaultJsonEditorSettings()}
            schema={
                botConfigs[configKey].schema
            }
            startval={
                botConfigs[configKey].data
            }
            editorName={
                `Profile-config-${configKey}`
            }
            // onChange={() => saveEditors(configKey)}
            key={configKey}
            disable_properties={true}
            disable_array_add={true}
            no_additional_properties={false}
            use_name_attributes={true}
            display_required_only={false}
            disable_collapse={true}
            disable_edit_json={true}/>
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // ), [configKey])
    )
}
