import {Radio, Space, Tooltip} from "antd";
import AntButton from "./AntButton";

export default function RadioButtonGroup({rightContent, menuItems, onChange, selected}) {
    return (<Radio.Group onChange={onChange}
        defaultValue={selected}
        style={
            {
                margin: "auto",
                marginRight: "5px"
            }
    }>
        <Space> 
        {
            menuItems?.map(item => {
                return (<Tooltip key={
                        item.key
                    }
                    title={
                        item?.toolTipText
                }>
                    <AntButton 
                        selected={selected === item.key}
                        onClick={() => onChange && onChange(item.key)} 
                        text = {item.label}
                        buttonVariant="text"
                    />
                     
                </Tooltip>)
            })
        }
            {
            rightContent && rightContent
        } </Space>
    </Radio.Group>)
}
