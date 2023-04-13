import React from 'react'
import { ConfigProvider, Switch, Tooltip } from 'antd';
import { useBotColorsContext } from '../../../context/config/BotColorsProvider';

export default function ResetIndividual( {
    title,
    description,
    handleCheckboxClick,
    checkedList,
    titleKey    
}) {
    const botColors = useBotColorsContext()
    return (
        <div style={{display: 'flex', justifyContent: 'space-between', margin:'10px auto'}}>
                <Tooltip title={description} placement="right">
                    <span>{title}</span>
                </Tooltip>
            <ConfigProvider theme={{
                "token": {
                "colorPrimary": botColors?.error}}
            }>
                <Switch checked={checkedList[titleKey]}  onChange={(state)=>handleCheckboxClick(titleKey, state)}   checkedChildren="Reset"/>
            </ConfigProvider>
        </div>
    )
}
