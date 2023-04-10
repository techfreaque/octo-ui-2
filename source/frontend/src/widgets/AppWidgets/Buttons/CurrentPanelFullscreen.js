import React, {useMemo} from "react";
import {useSetCurrentPanelPercent} from "../../../context/config/MainPanelContext";
import {Tooltip} from "antd";
import {MuiIconButton} from "../../../components/Buttons/IconButton";
// import {sizes} from "../../../constants/frontendConstants";
import { VerticalAlignTopOutlined } from "@ant-design/icons";

export default function CurrentPanelFullscreen() {
    const setPanelPercent = useSetCurrentPanelPercent()
    return useMemo(() => {
        return (
            <div style={
                {
                    marginTop: "auto",
                    marginBottom: "auto"
                }
            }>
                <Tooltip placement="topRight"
                    title={"Maximize Panel"}
              arrow={false}>
              <div>
                    <MuiIconButton onClick={
                        () => setPanelPercent(0)
                    }>
                        <VerticalAlignTopOutlined style={{fontSize:'22px'}} />
                    </MuiIconButton>
              </div>
                </Tooltip>
            </div>
        );
    }, [setPanelPercent])
}
