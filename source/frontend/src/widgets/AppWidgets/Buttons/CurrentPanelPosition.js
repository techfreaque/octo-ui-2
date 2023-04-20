import React, {useMemo} from "react";
import {useCurrentPanelContext, useSetCurrentPanelPercent} from "../../../context/config/MainPanelContext";
import {Tooltip} from "antd";
import AntButton from "../../../components/Buttons/AntButton";

function PanelSize({position, title, icon, panelPercent}) {
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
                        <AntButton onClick={
                                () => setPanelPercent(panelPercent)
                            }
                            buttonVariant="text"
                            antIcon={icon}
                            style={
                                {fontSize: '22px'}
                        }></AntButton>
                    </div>
                </Tooltip>
            </div>
        );
    }, [icon, panelPercent, title, setPanelPercent])
}

export const availablePanelPositions = {
    maximized: "maximized",
    minimized: "minimized",
    half: "half"
}
export const availablePanelPositionsArray = [availablePanelPositions.maximized, availablePanelPositions.minimized, availablePanelPositions.half]

export default function CurrentPanelPosition({position}) {
    const currentPanel = useCurrentPanelContext()
    const props = {
        position,
        title: (position === availablePanelPositions.maximized ? "Maximize Panel" : (position === availablePanelPositions.minimized ? "Minimize Panel" : "Restore Panel")),
        icon: (position === availablePanelPositions.maximized ? 'VerticalAlignTopOutlined' : (position === availablePanelPositions.minimized ? 'VerticalAlignBottomOutlined' : 'VerticalAlignMiddleOutlined')),
        panelPercent: (position === availablePanelPositions.maximized ? 0 : (position === availablePanelPositions.minimized ? 100 : 50))
    }
    if (props.position === availablePanelPositions.maximized && currentPanel?.percent !== 0) 
        return (
            <PanelSize {...props}/>
        )
    if (props.position === availablePanelPositions.minimized && currentPanel?.percent !== 100) 
        return (
            <PanelSize {...props}/>
        )
    if (props.position === availablePanelPositions.half && currentPanel?.percent !== 50) 
        return (
            <PanelSize {...props}/>
        )
    return (
        <></>
    );
}
