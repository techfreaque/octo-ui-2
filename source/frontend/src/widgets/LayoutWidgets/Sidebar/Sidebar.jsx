import AntSidebar from "../../../components/Layouts/Sidebars/AntSidebar"
import AppWidgets from "../../WidgetManagement/RenderAppWidgets"

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

export default function Sidebar({ sideBarContent }) {
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
        if (sideBarContent[index] ?. children ?. length) {
            hydrateSideBarContent(sideBarContent[index].children)
        }
    })
}

export function SidebarMenuItem() { // Dummy Component - will never be called
}
