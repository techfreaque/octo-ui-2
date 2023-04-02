import React from "react";
import { Button, Space, ConfigProvider } from 'antd';


export default function WarningButton (props) {
  return (
  <Space wrap>
    <ConfigProvider theme={{
          "token": {
          "colorError": props.color}}
    }>
      <Button danger 
          onClick={props.onClick}
          style={{margin:'5px', padding:'4px 10px'}}>
          {props.icon} {props.text}
      </Button>
    </ConfigProvider>
  </Space>
)};

