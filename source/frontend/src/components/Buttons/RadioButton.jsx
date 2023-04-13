import {Button} from "antd";
import {useBotColorsContext} from "../../context/config/BotColorsProvider";

export default function RadioButton({children, selected, onClick}) {
    const botColors = useBotColorsContext();

    const fontStyle = selected ? {
        color: botColors?.fontActive
    } : {}
    return (<Button onClick={onClick}
        style={
            {
                padding: "0px 8px",
                ...fontStyle,
                // margin: "auto"
            }
        }
        type={"text"}>
        <span style={
            {
                margin: "auto",
                display: "flex"
            }
        }> {children} </span>
    </Button>)
}
