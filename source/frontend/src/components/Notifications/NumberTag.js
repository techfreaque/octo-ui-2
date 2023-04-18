import React from "react";
import { Space, Tag, Badge } from 'antd';
import { useBotColorsContext } from "../../context/config/BotColorsProvider";

export default function NumberTag (props) {
    
    const formatCash = n => {
        if (n < 1e3) return n.toString();
        if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(2) + "K";
        if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(2) + "M";
        if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(2) + "B";
        if (n >= 1e12) return +(n / 1e12).toFixed(2) + "T";
      };
    const count = formatCash(props.count)
    const badgesizef = n => {
        if (n.length < 2) return '15px';
        if (n.length === 2) return '25px';
        if (n.length === 3) return '30px';
        if (n.length === 4) return '35px';
        if (n.length === 5) return '45px';
        if (n.length > 5) return '48px';
    };
    const badgesize = badgesizef(count)
    const botColors = useBotColorsContext();
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
                    overflowCount={999} 
                    count={count} showZero 
                    style={{width: badgesize, 
                            height: '15px', 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            margin:'5px',
                            backgroundColor: botColors.primary
                            }}/> } 
            {props.text}</Tag>
    </Space>
)};
