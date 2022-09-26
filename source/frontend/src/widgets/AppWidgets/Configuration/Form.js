import React from "react";
import { useBotConfig, useSaveFormBotConfig } from "../../../context/config/BotConfigProvider";
import defaultJsonEditorSettings from "../../../components/Forms/JsonEditor/JsonEditorDefaults";
import JsonEditor from "@techfreaque/json-editor-react";

export default function Configuration({ configKey }) {
  const botConfigs = useBotConfig([configKey]);
  // const _saveBotConfigs = useSaveFormBotConfig();
  // function handleSaveForm(dataToStore) {
  //   console.log("fsdjkfjsd");
  //   _saveBotConfigs(configKey, dataToStore);
  //   createNotification(
  //     botConfigs[configKey].schema.title +
  //     " saved successfully (saving isnt supported yet)",
  //     "success"
  //   );
  // }
  // function handleFormSaveError() {
  //   createNotification(
  //     "error saving " + botConfigs[configKey].schema.title,
  //     "danger"
  //   );
  // }
  console.log("rereerrere", botConfigs[configKey]);

  return botConfigs[configKey] && botConfigs[configKey].schema && (
    <JsonEditor
      {...defaultJsonEditorSettings()}
      schema={botConfigs[configKey].schema}
      startval={botConfigs[configKey].data}
      editorName={"Profile-config-" + configKey}
      // onChange={() => saveEditors(configKey)}
      key={configKey}
      disable_properties={false}
      disable_array_add={false}
      no_additional_properties={false}
      use_name_attributes={true}
      display_required_only={false}
    />
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // ), [configKey])
  )
}
