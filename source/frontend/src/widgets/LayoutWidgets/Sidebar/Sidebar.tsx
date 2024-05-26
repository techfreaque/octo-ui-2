import type {
  AntSideBarMenutItemType,
} from "../../../components/Sidebars/AntSidebar/AntSidebar";
import AntSidebar from "../../../components/Sidebars/AntSidebar/AntSidebar";
import type { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";

export default function Sidebar({ sideBarContent }: UiLayoutPageLayoutType) {
  const _sideBarContent = hydrateSideBarContent(sideBarContent);
  return <AntSidebar menuItems={_sideBarContent} />;
}

function hydrateSideBarContent(
  sideBarContent: UiLayoutPageLayoutType[] | undefined
): AntSideBarMenutItemType[] {
  const hydratedContent: AntSideBarMenutItemType[] = [];
  sideBarContent?.forEach((menuItem, index) => {
    const hydratedItem: AntSideBarMenutItemType = {
      title: menuItem.label || `No Label for ${menuItem.component}`,
      key: `${menuItem.label}${index}`,
      antIcon: menuItem.antIcon,
      noPadding: menuItem.noPadding,
      faIcon: menuItem.faIcon,
      content: <></>,
    };
    if (menuItem.content) {
      hydratedItem.content = <AppWidgets layout={menuItem.content} />;
      if (menuItem.children) {
        hydratedItem.items = hydrateSideBarContent(menuItem.children);
      }
    }
    hydratedContent.push(hydratedItem);
  });
  return hydratedContent;
}

export function SidebarMenuItem() {
  // Dummy Component - will never be called
  return <></>;
}
