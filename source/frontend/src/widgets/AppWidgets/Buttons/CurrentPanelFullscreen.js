import {faWindowMaximize} from "@fortawesome/free-solid-svg-icons";
import React, {useMemo} from "react";
import {useSetCurrentPanelPercent} from "../../../context/config/MainPanelContext";
import {Tooltip} from "antd";
import {MuiIconButton} from "../../../components/Buttons/IconButton";
import {FaIconByReactFunc} from "../../../components/Icons/FontAwesome";
import {sizes} from "../../../constants/frontendConstants";

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
                        <FaIconByReactFunc icon={faWindowMaximize}
                            size={
                                sizes.large
                            }/>
                    </MuiIconButton>
              </div>
                </Tooltip>
            </div>
        );
    }, [setPanelPercent])
}
