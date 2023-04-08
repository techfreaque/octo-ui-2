import React from "react";
import { Button, ConfigProvider } from 'antd';
import { useBotColorsContext } from "../../context/config/BotColorsProvider";
import IconFromString from "../Icons/IconFromString";
import { sizes } from "../../constants/frontendConstants";
import { AntIconByReactFunc } from "../Icons/AntIcon";
import { FaIconByReactFunc } from "../Icons/FontAwesome";


export const buttonTypes = {
  success: "success",
  warning: "warning",
  error: "error",
  primary: "primary",
}

export const buttonVariants = {
  primary: "primary",
  outline: "outline",
}

export default function AntButton({
  buttonType = buttonTypes.success,
  onClick,
  text,
  style,
  buttonVariant = buttonVariants.outline,
  block = false,
  disabled = false,

  // icon components
  faIconComponent,
  antIconComponent
  ,
  // string icons
  faIcon,
  antIcon,

  spin,

  marginRight= "0px"

}) {
  const _style = block ? {justifyContent: "center"}: {} 
  const botColors = useBotColorsContext();
  return (
    <ConfigProvider theme={{
          "token": {
          "colorError": botColors[buttonType],
          "colorPrimary": botColors[buttonType]}}
    }>
      <Button 
          danger={buttonVariant === buttonVariants.outline} 
          type={buttonVariant === buttonVariants.outline ? 'default' : buttonVariant}
          block={block}
          disabled={disabled}
          onClick={onClick}
        style={{
          marginRight, 
          marginTop: "auto",
          marginBottom: "auto",
          display: "flex", ..._style, ...style
        }}>
          {(faIcon || antIcon) && (<IconFromString faIcon={faIcon} antIcon={antIcon}  size={sizes.small } spin={spin}/>)}
          {antIconComponent && <AntIconByReactFunc AntReactIcon={antIconComponent} size={sizes.small } spin={spin}/>}
          {faIconComponent && <FaIconByReactFunc icon={faIconComponent}  size={sizes.small } marginRight= "5px" spin={spin}/>}
          {text}
      </Button>
    </ConfigProvider>
)};

