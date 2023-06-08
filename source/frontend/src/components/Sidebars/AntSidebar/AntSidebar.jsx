import {Collapse, Button} from "antd"
import {useMemo} from "react";
import {useState} from "react";
import {useBotColorsContext} from "../../../context/config/BotColorsProvider";
import {useColorModeContext} from "../../../context/config/ColorModeProvider";
import {iconStringNoIcon} from "../../Icons/AntIcon";
import IconFromString from "../../Icons/IconFromString";
import "./antSidebar.css"
import {useEffect} from "react";
import {useMediaQuery} from "@mui/material";
import AppIconButton from "../../Buttons/AppIconButton";
const {Panel} = Collapse;

export default function AntSidebar({menuItems, currentlySelectedMenu, setCurrentlySelectedMenu, defaultSelected}) {
    const botColors = useBotColorsContext();
    const hasContent = menuItems && Boolean(menuItems ?. length)
    const _defaultSelected = hasContent && (defaultSelected ? defaultSelected : getKeyFromLabel(Object.values(menuItems)[0]))
    const [_currentlySelectedMenu, _setCurrentlySelectedMenu] = useState();
    const [hideText, setHideText] = useState(false);
    const iSmallScreen = useMediaQuery('(max-width:800px)');

    const actualCurrentlySelectedMenu = currentlySelectedMenu || _currentlySelectedMenu
    const actualSetCurrentlySelectedMenu = setCurrentlySelectedMenu || _setCurrentlySelectedMenu

    useEffect(() => {
        if (iSmallScreen) {
            setHideText(true);
        } else {
            setHideText(false);
        }
    }, [iSmallScreen]);
    useEffect(() => {
        if (_defaultSelected) {
            actualSetCurrentlySelectedMenu(_defaultSelected);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_defaultSelected]);
    // function toggleHideMenuItemText() {
    //     setHideText(prevState => (!prevState));
    // }
    const [activeMenus, setActiveMenus] = useState([])
    return useMemo(() => {
        return hasContent && (
            <div style={
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
                                botColors ?. border
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
                            currentlySelectedMenu={actualCurrentlySelectedMenu}
                            activeMenus={activeMenus}
                            hideText={hideText}
                            setCurrentlySelectedMenu={actualSetCurrentlySelectedMenu}/>
                    </div>
                </div>

                <DisplayCurrentContent menuItemsData={menuItems}
                    currentlySelectedMenu={actualCurrentlySelectedMenu}
                    activeMenus={activeMenus}
                    setActiveMenus={setActiveMenus}/>
            </div>
        )
    }, [
        hasContent,
        botColors ?. border,
        menuItems,
        actualCurrentlySelectedMenu,
        activeMenus,
        hideText,
        actualSetCurrentlySelectedMenu
    ])
}

function DisplayCurrentContent({menuItemsData, currentlySelectedMenu, setActiveMenus, activeMenus}) { // const [content, setContent] = useState()

    useEffect(() => {
        const newActiveMenus = []
        // const newContent = []
        findCurrentContent(menuItemsData, currentlySelectedMenu, newActiveMenus)
        setActiveMenus(newActiveMenus)
        // setContent(newContent)
    }, [currentlySelectedMenu, menuItemsData, setActiveMenus])

    return menuItemsData ?. map((menuItemData) => {
        return (
            <Content menuItemData={menuItemData}
                visible={
                    activeMenus ?. includes(getKeyFromLabel(menuItemData))
                }
                activeMenus={activeMenus}/>
        )
    })
}

function findCurrentContent(menuItemsData, currentlySelectedMenu, activeMenus) {
    let anyChildrenHasContent = false
    for (const menuItemData of menuItemsData) {
        if (getKeyFromLabel(menuItemData) === currentlySelectedMenu) {
            activeMenus.push(getKeyFromLabel(menuItemData))
            anyChildrenHasContent = true
            // content.push((<Content menuItemData={menuItemData} visible={true}/>))

        } else if (menuItemData.children) {
            const thisAnyChildrenHasContent = findCurrentContent(menuItemData.children, currentlySelectedMenu, activeMenus)
            if (thisAnyChildrenHasContent) { // content.push((<Content  menuItemData={menuItemData}/>))
                activeMenus.push(getKeyFromLabel(menuItemData))
            }
        } else { // content.push((<Content  menuItemData={menuItemData}/>))
        }
    }
    return anyChildrenHasContent
}

function Content({
    menuItemData,
    visible = false,
    activeMenus
}) {
    return (
        <div key={
                menuItemData.label
            }
            style={
                {
                    ...(visible ? {} : {
                        display: "none"
                    }),
                    width: "100%",
                    padding: menuItemData ?. noPadding ? "" : "15px",
                    height: "100%",
                    overflowY: menuItemData ?. dontScroll ? undefined : "auto",
                    overflowX: "hidden"
                }
        }>
            {
            useMemo(() => (menuItemData.content), [menuItemData.content])
        }
            {
            useMemo(() => {
                return menuItemData ?. children ?. map((subMenuItemData) => (
                    <Content menuItemData={subMenuItemData}
                        visible={
                            activeMenus ?. includes(getKeyFromLabel(menuItemData))
                        }
                        activeMenus={activeMenus}/>
                ))
            }, [activeMenus, menuItemData])
        } </div>
    )
}

function MenuItems({
    menuItems,
    currentlySelectedMenu,
    setCurrentlySelectedMenu,
    activeMenus,
    isSubMenu,
    hideText
}) {
    const botColors = useBotColorsContext()
    return menuItems.map((menuItem) => {
        const style = isSubMenu ? {
            margin: "5px"
        } : {}
        return (
            <div key={
                    getKeyFromLabel(menuItem)
                }
                style={style}
                className={
                    isSubMenu ? "sub-menu" : `root-menu${
                        hideText ? " small-screen" : ""
                    }`
            }>
                <MenuItem mode="inline"
                    hideText={hideText}
                    menuItem={menuItem}
                    isSubMenu={isSubMenu}
                    botColors={botColors}
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
    isSubMenu,
    hideText,
    botColors
}) {
    function handleCurentChange() {
        setCurrentlySelectedMenu(getKeyFromLabel(menuItem))
        menuItem ?. onClick ?. (menuItem)
    }
    const colorMode = useColorModeContext()
    const colors = useBotColorsContext()
    const buttonStyle = getKeyFromLabel(menuItem) === currentlySelectedMenu ? { // backgroundColor: colors ?. backgroundActive,
        color: colors ?. fontActive
    } : {}


    return useMemo(() => (menuItem.children ?. length ? (
        <NestedSideBarMenuItem colorMode={colorMode}
            activeMenus={activeMenus}
            botColors={botColors}
            hideText={hideText}
            currentlySelectedMenu={currentlySelectedMenu}
            setCurrentlySelectedMenu={setCurrentlySelectedMenu}
            handleCurentChange={handleCurentChange}
            menuItem={menuItem}/>
    ) : (
        <SideBarButton isSubMenu={isSubMenu}
            hideText={hideText}
            buttonStyle={buttonStyle}
            handleCurentChange={handleCurentChange}
            activeMenus={activeMenus}
            botColors={botColors}
            menuItem={menuItem}/>
    )),
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
    hideText,
    botColors
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
            expandIconPosition={"end"}
            // expandIcon={()=>(<></>)}
            destroyInactivePanel={true}
            // showArrow={!hideText}
        >
            <Panel header={
                    hideText ? (
                        <div style={
                            {display: "flex"}
                        }>
                            <AppIconButton isSelected={false}
                                style={
                                    {
                                        margin: "auto",
                                        ...(activeMenus.includes(getKeyFromLabel(menuItem)) ? {
                                            color: botColors ?. fontActive
                                        } : {})
                                    }
                                }
                                buttonTitle={
                                    menuItem.label
                                }
                                icon={
                                    menuItem ?. icon
                                }
                                isResponsive={false}
                                antIconString={
                                    menuItem.antIcon
                                }
                                faIconString={
                                    menuItem.faIcon
                                }
                                onClick={
                                    menuItem.onClick || handleCurentChange
                                }
                                disabled={
                                    menuItem.disabled
                                }/>
                        </div>
                    ) : (
                        <div style={
                            {display: "flex"}
                        }>
                            {
                            menuItem ?. icon && menuItem.icon
                        }
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
                            }>
                                {
                                menuItem.label
                            }</span>
                        </div>
                    )
                }
                key={
                    getKeyFromLabel(menuItem)
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
        </Collapse>
    )
}
function SideBarButton({
    buttonStyle,
    handleCurentChange,
    menuItem,
    isSubMenu,
    hideText,
    activeMenus,
    botColors
}) {
    const buttonContainerStyle = isSubMenu ? {} : {
        padding: "5px"
    }
    const buttonStyleForIcon = (menuItem.antIcon && menuItem.antIcon !== iconStringNoIcon) ? {
        display: "flex"
    } : {}

    if (menuItem.labelIsContent) {
        return (
            <div style={
                {width: "100%"}
            }>
                {
                menuItem.label
            } </div>
        )
    }
    return (
        <div style={
            {
                width: "100%",
                ... buttonContainerStyle
            }
        }>
            {
            hideText ? (
                <AppIconButton isSelected={false}
                    style={
                        {
                            margin: "auto",
                            ...(activeMenus.includes(getKeyFromLabel(menuItem)) ? {
                                color: botColors ?. fontActive
                            } : {})
                        }
                    }
                    buttonTitle={
                        menuItem.label
                    }
                    isResponsive={false}
                    antIconString={
                        menuItem.antIcon
                    }
                    icon={
                        menuItem ?. icon
                    }
                    faIconString={
                        menuItem.faIcon
                    }
                    onClick={
                        menuItem.onClick || handleCurentChange
                    }
                    disabled={
                        menuItem.disabled
                    }/>
            ) : (
                <Button style={
                        {
                            ...buttonStyle,
                            ... buttonStyleForIcon,
                            textAlign: "start"
                        }
                    }
                    size={"large"}
                    type="text"
                    onClick={
                        menuItem.onClick || handleCurentChange
                    }
                    disabled={
                        menuItem.disabled
                    }
                    block>
                    {
                    menuItem.icon && (
                        <span style={
                            {marginRight: "7px"}
                        }>
                            {
                            menuItem.icon
                        } </span>
                    )
                }
                    <IconFromString faIcon={
                            menuItem.faIcon
                        }
                        antIcon={
                            menuItem.antIcon
                        }/> {
                    !hideText && menuItem.label
                } </Button>
            )
        } </div>
    )
}

function getKeyFromLabel(menuItem) {
    if (menuItem.key) {
        return menuItem.key
    } else if (menuItem.label) {
        return menuItem.label ?. replace(" ", "_")
    }
    console.error("A sidebar menu item has no label")
}
