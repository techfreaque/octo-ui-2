import { Collapse, Button } from "antd";
import { CSSProperties, Dispatch, SetStateAction, useMemo } from "react";
import { useState } from "react";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import { useColorModeContext } from "../../../context/config/ColorModeProvider";
import { iconStringNoIcon } from "../../Icons/AntIcon";
import IconFromString from "../../Icons/IconFromString";
import "./antSidebar.css";
import { useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import AppIconButton from "../../Buttons/AppIconButton";
import {
  ColorModeType,
  ColorsType,
} from "../../../constants/uiTemplate/defaultColors";
const { Panel } = Collapse;

export interface AntSideBarMenutItemType {
  label: string | JSX.Element;
  key: string;
  antIcon?: string | undefined;
  content: JSX.Element;
  noPadding?: boolean | undefined;
  children?: AntSideBarMenutItemType[];
  onClick?: (item: AntSideBarMenutItemType) => void;
  disabled?: boolean;
  dontScroll?: boolean;
  icon?: JSX.Element;
  faIcon?: string | undefined;
  order?: number; // TODO handle
}

export default function AntSidebar({
  menuItems,
  currentlySelectedMenu,
  setCurrentlySelectedMenu,
  defaultSelected,
}: {
  menuItems?: AntSideBarMenutItemType[];
  currentlySelectedMenu?: string | undefined;
  setCurrentlySelectedMenu?: Dispatch<SetStateAction<string | undefined>>;
  defaultSelected?: string;
}) {
  const botColors = useBotColorsContext();
  const hasContent = menuItems && Boolean(menuItems?.length);
  const _defaultSelected: string | undefined = hasContent
    ? defaultSelected
      ? defaultSelected
      : menuItems?.[0]?.key
    : undefined;
  const [_currentlySelectedMenu, _setCurrentlySelectedMenu] = useState<
    string | undefined
  >(_defaultSelected);
  const [hideText, setHideText] = useState(false);
  const iSmallScreen = useMediaQuery("(max-width:800px)");

  const actualCurrentlySelectedMenu =
    currentlySelectedMenu || _currentlySelectedMenu;
  const actualSetCurrentlySelectedMenu: Dispatch<SetStateAction<
    string | undefined
  >> = setCurrentlySelectedMenu || _setCurrentlySelectedMenu;

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
  const [activeMenus, setActiveMenus] = useState<string[]>([]);
  return useMemo(() => {
    return hasContent ? (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
        }}
      >
        <div
          style={{
            width: "auto",
            // `${sideBarWidth}px`,
            height: "100%",
            borderRight: `4px solid ${botColors?.border}`,
          }}
          className={"ant-side-bar"}
        >
          <div
            style={{
              overflowY: "auto",
              height: "100%",
            }}
          >
            <MenuItems
              menuItems={menuItems}
              currentlySelectedMenu={actualCurrentlySelectedMenu}
              activeMenus={activeMenus}
              hideText={hideText}
              setCurrentlySelectedMenu={actualSetCurrentlySelectedMenu}
            />
          </div>
        </div>

        <DisplayCurrentContent
          menuItemsData={menuItems}
          currentlySelectedMenu={actualCurrentlySelectedMenu}
          setActiveMenus={setActiveMenus}
        />
      </div>
    ) : (
      <></>
    );
  }, [
    hasContent,
    botColors?.border,
    menuItems,
    actualCurrentlySelectedMenu,
    activeMenus,
    hideText,
    actualSetCurrentlySelectedMenu,
  ]);
}

function DisplayCurrentContent({
  menuItemsData,
  currentlySelectedMenu,
  setActiveMenus,
}: {
  menuItemsData: AntSideBarMenutItemType[];
  currentlySelectedMenu: string | undefined;
  setActiveMenus: Dispatch<SetStateAction<string[]>>;
}) {
  // const [content, setContent] = useState()

  useEffect(() => {
    const newActiveMenus: string[] = [];
    // const newContent = []
    findCurrentContent(menuItemsData, currentlySelectedMenu, newActiveMenus);
    setActiveMenus(newActiveMenus);
    // setContent(newContent)
  }, [currentlySelectedMenu, menuItemsData, setActiveMenus]);

  return (
    <>
      {menuItemsData?.map((menuItemData) => {
        const key = menuItemData.key;
        return (
          <Content
            menuItemData={menuItemData}
            key={key}
            visible={currentlySelectedMenu === key}
            currentlySelectedMenu={currentlySelectedMenu}
          />
        );
      })}
    </>
  );
}

function findCurrentContent(
  menuItemsData: AntSideBarMenutItemType[],
  currentlySelectedMenu: string | undefined,
  activeMenus: string[]
) {
  let anyChildrenHasContent = false;
  for (const menuItemData of menuItemsData) {
    if (menuItemData.key === currentlySelectedMenu) {
      activeMenus.push(menuItemData.key);
      anyChildrenHasContent = true;
      // content.push((<Content menuItemData={menuItemData} visible={true}/>))
    } else if (menuItemData.children) {
      const thisAnyChildrenHasContent = findCurrentContent(
        menuItemData.children,
        currentlySelectedMenu,
        activeMenus
      );
      if (thisAnyChildrenHasContent) {
        // content.push((<Content  menuItemData={menuItemData}/>))
        activeMenus.push(menuItemData.key);
      }
    } else {
      // content.push((<Content  menuItemData={menuItemData}/>))
    }
  }
  return anyChildrenHasContent;
}

function Content({
  menuItemData,
  visible = false,
  currentlySelectedMenu,
}: {
  menuItemData: AntSideBarMenutItemType;
  visible: boolean;
  currentlySelectedMenu: string | undefined;
}) {
  return (
    <>
      {
        <div
          key={menuItemData.key}
          style={{
            ...(visible
              ? {}
              : {
                  display: "none",
                }),
            width: "100%",
            padding: menuItemData?.noPadding ? "" : "15px",
            height: "100%",
            overflowY: menuItemData?.dontScroll ? undefined : "auto",
            overflowX: "hidden",
          }}
        >
          {useMemo(() => menuItemData.content, [menuItemData.content])}
        </div>
      }
      {useMemo(() => {
        return menuItemData?.children?.map((subMenuItemData) => {
          const key = subMenuItemData.key;
          return (
            <Content
              key={key}
              menuItemData={subMenuItemData}
              visible={currentlySelectedMenu === key}
              currentlySelectedMenu={currentlySelectedMenu}
            />
          );
        });
      }, [currentlySelectedMenu, menuItemData])}
    </>
  );
}

function MenuItems({
  menuItems,
  currentlySelectedMenu,
  setCurrentlySelectedMenu,
  activeMenus,
  isSubMenu,
  hideText,
}: {
  menuItems: AntSideBarMenutItemType[];
  currentlySelectedMenu: string | undefined;
  setCurrentlySelectedMenu: Dispatch<SetStateAction<string | undefined>>;
  activeMenus: string[];
  isSubMenu?: boolean;
  hideText: boolean;
}) {
  const botColors = useBotColorsContext();
  return (
    <>
      {menuItems.map((menuItem) => {
        const style = isSubMenu
          ? {
              margin: "5px",
            }
          : {};
        return (
          <div
            key={menuItem.key}
            style={style}
            className={
              isSubMenu
                ? "sub-menu"
                : `root-menu${hideText ? " small-screen" : ""}`
            }
          >
            <MenuItem
              hideText={hideText}
              menuItem={menuItem}
              isSubMenu={isSubMenu}
              botColors={botColors}
              currentlySelectedMenu={currentlySelectedMenu}
              setCurrentlySelectedMenu={setCurrentlySelectedMenu}
              activeMenus={activeMenus}
            />
          </div>
        );
      })}
    </>
  );
}

function MenuItem({
  menuItem,
  currentlySelectedMenu,
  setCurrentlySelectedMenu,
  activeMenus,
  isSubMenu,
  hideText,
  botColors,
}: {
  menuItem: AntSideBarMenutItemType;
  currentlySelectedMenu: string | undefined;
  setCurrentlySelectedMenu: Dispatch<SetStateAction<string | undefined>>;
  activeMenus: string[];
  isSubMenu: boolean | undefined;
  hideText: boolean;
  botColors: ColorsType;
}) {
  function handleCurentChange() {
    setCurrentlySelectedMenu(menuItem.key);
    menuItem?.onClick?.(menuItem);
  }
  const colorMode = useColorModeContext();
  const colors = useBotColorsContext();
  const buttonStyle: CSSProperties =
    menuItem.key === currentlySelectedMenu
      ? {
          // backgroundColor: colors ?. backgroundActive,
          color: colors.fontActive,
        }
      : {};

  return useMemo(
    () =>
      menuItem.children?.length ? (
        <NestedSideBarMenuItem
          colorMode={colorMode}
          activeMenus={activeMenus}
          botColors={botColors}
          hideText={hideText}
          currentlySelectedMenu={currentlySelectedMenu}
          setCurrentlySelectedMenu={setCurrentlySelectedMenu}
          handleCurentChange={handleCurentChange}
          menuItem={menuItem}
        />
      ) : (
        <SideBarButton
          isSubMenu={isSubMenu}
          hideText={hideText}
          buttonStyle={buttonStyle}
          handleCurentChange={handleCurentChange}
          activeMenus={activeMenus}
          botColors={botColors}
          menuItem={menuItem}
        />
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      activeMenus,
      buttonStyle,
      colorMode,
      currentlySelectedMenu,
      menuItem,
      hideText,
    ]
  );
}

function NestedSideBarMenuItem({
  colorMode,
  activeMenus,
  currentlySelectedMenu,
  setCurrentlySelectedMenu,
  handleCurentChange,
  menuItem,
  hideText,
  botColors,
}: {
  colorMode: ColorModeType;
  activeMenus: string[];
  currentlySelectedMenu: string | undefined;
  setCurrentlySelectedMenu: Dispatch<SetStateAction<string | undefined>>;
  handleCurentChange: () => void;
  menuItem: AntSideBarMenutItemType;
  hideText: boolean;
  botColors: ColorsType;
}) {
  return (
    <Collapse
      prefixCls={`${colorMode}`}
      activeKey={activeMenus}
      onChange={handleCurentChange}
      style={{ border: "none" }}
      expandIconPosition={"end"}
      // expandIcon={()=>(<></>)}
      destroyInactivePanel={true}
      // showArrow={!hideText}
    >
      <Panel
        header={
          hideText ? (
            <div style={{ display: "flex" }}>
              <AppIconButton
                isSelected={false}
                style={{
                  margin: "auto",
                  ...(activeMenus.includes(menuItem.key)
                    ? {
                        color: botColors?.fontActive,
                      }
                    : {}),
                }}
                buttonTitle={
                  typeof menuItem.label === "string"
                    ? menuItem.label
                    : "Cant use Component"
                }
                icon={menuItem?.icon}
                isResponsive={false}
                antIconString={menuItem.antIcon}
                faIconString={menuItem.faIcon}
                onClick={
                  menuItem.onClick
                    ? () => menuItem.onClick?.(menuItem)
                    : handleCurentChange
                }
                disabled={menuItem.disabled}
              />
            </div>
          ) : (
            <div style={{ display: "flex" }}>
              {menuItem?.icon && menuItem.icon}
              <IconFromString
                faIcon={menuItem.faIcon}
                antIcon={menuItem.antIcon}
              />
              <span
                style={
                  menuItem.antIcon
                    ? {
                        marginLeft: "5px",
                      }
                    : {}
                }
              >
                {menuItem.label}
              </span>
            </div>
          )
        }
        key={menuItem.key}
        style={{ border: "none" }}
      >
        <MenuItems
          menuItems={menuItem.children as AntSideBarMenutItemType[]}
          hideText={hideText}
          activeMenus={activeMenus}
          isSubMenu={true}
          currentlySelectedMenu={currentlySelectedMenu}
          setCurrentlySelectedMenu={setCurrentlySelectedMenu}
        />
      </Panel>
    </Collapse>
  );
}
function SideBarButton({
  buttonStyle,
  handleCurentChange,
  menuItem,
  isSubMenu,
  hideText,
  activeMenus,
  botColors,
}: {
  buttonStyle: CSSProperties;
  handleCurentChange: () => void;
  menuItem: AntSideBarMenutItemType;
  isSubMenu: boolean | undefined;
  hideText: boolean;
  activeMenus: string[];
  botColors: ColorsType;
}) {
  const buttonContainerStyle = isSubMenu
    ? {}
    : {
        padding: "5px",
      };
  const buttonStyleForIcon =
    menuItem.antIcon && menuItem.antIcon !== iconStringNoIcon
      ? {
          display: "flex",
        }
      : {};

  if (typeof menuItem.label !== "string") {
    return <div style={{ width: "100%" }}>{menuItem.label} </div>;
  }
  return (
    <div
      style={{
        width: "100%",
        ...buttonContainerStyle,
      }}
    >
      {hideText ? (
        <AppIconButton
          isSelected={false}
          style={{
            margin: "auto",
            ...(activeMenus.includes(menuItem.key)
              ? {
                  color: botColors?.fontActive,
                }
              : {}),
          }}
          buttonTitle={menuItem.label}
          isResponsive={false}
          antIconString={menuItem.antIcon}
          icon={menuItem?.icon}
          faIconString={menuItem.faIcon}
          onClick={
            menuItem.onClick
              ? () => menuItem.onClick?.(menuItem)
              : handleCurentChange
          }
          disabled={menuItem.disabled}
        />
      ) : (
        <Button
          style={{
            ...buttonStyle,
            ...buttonStyleForIcon,
            textAlign: "start",
          }}
          size={"large"}
          type="text"
          onClick={
            menuItem.onClick
              ? () => menuItem.onClick?.(menuItem)
              : handleCurentChange
          }
          disabled={menuItem.disabled}
          block
        >
          {menuItem.icon && (
            <span style={{ marginRight: "7px" }}>{menuItem.icon} </span>
          )}
          <IconFromString faIcon={menuItem.faIcon} antIcon={menuItem.antIcon} />
          {!hideText && menuItem.label}
        </Button>
      )}
    </div>
  );
}
