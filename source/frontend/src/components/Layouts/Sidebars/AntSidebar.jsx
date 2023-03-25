import { Collapse, Menu, Space } from "antd"
import { Button } from "antd/es/radio";
import { useState } from "react";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import { useColorModeContext } from "../../../context/config/ColorModeProvider";
import "./antSidebar.css"
const { Panel } = Collapse;


const menuItems = [{
    label: "Strategy_1_Settings",
    content: "gfhgffgfg inputs of the thing",
    key: "hfghfgh",
    icon: "faStop",
    children: [
        {
            label: "Evaluator 1",
            content: "user inputs of the sub fgfghghffghfghfghfg",
            key: "dfghfg",
            icon: "faStop",
            children: [{
                label: "Evaluator 1",
                content: "user inputs of the sub fghfghfhgfghf",
                key: "ghfgh",
                icon: "faStop",
            },
            {
                label: "Evaluator 1",
                content: "user inputs of the sub fghfhgfhgf",
                key: "fghfghf",
                icon: "faStop",
            }
            ]
        },


    ]
},
{
    label: "Evaluator 1",
    content: "user inputs of the sub thing",
    key: "dffdfds1",
    icon: "faStop",
    children: [{
        label: "Evaluator 1",
        content: "user fghgfhgfhgfhfggfhfginputs of the sub thing",
        key: "dfgdfgdfgdfg",
        icon: "faStop",
    },
    {
        label: "Evaluator 1",
        content: "user fdghfghghfgfhgfhgfh of the sub thing",
        key: "dfgdfgdf",
        icon: "faStop",
    }
    ]
},

]

export default function AntSidebar({ content }) {
    const botColors = useBotColorsContext();
    const [currentlySelectedMenu, setCurrentlySelectedMenu] = useState();
    const activeMenus = []
    const currentContent = findCurrentContent(
        menuItems, currentlySelectedMenu, activeMenus
    )
    return (
        <div style={{ height: "100%", width: "100%", display: "flex" }}>
            <div style={{ width: "300px" }}>
                <MenuItems menuItems={menuItems}
                    currentlySelectedMenu={currentlySelectedMenu}
                    activeMenus={activeMenus}
                    setCurrentlySelectedMenu={setCurrentlySelectedMenu} />
            </div>
            <div style={{ width: "calc(100% - 300px)", borderLeft: "4px solid " + botColors.border }}>
                {currentContent}
            </div>

        </div>

    )
}

function findCurrentContent(
    menuItemsData, currentlySelectedMenu, activeMenus
) {
    for (let currentItemIndex = 0; currentItemIndex < menuItemsData.length; currentItemIndex++) {
        if (menuItemsData[currentItemIndex].key === currentlySelectedMenu) {
            activeMenus.push(menuItemsData[currentItemIndex].key)
            return menuItemsData[currentItemIndex].content
        } else if (menuItemsData[currentItemIndex].children) {
            const foundContent = findCurrentContent(
                menuItemsData[currentItemIndex].children, currentlySelectedMenu, activeMenus
            )
            if (foundContent) {
                activeMenus.push(menuItemsData[currentItemIndex].key)
                return foundContent
            } else {
                // return undefined
            }
        } else {
            // return undefined
        }
    }
}


function MenuItems({ menuItems, currentlySelectedMenu, setCurrentlySelectedMenu, activeMenus }) {
    return menuItems.map((menuItem) => {
        return <div style={{ padding: "10px" }}>
            <MenuItem
                  mode="inline"
                menuItem={menuItem} currentlySelectedMenu={currentlySelectedMenu}
                setCurrentlySelectedMenu={setCurrentlySelectedMenu}
                activeMenus={activeMenus}
            />
        </div>
        // <Space direction="vertical" style={{ width: "100%" }} >
        // {/* </Space> */ }
    })
}

function MenuItem({ menuItem, currentlySelectedMenu, setCurrentlySelectedMenu, activeMenus }) {
    function handleCUrenntChange() {
        console.log("fsdfsdfsdf")
        setCurrentlySelectedMenu(menuItem.key)
    }

    const background = currentlySelectedMenu === menuItem.key ? "#ddd" : "#fff"
    const botColors = useBotColorsContext();
    const colorMode = useColorModeContext()
    return menuItem.children ?
        <Collapse  className={`sidebar-collapse-${colorMode}`} activeKey={activeMenus} collapsible="header"
            onChange={handleCUrenntChange} style={{  border: "none",color: botColors.font }}
        >
            <Panel className={`sidebar-panel-${colorMode}`} header={<span style={{ color: botColors.font }}>{menuItem.label}</span>} key={menuItem.key}
                style={{
                    border: "none",
                    color: botColors.font
                }}
            >
                <MenuItems menuItems={menuItem.children}

                    currentlySelectedMenu={currentlySelectedMenu}
                    setCurrentlySelectedMenu={setCurrentlySelectedMenu} />
                {/* <p>rtzrtz</p> */}
            </Panel>
        </Collapse>
        : <div style={{ width: "100%" }}>
            <Button
                
                // style={{ background }}
                onClick={handleCUrenntChange} >
                {menuItem.label}
            </Button>
        </div>


}