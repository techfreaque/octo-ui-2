import {Button, Tab} from "@mui/material";
import {useState} from "react";
import {saveTentaclesConfig} from "../../../api/botData";
import JsonEditor from "../../../components/Forms/JsonEditor";
import MuiTabs from "../../../components/Tabs/MuiTabs";
import {useBotDomainContext} from "../../../context/BotDomainProvider";
import {useBotPlottedElementsContext, useFetchPlotData} from "../../../context/BotPlottedElementsProvider";

export default function TradingConfig() {
    const botPlottedElements = useBotPlottedElementsContext();
    const botDomain = useBotDomainContext();
    const [editors, setEditors] = useState({});
    function setEditor(tentacleName, newEditor) {
        setEditors(prevEditors => ({
            ...prevEditors,
            [tentacleName]: newEditor
        }))
    }
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
                <JsonEditor editorId={index}
                    data={
                        element.config
                    }
                    schema={
                        element.schema
                    }
                    tentacleName={
                        element.tentacle
                    }
                    editor={
                        editors[element.tentacle]
                    }
                    setEditor={setEditor}/>
            )
        }
    });
    const _useFetchPlotData = useFetchPlotData()
    function saveEditors() {
        const newConfigs = {}
        Object.keys(editors).forEach((key) => {
            newConfigs[key] = editors[key].getValue()
        })
      saveTentaclesConfig(newConfigs, botDomain)
      _useFetchPlotData()
    }
    return <>
        <MuiTabs tabs={tabsData}
            rightContent={
                (
                    <Button variant="contained"
                        onClick={saveEditors}>Save</Button>
                )
            }
            defaultTabId={0}/>
    </>;
}
