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
    fontSecondary: "fontSecondary"
}

export const buttonVariants = {
    primary: "primary",
    outline: "outline",
    text: "text"
}

export const buttonSizes = {
    small: "small",
    middle: "middle",
    large: "large"
}

export default function AntButton({
    buttonType = buttonTypes.success,
    onClick,
    text,
    style,
    buttonVariant = buttonVariants.outline,
    size = buttonSizes.middle,
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
    children,
    noIconMargin = false,
    spanStyle = {},
    target

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
    if (href) {
        _style.width = "fit-content"
    }

    const _spanStyle = spanStyle
    if (buttonVariant === buttonVariants.text) {
        _spanStyle.display = 'flex'
    } else {
        _spanStyle.height = '6px'
        _spanStyle.lineHeight = '5px'
    }

    const iconMargin = (!noIconMargin && (text || children)) ? "5px" : "0px";
    return (
        <ConfigProvider theme={theme}>
            <Button icon={
                    (
                        <> {
                            (faIcon || antIcon) && (
                                <IconFromString faIcon={faIcon}
                                    antIcon={antIcon}
                                    size={iconSize}
                                    marginRight={iconMargin}
                                    spin={spin}/>
                            )
                        }
                            {
                            antIconComponent && (
                                <AntIconByReactFunc AntReactIcon={antIconComponent}
                                    size={iconSize}
                                    marginRight={iconMargin}
                                    spin={spin}/>
                            )
                        }
                            {
                            faIconComponent && (
                                <FaIconByReactFunc icon={faIconComponent}
                                    size={iconSize}
                                    marginRight={iconMargin}
                                    spin={spin}/>
                            )
                        }

                            {
                            icon && icon
                        } </>
                    )
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
                size={size}
                target={target}
                style={
                    {
                        marginRight,
                        marginTop: "auto",
                        marginBottom: "auto",
                        display: "flex",
                        textDecoration: "none",
                        ..._style,
                        ...style
                    }
            }>

                <span style={
                    {
                        margin: "auto",
                        ..._spanStyle
                    }
                }>
                    {text}
                    {children} </span>
            </Button>
        </ConfigProvider>
    )
};
