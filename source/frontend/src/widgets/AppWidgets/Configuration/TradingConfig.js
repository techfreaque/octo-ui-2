import {Button, Tab} from "@mui/material";
import {saveTentaclesConfig} from "../../../api/botData";
import MuiTabs from "../../../components/Tabs/MuiTabs";
import {useBotDomainContext} from "../../../context/BotDomainProvider";
import {useBotPlottedElementsContext, useFetchPlotData} from "../../../context/BotPlottedElementsProvider";
import {useMemo} from "react";
import JsonEditor, { JsonEditorDependencies, useGetJsonEditorsData } from "@techfreaque/json-editor-react";
import "spectre.css/dist/spectre-icons.min.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "../../../components/Forms/JsonEditor/JsonEditor.css"

export default function TradingConfig() {
    return (
        <JsonEditorDependencies>
            <RenderTradingConfig/>
        </JsonEditorDependencies>
    )

}
function RenderTradingConfig() {
    const botPlottedElements = useBotPlottedElementsContext();
    const botDomain = useBotDomainContext();
    const tabsData = []
    botPlottedElements.user_inputs && botPlottedElements.user_inputs.data.elements.forEach((element, index) => {
        tabsData[index] = {
            title: (
                <Tab key={index}
                    label={
                        element.tentacle
                    }
                    value={index}
                    sx={
                        {textTransform: 'none'}
                    }/>
            ),
            content: (
                <JsonEditor schema={
                        element.schema
                    }
                    startval={
                        element.config
                    }
                    editorName={
                        element.tentacle
                    }
                    theme={"bootstrap4"}
                    iconlib={"spectre"}
                    no_additional_properties={true}
                    object_layout={"grid"}/>
            )
        }
    });

    const _useFetchPlotData = useFetchPlotData();
    const jsonEditorsData = useGetJsonEditorsData();
    function useSaveEditors() {
        console.log(jsonEditorsData)
        saveTentaclesConfig(jsonEditorsData, botDomain)
        _useFetchPlotData()
    };
    return useMemo(() => (
        <MuiTabs tabs={tabsData}
            rightContent={
                (
                    <Button variant="contained"
                        onClick={useSaveEditors}>Save</Button>
                )
            }
            defaultTabId={0}/>
    ), [botPlottedElements.user_inputs])
}
