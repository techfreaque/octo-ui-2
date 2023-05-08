import {useMediaQuery} from "@mui/material";
import AntButton from "./AntButton";
import {sizes} from "../../constants/frontendConstants";
import { useBotColorsContext } from "../../context/config/BotColorsProvider";

export default function AppIconButton({
    isSelected,
    active,
    buttonTitle,
    icon,
    faIconComponent,
    antIconComponent,
    antIconString,
    faIconString,
    onClick,
    disabled,
    href,
    isResponsive = true,
    style={}
}) {
    const isBigScreen = useMediaQuery('(min-width:585px)');
    const botColors = useBotColorsContext()
    const showBlockButton = isResponsive ? (isBigScreen && isSelected) : false
    return showBlockButton ? (<AntButton href={href}
    disabled={disabled}
    icon={icon}
    faIconComponent={faIconComponent}
    antIconComponent={antIconComponent}
    antIcon={antIconString}
    faIcon={faIconString}
    onClick={onClick}
    buttonVariant="text"> {buttonTitle} </AntButton>) : (<AntButton noIconMargin={true}
        size={
            sizes.small
        }
        icon={icon}
        href={href}
        disabled={disabled}
        style={
            {
                margin: "3px",
                display: 'block',
                height: 'fit-content',
                ...(active ? {color: botColors?.fontActive}:{}),
                ...style
            }
        }
        spanStyle={
            {
                whiteSpace: 'pre-line',
                wordWrap: 'break-word',
                fontSize: '12px',
                lineHeight: '14px',
                marginTop: '5px'
            }
        }
        antIcon={antIconString}
        faIcon={faIconString}
        faIconComponent={faIconComponent}
        antIconComponent={antIconComponent}
        onClick={onClick}
        buttonVariant="text"> {
        splitText(buttonTitle)
    } </AntButton>);
}

const splitText = (text) => {
    const words = text.split(" ");
    const limit = 10;
    const result = words.reduce((lines, word) => {
        const lastLine = lines[lines.length - 1];
        if (word.length < 3 || lastLine.length + word.length + 1 > limit) {
            lines.push(word);
        } else {
            lines[lines.length - 1] += ` ${word}`;
        }
        return lines;
    }, [""]);
    return result.includes('&') ? result.join(" ").replace(/& /g, "&\n") : result.join("\n");
};
