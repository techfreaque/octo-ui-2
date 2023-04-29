import AntButton from "./AntButton";

export default function AppIconButton({
    is_selected: isSelected,
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
    const noIconMargin = isSelected ? false : true
    const size = isSelected ? undefined : 'small'
    const buttonTitle_ = isSelected ? buttonTitle : splitText(buttonTitle);
    const buttonStyle = isSelected ? undefined : {
        margin: "3px",
        display: 'block',
        height: 'fit-content'
    }
    const spanStyle = isSelected ? undefined : {
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
