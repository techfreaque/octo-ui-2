import React from "react";
import { Space, Tag, Badge } from 'antd';

export default function NumberTag (props) {
    return (
    <Space>
        <Tag 
            color={props.color} 
            style={{fontSize:'15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding:'0 5px 0 2px'}}>
            {<Badge 
                count={props.count} showZero 
                style={{width: '15px', 
                        height: '15px', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        margin:'5px'}}/> } 
            {props.text}</Tag>
    </Space>
)};
