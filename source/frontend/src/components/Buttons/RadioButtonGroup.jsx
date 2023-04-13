import {Radio, Tooltip} from "antd";
import RadioButton from "./RadioButton";

export default function RadioButtonGroup({rightContent, menuItems, onChange, selected}) {
    return (<Radio.Group onChange={onChange}
        defaultValue={selected}
        style={
            {
                margin: "auto",
                marginRight: "5px"
            }
    }>
        <> {
            menuItems?.map(item => {
                return (<Tooltip key={
                        item.key
                    }
                    title={
                        item?.toolTipText
                }>
                    <RadioButton selected={
                            selected === item.key
                        }
                        onClick={
                            () => onChange && onChange(item.key)
                    }> {
                        item.label
                    } </RadioButton>
                </Tooltip>)
            })
        }
            {
            rightContent && rightContent
        } </>
    </Radio.Group>)
}
