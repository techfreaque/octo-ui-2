import {Collapse, Button} from "antd"
import {useMemo} from "react";
import {useState} from "react";
import {useBotColorsContext} from "../../../context/config/BotColorsProvider";
import {useColorModeContext} from "../../../context/config/ColorModeProvider";
import {AntIconByString} from "../../Icons/AntIcon";
import "./antSidebar.css"
const {Panel} = Collapse;

export default function AntSidebar({menuItems}) {
    const botColors = useBotColorsContext();
    const [currentlySelectedMenu, setCurrentlySelectedMenu] = useState(getKeyFromLabel(Object.values(menuItems)[0].label));
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
                    <div style={
                        {position: "fixed"}
                    }>

                        <MenuItems menuItems={menuItems}
                            currentlySelectedMenu={currentlySelectedMenu}
                            activeMenus={activeMenus}
                            setCurrentlySelectedMenu={setCurrentlySelectedMenu}/>
                    </div>
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
    const buttonStyle = getKeyFromLabel(menuItem.label) === currentlySelectedMenu ? { // backgroundColor: colors ?. backgroundActive,
        color: colors ?. fontActive
    } : {}


    return useMemo(() => (menuItem.children ?. length ? (
        <NestedSideBarMenuItem colorMode={colorMode}
            activeMenus={activeMenus}
            currentlySelectedMenu={currentlySelectedMenu}
            setCurrentlySelectedMenu={setCurrentlySelectedMenu}
            handleCurentChange={handleCurentChange}
            menuItem={menuItem}/>
    ) : (
        <SideBarButton isSubMenu={isSubMenu}
            buttonStyle={buttonStyle}
            handleCurentChange={handleCurentChange}
            menuItem={menuItem}/>
    )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
        [
        activeMenus,
        buttonStyle,
        colorMode,
        currentlySelectedMenu,
        menuItem
    ])
}

function NestedSideBarMenuItem({
    colorMode,
    activeMenus,
    currentlySelectedMenu,
    setCurrentlySelectedMenu,
    handleCurentChange,
    menuItem
}) {
    return (
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
                        <> {
                            menuItem.icon &&< AntIconByString iconString = {
                                menuItem.icon
                            } />
                        }
                            <span style={
                                menuItem.icon ? {
                                    marginLeft: "5px"
                                } : {}
                            }>
                                {
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
    )
}
function SideBarButton({buttonStyle, handleCurentChange, menuItem, isSubMenu}) {
    const buttonContainerStyle = isSubMenu ? {} : {
        padding: "5px"
    }
    return (
        <div style={
            {
                width: "100%",
                ... buttonContainerStyle
            }
        }>
            <Button style={
                    {
                        ...buttonStyle,
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
    )
}

function getKeyFromLabel(label) {
    if (label) {
        return label ?. replace(" ", "_")

    } else {
        console.error("A sidebar menu item has no label")
    }
}
