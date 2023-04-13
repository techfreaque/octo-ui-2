import {Collapse, Button, Tooltip} from "antd"
import {useMemo} from "react";
import {useState} from "react";
import {useBotColorsContext} from "../../../context/config/BotColorsProvider";
import {useColorModeContext} from "../../../context/config/ColorModeProvider";
import {iconStringNoIcon} from "../../Icons/AntIcon";
import IconFromString from "../../Icons/IconFromString";
import "./antSidebar.css"
import {useEffect} from "react";
import {useMediaQuery} from "@mui/material";
const {Panel} = Collapse;

export default function AntSidebar({menuItems}) {
    const botColors = useBotColorsContext();
    const hasContent = menuItems && Boolean(menuItems?.length)
    const defaultSelected = hasContent && getKeyFromLabel(Object.values(menuItems)[0].label)
    const [currentlySelectedMenu, setCurrentlySelectedMenu] = useState();
    const [hideText, setHideText] = useState(false);
    const iSmallScreen = useMediaQuery('(max-width:800px)');

    useEffect(() => {
        if (iSmallScreen) {
            setHideText(true);
        } else {
            setHideText(false);
        }
    }, [iSmallScreen]);
    useEffect(() => {
        if (defaultSelected) 
            setCurrentlySelectedMenu(defaultSelected);
        

    }, [defaultSelected]);
    // function toggleHideMenuItemText() {
    //     setHideText(prevState => (!prevState));
    // }
    return useMemo(() => {
        const activeMenus = []
        const currentContent = hasContent && findCurrentContent(menuItems, currentlySelectedMenu, activeMenus)
        return hasContent && (<div style={
            {
                height: "100%",
                width: "100%",
                display: "flex"
            }
        }>
            <div style={
                    {
                        width: "auto",
                        // `${sideBarWidth}px`,
                        height: "100%",
                        borderRight: `4px solid ${
                            botColors?.border
                        }`
                    }
                }
                className={"ant-side-bar"}>
                <div style={
                    {
                        overflowY: "auto",
                        height: "100%"
                    }
                }>

                    <MenuItems menuItems={menuItems}
                        currentlySelectedMenu={currentlySelectedMenu}
                        activeMenus={activeMenus}
                        hideText={hideText}
                        setCurrentlySelectedMenu={setCurrentlySelectedMenu}/>
                </div>
            </div>
            <div style={
                { // width: `calc(100% - ${sideBarWidth}px)`,
                    width: "100%",
                    padding: currentContent?.noPadding ? "" : "15px",
                    height: "100%",
                    overflowY: currentContent?.dontScroll ? undefined : "auto"
                }
            }> {
                currentContent?.content
            } </div>
        </div>)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        botColors?.border,
        currentlySelectedMenu,
        menuItems,
        hideText
    ])
}

function findCurrentContent(menuItemsData, currentlySelectedMenu, activeMenus) {
    for (const menuItemData of menuItemsData) {
        if (getKeyFromLabel(menuItemData.label) === currentlySelectedMenu) {
            activeMenus.push(getKeyFromLabel(menuItemData.label))
            return menuItemData
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
    isSubMenu,
    hideText
}) {
    return menuItems.map((menuItem) => {
        const style = isSubMenu ? {
            margin: "5px"
        } : {}
        return (<div key={
                getKeyFromLabel(menuItem.label)
            }
            style={style}
            className={
                isSubMenu ? "sub-menu" : "root-menu"
        }>
            <MenuItem mode="inline"
                hideText={hideText}
                menuItem={menuItem}
                isSubMenu={isSubMenu}
                currentlySelectedMenu={currentlySelectedMenu}
                setCurrentlySelectedMenu={setCurrentlySelectedMenu}
                activeMenus={activeMenus}/>
        </div>)
    })
}

function MenuItem({
    menuItem,
    currentlySelectedMenu,
    setCurrentlySelectedMenu,
    activeMenus,
    isSubMenu,
    hideText
}) {
    function handleCurentChange() {
        setCurrentlySelectedMenu(getKeyFromLabel(menuItem.label))
        menuItem?.onClick ?. (menuItem)
    }
    const colorMode = useColorModeContext()
    const colors = useBotColorsContext()
    const buttonStyle = getKeyFromLabel(menuItem.label) === currentlySelectedMenu ? { // backgroundColor: colors ?. backgroundActive,
        color: colors?.fontActive
    } : {}


    return useMemo(() => (menuItem.children?.length ? (<NestedSideBarMenuItem colorMode={colorMode}
        activeMenus={activeMenus}
        hideText={hideText}
        currentlySelectedMenu={currentlySelectedMenu}
        setCurrentlySelectedMenu={setCurrentlySelectedMenu}
        handleCurentChange={handleCurentChange}
        menuItem={menuItem}/>) : (<SideBarButton isSubMenu={isSubMenu}
        hideText={hideText}
        buttonStyle={buttonStyle}
        handleCurentChange={handleCurentChange}
        menuItem={menuItem}/>)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
        [
        activeMenus,
        buttonStyle,
        colorMode,
        currentlySelectedMenu,
        menuItem,
        hideText
    ])
}

function NestedSideBarMenuItem({
    colorMode,
    activeMenus,
    currentlySelectedMenu,
    setCurrentlySelectedMenu,
    handleCurentChange,
    menuItem,
    hideText
}) {
    return (<Collapse prefixCls={
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
                (<Tooltip title={
                        hideText && menuItem.label
                    }
                    trigger={
                        [
                            "hover",
                            // "focus",
                            // "click"
                        ]
                }>
                    <div style={
                        {display: "flex"}
                    }>
                        <IconFromString faIcon={
                                menuItem.faIcon
                            }
                            antIcon={
                                menuItem.antIcon
                            }/>
                        <span style={
                            menuItem.antIcon ? {
                                marginLeft: "5px"
                            } : {}
                        }> {
                            !hideText && menuItem.label
                        }</span>
                    </div>
                </Tooltip>)
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
                hideText={hideText}
                activeMenus={activeMenus}
                isSubMenu={true}
                currentlySelectedMenu={currentlySelectedMenu}
                setCurrentlySelectedMenu={setCurrentlySelectedMenu}/>
        </Panel>
    </Collapse>)
}
function SideBarButton({
    buttonStyle,
    handleCurentChange,
    menuItem,
    isSubMenu,
    hideText
}) {
    const buttonContainerStyle = isSubMenu ? {} : {
        padding: "5px"
    }
    const buttonStyleForIcon = (menuItem.antIcon && menuItem.antIcon !== iconStringNoIcon) ? {
        display: "flex"
    } : {}
    return (<div style={
        {
            width: "100%",
            ...buttonContainerStyle
        }
    }>
        <Tooltip title={
            hideText && menuItem.label
        }>
            <Button style={
                    {
                        ...buttonStyle,
                        ...buttonStyleForIcon,
                        textAlign: "start"

                    }
                }
                size={"large"}
                type="text"
                onClick={handleCurentChange}
                block>
                <IconFromString faIcon={
                        menuItem.faIcon
                    }
                    antIcon={
                        menuItem.antIcon
                    }/> {
                !hideText && menuItem.label
            } </Button>
        </Tooltip>
    </div>)
}

function getKeyFromLabel(label) {
    if (label) {
        return label?.replace(" ", "_")

    }
    console.error("A sidebar menu item has no label")
}
