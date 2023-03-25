import {Collapse, Button} from "antd"
import {useMemo} from "react";
import {useState} from "react";
import {useBotColorsContext} from "../../../context/config/BotColorsProvider";
import {useColorModeContext} from "../../../context/config/ColorModeProvider";
import "./antSidebar.css"
const {Panel} = Collapse;


const dummyMenuItems = [
    {
        label: "Strategy_1_Settings",
        content: "gfhgffgfg inputs of the thing",
        key: "s1",
        icon: "faStop",
        children: [
            {
                label: "Evaluator 1",
                content: "user inputs of the sub fgfghghffghfghfghfg",
                key: "e1",
                icon: "faStop",
                children: [
                    {
                        label: "Evaluator 1",
                        content: "user inputs of the sub fghfghfhgfghf",
                        key: "c1",
                        icon: "faStop"
                    }, {
                        label: "Evaluator 1",
                        content: "user inputs of the sub fghfhgfhgf",
                        key: "c2",
                        icon: "faStop"
                    }
                ]
            },


        ]
    }, {
        label: "Evaluator 1",
        content: "user inputs of the sub thing",
        key: "s2",
        icon: "faStop",
        // children: [
        //     {
        //         label: "Evaluator 1",
        //         content: "user fghgfhgfhgfhfggfhfginputs of the sub thing",
        //         key: "dfgdfgdfgdfg",
        //         icon: "faStop"
        //     }, {
        //         label: "Evaluator 1",
        //         content: "user fdghfghghfgfhgfhgfh of the sub thing",
        //         key: "dfgdfgdf",
        //         icon: "faStop"
        //     }
        // ]
    },

]

export function TestAntSidebar() {
    return <AntSidebar menuItems={dummyMenuItems}/>
}
export default function AntSidebar({menuItems}) {
    const botColors = useBotColorsContext();
    const [currentlySelectedMenu, setCurrentlySelectedMenu] = useState();
    return useMemo(() => {
        const activeMenus = []
        const hasContent = Boolean(menuItems ?. length)
        const currentContent = hasContent && findCurrentContent(menuItems, currentlySelectedMenu, activeMenus)
        return hasContent && (
            <div style={
                {
                    height: "100%",
                    width: "100%",
                    display: "flex"
                }
            }>
                <div style={
                        {width: "280px"}
                    }
                    className={"ant-side-bar"}>
                    <MenuItems menuItems={menuItems}
                        currentlySelectedMenu={currentlySelectedMenu}
                        activeMenus={activeMenus}
                        setCurrentlySelectedMenu={setCurrentlySelectedMenu}/>
                </div>
                <div style={
                    {
                        width: "calc(100% - 300px)",
                        borderLeft: "4px solid " + botColors.border
                    }
                }>
                    {currentContent} </div>
            </div>

        )
    }, [botColors.border, currentlySelectedMenu, menuItems])
}

function findCurrentContent(menuItemsData, currentlySelectedMenu, activeMenus) {
    for (const menuItemData of menuItemsData) {
        if (menuItemData.key === currentlySelectedMenu) {
            activeMenus.push(menuItemData.key)
            return menuItemData.content
        } else if (menuItemData.children) {
            const foundContent = findCurrentContent(menuItemData.children, currentlySelectedMenu, activeMenus)
            if (foundContent) {
                activeMenus.push(menuItemData.key)
                return foundContent
            }
        }
    }
}


function MenuItems({
    menuItems,
    currentlySelectedMenu,
    setCurrentlySelectedMenu,
    activeMenus,
    isSubMenu
}) {
    return menuItems.map((menuItem) => {
        const style = isSubMenu ? {
            margin: "5px"
        } : {}
        return (
            <div key={
                    menuItem.key
                }
                style={style}
                className={
                    isSubMenu ? "sub-menu" : "root-menu"
            }>
                <MenuItem mode="inline"
                    menuItem={menuItem}
                    isSubMenu={isSubMenu}
                    currentlySelectedMenu={currentlySelectedMenu}
                    setCurrentlySelectedMenu={setCurrentlySelectedMenu}
                    activeMenus={activeMenus}/>
            </div>
        )
    })
}

function MenuItem({
    menuItem,
    currentlySelectedMenu,
    setCurrentlySelectedMenu,
    activeMenus,
    isSubMenu
}) {
    function handleCurentChange() {
        setCurrentlySelectedMenu(menuItem.key)
    }
    const colorMode = useColorModeContext()
    const colors = useBotColorsContext()
    const buttonStyle = menuItem.key === currentlySelectedMenu ? {
        // backgroundColor: colors ?. backgroundActive,
        color: colors ?. fontActive
    } : {}
    const buttonContainerStyle = isSubMenu ? {} : {
        padding: "5px"
    }

    return useMemo(() => (menuItem.children ? (
        <Collapse prefixCls={
                `${colorMode}`
            }
            activeKey={activeMenus}
            onChange={handleCurentChange}
            style={
                {border: "none"}
            }
            expandIconPosition="end"
            destroyInactivePanel={true}
            // showArrow={true}
        >
            <Panel header={
                    (
                        <span>{
                            menuItem.label
                        }</span>
                    )
                }
                key={
                    menuItem.key
                }
                style={
                    {border: "none"}
            }>
                <MenuItems menuItems={
                        menuItem.children
                    }
                    activeMenus={activeMenus}
                    isSubMenu={true}
                    currentlySelectedMenu={currentlySelectedMenu}
                    setCurrentlySelectedMenu={setCurrentlySelectedMenu}/>
            </Panel>
        </Collapse>
    ) : (
        <div style={
            {
                width: "100%",
                ... buttonContainerStyle
            }
        }>
            <Button style={
                    {
                        ... buttonStyle,
                        textAlign: "start"
                    }
                }
                size={"large"}
                type="text"
                onClick={handleCurentChange}
                block>
                {
                menuItem.label
            } </Button>
        </div>
    // eslint-disable-next-line react-hooks/exhaustive-deps
    )), [
        activeMenus,
        buttonStyle,
        colorMode,
        currentlySelectedMenu,
        menuItem
    ])
}
