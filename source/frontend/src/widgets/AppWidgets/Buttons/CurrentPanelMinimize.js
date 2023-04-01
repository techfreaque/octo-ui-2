import {faWindowMinimize} from "@fortawesome/free-solid-svg-icons";
import {useMemo} from "react";
import {useSetCurrentPanelPercent} from "../../../context/config/MainPanelContext";
import {MuiIconButton} from "../../../components/Buttons/IconButton";
import {FaIconByReactFunc} from "../../../components/Icons/FontAwesome";
import {sizes} from "../../../constants/frontendConstants";
import {Tooltip} from "antd";

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
                            <FaIconByReactFunc icon={faWindowMinimize}
                                size={
                                    sizes.large
                                }/>
                        </MuiIconButton>
                    </div>
                </Tooltip>
            </div>
        );
    }, [setPanelSize])
}
