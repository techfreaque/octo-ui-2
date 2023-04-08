import React from 'react'
import { ConfigProvider, Switch, Tooltip } from 'antd';
import { useBotColorsContext } from '../../context/config/BotColorsProvider';

export default function ResetIndividual( {
    title,
    description,
}) {
    const botColors = useBotColorsContext()
    return (
        <div style={{display: 'flex', justifyContent: 'space-between', margin:'10px auto'}}>
                <Tooltip title={description} placement="right">
                    <spam>{title}</spam>
                </Tooltip>
            <ConfigProvider theme={{
                "token": {
                "colorPrimary": botColors.error}}
            }>
                <Switch checkedChildren="Reset"/>
            </ConfigProvider>
        </div>
    )
}
