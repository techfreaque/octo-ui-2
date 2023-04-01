import React from "react";
import {Button} from 'antd';
import {sizes} from "../../constants/frontendConstants";
import {Button as MuiButton} from "@mui/material";
import {buttonStyles} from "./buttonStyles";


export default function IconButton({
    icon,
    size = sizes.medium
}) {
    return (
        <Button type="text"
            style={
                {
                    padding: "5px",
                    height: buttonStyles.size[size].buttonSize,
                    width: buttonStyles.size[size].buttonSize,
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center"
                }
        }>
            {icon} </Button>
    )
};

export function MuiIconButton({children, onClick, disabled}) {
    return (
        <MuiButton onClick={onClick}
            disabled={disabled}
            style={
                {
                    marginRight: "0px",
                    marginLeft: "0px",
                    paddingRight: "15px",
                    paddingLeft: "15px",
                    minWidth: "auto"
                }
        }>
            {children} </MuiButton>
    )
};
