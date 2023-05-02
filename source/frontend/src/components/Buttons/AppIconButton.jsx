import {useMediaQuery} from "@mui/material";
import AntButton from "./AntButton";
import { sizes } from "../../constants/frontendConstants";

export default function AppIconButton({
    isSelected,
    buttonTitle,
    faIconComponent,
    antIconComponent,
    onClick,
    disabled,
    href
}) {
    const isBigScreen = useMediaQuery('(min-width:585px)');
    const showBlockButton = isBigScreen && isSelected
    if (showBlockButton) {
        return (<AntButton
            href={href}
            disabled={disabled}
            faIconComponent={faIconComponent}
            antIconComponent={antIconComponent}
            onClick={onClick}
            buttonVariant="text"> {buttonTitle} </AntButton>)
    } else {
        return (<AntButton noIconMargin={true}
            size={sizes.small}
            href={href}
            disabled={disabled}
            style={
                {
                    margin: "3px",
                    display: 'block',
                    height: 'fit-content'
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
            faIconComponent={faIconComponent}
            antIconComponent={antIconComponent}
            onClick={onClick}
            buttonVariant="text"> {splitText(buttonTitle)} </AntButton>)
    }
}

const splitText = (text) => {
    const words = text.split(" ");
    const limit = 10;
    const result = words.reduce((lines, word) => {
        const lastLine = lines[lines.length - 1];
        if (word.length < 3 || lastLine.length + word.length + 1 > limit) {
            lines.push(word);
        } else {
            lines[lines.length - 1] += " " + word;
        }
        return lines;
    }, [""]);
    const newResult = result.includes('&') ? result.join(" ").replace(/& /g, "&\n") : result.join("\n")
    return newResult;
};