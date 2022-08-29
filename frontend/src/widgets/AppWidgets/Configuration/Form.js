import Form from "@rjsf/bootstrap-4";
import { useBotConfig, useSaveFormBotConfig } from "../../../context/BotConfigProvider";
import { Store } from 'react-notifications-component';

export default function Configuration(props){
  // const _useFetchBotConfigs = useFetchBotConfigs()
  const botConfigs = useBotConfig([props.configKey])
  const _saveBotConfigs = useSaveFormBotConfig()

  // useEffect(() => {
  //   _useFetchBotConfigs(props.botDataManager, [props.configKey])
  // }, [])  
  console.log(props)
  return botConfigs[props.configKey] && botConfigs[props.configKey].schema
    ? <Form 
            schema={botConfigs[props.configKey].schema}
            formData={botConfigs[props.configKey].data}
            // onChange={test => console.log(test)}
            onSubmit={dataToStore => {
              _saveBotConfigs(props.configKey, dataToStore)
              Store.addNotification({
                title: botConfigs[props.configKey].schema.title + " saved successfully",
                // message: botConfigs[props.configKey].schema.title + "Your Data has been saved",
                type: "success",
                insert: "top",
                container: "bottom-left",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              });
            }}
            // onError={test => console.log(test)} 
      />
    : <></>
}