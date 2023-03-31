import React from "react";
import { Button } from 'antd';
import { buttonStyles } from "../Icons/AntIcon";
import { sizes } from "../../constants/frontendConstants";


export default function IconButton ({icon, size= sizes.medium}) {
  return (
    <Button type="text" 
        style={{padding:"5px",
        height:buttonStyles.size[size].buttonSize, 
        width:buttonStyles.size[size].buttonSize, 
        alignItems: "center", 
        display: "flex",
        justifyContent: "center"}}>
        {icon}
    </Button>
)};



// createElement(icon, { style: { fontsieze: size } })