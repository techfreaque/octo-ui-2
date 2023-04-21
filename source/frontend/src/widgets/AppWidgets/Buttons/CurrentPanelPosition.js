import React, {useMemo} from "react";
import {useCurrentPanelContext, useSetCurrentPanelPercent} from "../../../context/config/MainPanelContext";
import {Tooltip} from "antd";
import AntButton from "../../../components/Buttons/AntButton";


export const availablePanelPositions = {
    maximized: "maximized",
    minimized: "minimized",
    half: "half",
    footerHalf: "footerHalf"
}
export const availablePanelPositionsArray = [availablePanelPositions.maximized, availablePanelPositions.minimized, availablePanelPositions.half]

export default function CurrentPanelPosition({position}) {
    const currentPanel = useCurrentPanelContext()
    const props = {
        title: (position === availablePanelPositions.maximized ? "Maximize Panel" : (position === availablePanelPositions.minimized ? "Minimize Panel" : "Restore Panel")),
        icon: (position === availablePanelPositions.maximized ? 'VerticalAlignTopOutlined' : (position === availablePanelPositions.minimized ? 'VerticalAlignBottomOutlined' : 'VerticalAlignMiddleOutlined')),
        panelPercent: (position === availablePanelPositions.maximized ? 0 : (position === availablePanelPositions.minimized ? 100 : 50))
    }
    if (position === availablePanelPositions.maximized) {
        return currentPanel?.percent > 5 && (
            <PanelSize {...props}/>
        )
    } else if (position === availablePanelPositions.minimized) {
        return currentPanel?.percent !== 100 && (
            <PanelSize {...props}/>
        )
    } else if (position === availablePanelPositions.half) {
        return !(30 <= currentPanel?.percent && currentPanel?.percent <= 70) && (
            <PanelSize {...props}/>
        )
    } else if (position === availablePanelPositions.footerHalf) {
        return currentPanel?.percent === 100 && (
            <PanelSize {...props}/>
        )
    }
    return (
        <></>
    );
}

function PanelSize({title, icon, panelPercent}) {
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
