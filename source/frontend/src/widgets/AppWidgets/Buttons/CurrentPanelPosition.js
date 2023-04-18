import React, {useMemo} from "react";
import {useCurrentPanelContext, useSetCurrentPanelPercent} from "../../../context/config/MainPanelContext";
import {Tooltip} from "antd";
// import {sizes} from "../../../constants/frontendConstants";
import AntButton from "../../../components/Buttons/AntButton";

function PanelSize ({position, title, icon, panelPercent}) {
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
                    title={title}
                    arrow={false}>
              <div>
                    <AntButton 
                        onClick={() => setPanelPercent(panelPercent)}
                        buttonVariant="text"
                        antIcon={icon}
                        style={{fontSize:'22px'}}>
                    </AntButton>
              </div>
                </Tooltip>
            </div>
        );
    }, [icon, panelPercent, title, setPanelPercent])
}

export default function CurrentPanelPosition(
    {position}
) {
    const currentPanel = useCurrentPanelContext()

    const props = {
        position,
        title:  (position === 'maximized' ? "Maximize Panel" : 
                (position === 'minimized' ? "Minimize Panel" : "Restore Panel")),
        icon:   (position === 'maximized' ? 'VerticalAlignTopOutlined' :  
                (position === 'minimized' ? 'VerticalAlignBottomOutlined' : 'VerticalAlignMiddleOutlined')),
        panelPercent:   (position === 'maximized' ? 0 : 
                        (position === 'minimized' ? 100 : 50))
    }
    if (props.position === 'maximized' && currentPanel?.percent !== 0)
        return(<PanelSize {...props} />)
    if (props.position === 'minimized' && currentPanel?.percent !== 100)
        return(<PanelSize {...props} />)
    if (props.position === 'half' && currentPanel?.percent !== 50)
        return(<PanelSize {...props} />)
    return (<></>
    );
}
