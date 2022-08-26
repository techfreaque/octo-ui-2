import Form from "@rjsf/core";
import { useBotConfig, useSaveFormBotConfig } from "../../../context/BotConfigProvider";

export default function Configuration(props){
  const botConfigs = useBotConfig([props.configKey])
  const _saveBotConfigs = useSaveFormBotConfig()

  return botConfigs[props.configKey].schema 
  ? <Form 
          schema={botConfigs[props.configKey].schema}
          formData={botConfigs[props.configKey].data}
          // onChange={test => console.log(test)}
          onSubmit={dataToStore => _saveBotConfigs(props.configKey, dataToStore)}
          // onError={test => console.log(test)} 
    />
  : <></>
}