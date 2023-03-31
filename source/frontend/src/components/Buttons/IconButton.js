import React from "react";
import { Button } from 'antd';
import { buttonStyles } from "../Icons/AntIcon";


export default function IconButton (props) {
  return (
    <Button type="text" 
        style={{padding:"5px",
        height:buttonStyles.size.medium.buttonSize, 
        width:buttonStyles.size.medium.buttonSize, 
        alignItems: "center", 
        display: "flex",
        justifyContent: "center"}}>
        {props.icon}
    </Button>
)};



// createElement(icon, { style: { fontsieze: size } })