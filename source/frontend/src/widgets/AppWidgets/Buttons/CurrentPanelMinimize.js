import {useMemo} from "react";
import {useSetCurrentPanelPercent} from "../../../context/config/MainPanelContext";
import {MuiIconButton} from "../../../components/Buttons/IconButton";
// import {sizes} from "../../../constants/frontendConstants";
import {Tooltip} from "antd";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";

export default function CurrentPanelMinimize() {
    const setPanelSize = useSetCurrentPanelPercent()
    return useMemo(() => {
        return (
            <div style={
                {
                    marginTop: "auto",
                    marginBottom: "auto"
                }
            }>
                <Tooltip placement="top"
                    title={"Minimize Panel"}
                    arrow={false}>
                    <div>
                        <MuiIconButton onClick={
                            () => setPanelSize(100)
                        }>
                          <VerticalAlignBottomOutlined style={{fontSize:'22px'}}/>
                        </MuiIconButton>
                    </div>
                </Tooltip>
            </div>
        );
    }, [setPanelSize])
}
