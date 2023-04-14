import React, {useMemo} from "react";
import {useSetCurrentPanelPercent} from "../../../context/config/MainPanelContext";
import {Tooltip} from "antd";
// import {sizes} from "../../../constants/frontendConstants";
import { VerticalAlignTopOutlined } from "@ant-design/icons";
import AntButton from "../../../components/Buttons/AntButton";

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
                    <AntButton onClick={
                        () => setPanelPercent(0)
                    }
                        buttonVariant="text">
                        <VerticalAlignTopOutlined style={{fontSize:'22px'}} />
                    </AntButton>
              </div>
                </Tooltip>
            </div>
        );
    }, [setPanelPercent])
}
