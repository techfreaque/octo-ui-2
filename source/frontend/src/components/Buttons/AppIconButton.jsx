import { useMediaQuery } from "@mui/material";
import AntButton from "./AntButton";

export default function AppIconButton({
    isSelected,
    buttonTitle,
    faIconComponent,
    antIconComponent,
    onClick,
    disabled
}) {
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
    const isBigScreen = useMediaQuery('(min-width:630px)');
    const showBlockButton = isBigScreen  && isSelected

    const noIconMargin = showBlockButton ? false : true
    const size = showBlockButton ? undefined : 'small'
    const buttonTitle_ = showBlockButton ? buttonTitle : splitText(buttonTitle);
    const buttonStyle = showBlockButton ? undefined : {
        margin: "3px",
        display: 'block',
        height: 'fit-content'
    }
    const spanStyle = showBlockButton ? undefined : {
        whiteSpace: 'pre-line',
        wordWrap: 'break-word',
        fontSize: '12px',
        lineHeight: '14px',
        marginTop: '5px'
    }
    return (<AntButton style={buttonStyle}
        noIconMargin={noIconMargin}
        size={size}
        disabled={disabled}
        spanStyle={spanStyle}
        faIconComponent={faIconComponent}
        antIconComponent={antIconComponent}
        onClick={onClick}
        buttonVariant="text"> {buttonTitle_} </AntButton>)
}
