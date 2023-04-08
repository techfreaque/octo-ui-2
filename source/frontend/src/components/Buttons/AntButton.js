import React from "react";
import { Button, Space, ConfigProvider } from 'antd';
import { useBotColorsContext } from "../../context/config/BotColorsProvider";
import IconFromString from "../Icons/IconFromString";
import { sizes } from "../../constants/frontendConstants";
import { AntIconByReactFunc } from "../Icons/AntIcon";
import { FaIconByReactFunc } from "../Icons/FontAwesome";


export const buttonTypes = {
  success: "success",
  warning: "warning",
  danger: "danger",
}

export default function AntButton({
  buttonType = buttonTypes.success,
  onClick,
  text,

  // icon components
  faIconComponent,
  antIconComponent
  ,
  // string icons
  faIcon,
  antIcon,


}) {
  const botColors = useBotColorsContext();
  return (
  <Space wrap>
    <ConfigProvider theme={{
          "token": {
          "colorError": botColors[buttonType]}}
    }>
      <Button danger  type
          onClick={onClick}
          style={{ margin: '5px', padding: '4px 10px', display: "flex" }}>
          {(faIcon || antIcon) && (<IconFromString faIcon={faIcon} antIcon={antIcon}  size={sizes.small } />)}
          {antIconComponent && <AntIconByReactFunc AntReactIcon={antIconComponent} size={sizes.small }/>}

          {faIconComponent && <FaIconByReactFunc icon={faIconComponent}  size={sizes.small } marginRight= "5px" />}
          {text}
      </Button>
    </ConfigProvider>
  </Space>
)};

