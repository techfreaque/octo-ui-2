import {Collapse, Button} from "antd"
import {useMemo} from "react";
import {useState} from "react";
import {useBotColorsContext} from "../../../context/config/BotColorsProvider";
import {useColorModeContext} from "../../../context/config/ColorModeProvider";
import FontAwesomeIconByString from "../../Icons/FontAwesome";
import "./antSidebar.css"
const {Panel} = Collapse;


const dummyMenuItems = [
    {
        label: "Strategy_1_Settings",
        content: "gfhgffgfg inputs of the thing",
        faIcon: "faStop",
        children: [
            {
                label: "Evaluator 1",
                content: "user inputs of the sub fgfghghffghfghfghfg",
                faIcon: "faStop",
                children: [
                    {
                        label: "Evaluator 1",
                        content: "user inputs of the sub fghfghfhgfghf",
                        faIcon: "faStop"
                    }, {
                        label: "Evaluator 1",
                        content: "user inputs of the sub fghfhgfhgf",
                        faIcon: "faStop"
                    }
                ]
            },


        ]
    }, {
        label: "Evaluator 1",
        content: "user inputs of the sub thing",
        faIcon: "faStop",
        children: []
        // children: [
        //     {
        //         label: "Evaluator 1",
        //         content: "user fghgfhgfhgfhfggfhfginputs of the sub thing",
        //         faIcon: "faStop"
        //     }, {
        //         label: "Evaluator 1",
        //         content: "user fdghfghghfgfhgfhgfh of the sub thing",
        //         faIcon: "faStop"
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
        if (getKeyFromLabel(menuItemData.label) === currentlySelectedMenu) {
            activeMenus.push(getKeyFromLabel(menuItemData.label))
            return menuItemData.content
        } else if (menuItemData.children) {
            const foundContent = findCurrentContent(menuItemData.children, currentlySelectedMenu, activeMenus)
            if (foundContent) {
                activeMenus.push(getKeyFromLabel(menuItemData.label))
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
                    getKeyFromLabel(menuItem.label)
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
        setCurrentlySelectedMenu(getKeyFromLabel(menuItem.label))
    }
    const colorMode = useColorModeContext()
    const colors = useBotColorsContext()
    const buttonStyle = getKeyFromLabel(menuItem.label) === currentlySelectedMenu ? {
        // backgroundColor: colors ?. backgroundActive,
        color: colors ?. fontActive
    } : {}
    const buttonContainerStyle = isSubMenu ? {} : {
        padding: "5px"
    }

    return useMemo(() => (menuItem.children?.length ? (
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
                (<>
                    
                        <FontAwesomeIconByString faIcon={menuItem.faIcon}/> <span>{
                            menuItem.label
                        }</span>
                    </>
                    )
                }
                key={
                    getKeyFromLabel(menuItem.label)
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

function getKeyFromLabel(label) {
    if (label) {
        return label?.replace(" ","_")
        
    } else {
        console.error("A sidebar menu item has no label")
    }
}