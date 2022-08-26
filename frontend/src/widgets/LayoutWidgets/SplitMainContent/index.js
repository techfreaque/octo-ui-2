import React from "react"
import AppWidgets from "../../AppWidgets"
import SplitPane from "react-split-pane"
import "./index.css"

export default function SplitMainContent(props) {
    const maxSize = props.height-49-6 // tabs + resizer
    const [panelSize, setPanelSize] = React.useState(maxSize*0.4) // default position 40%
    
    function minimizeCurrentPanel() {
        setPanelSize(maxSize)
    }
    function checkAndUpdatePanelSize(){
        setPanelSize(prevSize => {
            return prevSize ? prevSize < maxSize : maxSize
        })
    }
    window.addEventListener("resize", checkAndUpdatePanelSize)
    props.botDataManager.currentPanelHeight = panelSize
    props.botDataManager.currentPanelSetHeight = setPanelSize
    props.botDataManager.currentPanelMinimize = minimizeCurrentPanel

    const resizerStyle = {
        
        borderColor: props.botDataManager.colors.border}
    return (
        <div onResize={checkAndUpdatePanelSize} style={{height: "100%", width: "100%", position: "relative"}}>
            <SplitPane 
                    split="horizontal" 
                    resizerStyle={resizerStyle} 
                    defaultSize="40%" minSize={0} 
                    maxSize={maxSize}
                    size={panelSize}
                    onChange={size => setPanelSize(size)}
                    > 
                <div style={{overflow: "hidden"}}>
                    <AppWidgets {...props} layout={props.upperContent} 
                                dimensions={{height: panelSize, width:props.width}}
                    />
                </div>
                <div style={{height: props.height-panelSize}}>
                    <AppWidgets {...props} layout={props.lowerContent} 
                    // dimensions={dimensions.lowerPart}
                    />
                </div>
            </SplitPane>
        </div>
    )
}