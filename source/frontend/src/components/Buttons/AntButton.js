import React from "react";
import {Button, ConfigProvider} from 'antd';
import {useBotColorsContext} from "../../context/config/BotColorsProvider";
import IconFromString from "../Icons/IconFromString";
import {sizes} from "../../constants/frontendConstants";
import {AntIconByReactFunc} from "../Icons/AntIcon";
import {FaIconByReactFunc} from "../Icons/FontAwesome";


export const buttonTypes = {
    success: "success",
    warning: "warning",
    error: "error",
    primary: "primary"
}

export const buttonVariants = {
    primary: "primary",
    outline: "outline"
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

    spin,

    marginRight = "0px",

    href,
    children

}) {
    const _style = block ? {
        // justifyContent: "center"
    } : {}
    const botColors = useBotColorsContext();
    const theme = {
        token: {
            colorError: botColors[buttonType],
            colorPrimary: botColors[buttonType]
        }
    };
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
                {margin: "auto"}
            }> {text}
                {children} </span>
        </Button>
    </ConfigProvider>)
};
