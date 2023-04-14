import React from "react";
import {Button, ConfigProvider} from 'antd';
import {useBotColorsContext} from "../../context/config/BotColorsProvider";
import IconFromString from "../Icons/IconFromString";
import {sizes} from "../../constants/frontendConstants";
import {AntIconByReactFunc} from "../Icons/AntIcon";
import {FaIconByReactFunc} from "../Icons/FontAwesome";


export const buttonTypes = {
    success: "success",
    black: "black",
    warning: "warning",
    error: "error",
    primary: "primary",
    white: "white",
}

export const buttonVariants = {
    primary: "primary",
    outline: "outline",
    text: "text",
}

export default function AntButton({
    buttonType = buttonTypes.success,
    onClick,
    text,
    style,
    buttonVariant = buttonVariants.outline,
    block = false,
    disabled = false,
    iconSize = sizes.small,
    // icon components
    faIconComponent,
    antIconComponent,
    // string icons
    faIcon,
    antIcon,
    icon,
    selected,

    spin,

    marginRight = "0px",

    href,
    children

}) {
    const botColors = useBotColorsContext();
    const _style = block ? { // justifyContent: "center"
    } : {}
    if (buttonType === buttonTypes.black) {
        _style.color = botColors?.white
    }
    const theme = {
        token: {
            colorError: botColors[buttonType],
            colorPrimary: botColors[buttonType]
        }
    };
    if (buttonVariant === buttonVariants.text) {
        _style.padding = '0px 8px'
    }

    if (selected) {
        _style.color = botColors?.fontActive
    }

    const spanStyle = {}
    if (buttonVariant === buttonVariants.text) {
        spanStyle.display = 'flex'
    }
    else {
        spanStyle.height= '6px'
        spanStyle.lineHeight= '5px'
    }

    const iconMargin = (text || children) ? "5px" : "0px";
    return (<ConfigProvider theme={theme}>
        <Button icon={
                (<> {
                    (faIcon || antIcon) && (<IconFromString faIcon={faIcon}
                        antIcon={antIcon}
                        size={iconSize}
                        marginRight={iconMargin}
                        spin={spin}/>)
                }
                    {
                    antIconComponent && (<AntIconByReactFunc AntReactIcon={antIconComponent}
                        size={iconSize}
                        marginRight={iconMargin}
                        spin={spin}/>)
                }
                    {
                    faIconComponent && (<FaIconByReactFunc icon={faIconComponent}
                        size={iconSize}
                        marginRight={iconMargin}
                        spin={spin}/>)
                }
                
                    {
                    icon && icon 
                    } </>)
            }
            danger={
                buttonVariant === buttonVariants.outline
            }
            type={
                buttonVariant === buttonVariants.outline ? 'default' : buttonVariant
            }
            block={block}
            disabled={disabled}
            onClick={onClick}
            href={href}
            style={
                {
                    marginRight,
                    marginTop: "auto",
                    marginBottom: "auto",
                    display: "flex",
                    ..._style,
                    ...style
                }
        }>

            <span style={
                {margin: "auto",
                ...spanStyle}
            }> {text}
                {children} </span>
        </Button>
    </ConfigProvider>)
};
