import {useMemo} from "react";
import {useSetCurrentPanelPercent} from "../../../context/config/MainPanelContext";
// import {sizes} from "../../../constants/frontendConstants";
import {Tooltip} from "antd";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import AntButton from "../../../components/Buttons/AntButton";

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
                        <AntButton onClick={
                            () => setPanelSize(100)
                        }
                            buttonVariant="text">
                          <VerticalAlignBottomOutlined style={{fontSize:'22px'}}/>
                        </AntButton>
                    </div>
                </Tooltip>
            </div>
        );
    }, [setPanelSize])
}
