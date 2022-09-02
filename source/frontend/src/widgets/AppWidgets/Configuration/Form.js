import React from "react";
import Form from "@rjsf/bootstrap-4";
import {
  useBotConfig,
  useSaveFormBotConfig,
} from "../../../context/BotConfigProvider";
import notification from "../../../components/Notifications/Notification";

export default function Configuration(props) {
  const botConfigs = useBotConfig([props.configKey]);
  const _saveBotConfigs = useSaveFormBotConfig();
  function handleSaveForm(dataToStore) {
    _saveBotConfigs(props.configKey, dataToStore);
    notification(
      botConfigs[props.configKey].schema.title + " saved successfully",
      "success"
    );
  }
  function handleFormSaveError() {
    notification(
      "error saving " + botConfigs[props.configKey].schema.title,
      "danger"
    );
  }

  return botConfigs[props.configKey] && botConfigs[props.configKey].schema ? (
    <Form
      schema={botConfigs[props.configKey].schema}
      formData={botConfigs[props.configKey].data}
      // onChange={test => console.log(test)}
      onSubmit={(dataToStore) => handleSaveForm(dataToStore)}
      onError={handleFormSaveError}
    />
  ) : (
    <></>
  );
}
