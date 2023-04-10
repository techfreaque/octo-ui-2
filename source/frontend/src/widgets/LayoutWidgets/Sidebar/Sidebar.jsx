import AntSidebar from "../../../components/Sidebars/AntSidebar/AntSidebar";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets"

export default function Sidebar({sideBarContent}) {
    const _sideBarContent = JSON.parse(JSON.stringify(sideBarContent));
    hydrateSideBarContent(_sideBarContent)
    return <AntSidebar menuItems={_sideBarContent}/>
}

function hydrateSideBarContent(sideBarContent) {
    sideBarContent.forEach((menuItem, index) => {
        sideBarContent[index].content = (
            <AppWidgets layout={
                menuItem.content
            }/>
        )
        if (sideBarContent[index]?.children?.length) {
            hydrateSideBarContent(sideBarContent[index].children)
        }
    })
}

export function SidebarMenuItem() { // Dummy Component - will never be called
}
