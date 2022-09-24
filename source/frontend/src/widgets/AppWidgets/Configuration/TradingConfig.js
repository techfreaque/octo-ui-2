import { Button, Tab } from "@mui/material";
import { useSaveTentaclesConfig } from "../../../api/botData";
import MuiTabs from "../../../components/Tabs/MuiTabs";
import { useBotDomainContext } from "../../../context/BotDomainProvider";
import { useBotPlottedElementsContext } from "../../../context/BotPlottedElementsProvider";
import { useMemo } from "react";
import JsonEditor from "@techfreaque/json-editor-react";

export default function TradingConfig() {
    const botPlottedElements = useBotPlottedElementsContext();
    const botDomain = useBotDomainContext();
    const tabsData = []
    botPlottedElements.user_inputs
        && botPlottedElements.user_inputs.data.elements.forEach((element, index) => {
            if (!element.is_hidden) {
                console.log("dsfsdf", element.schema);
                tabsData[index] = {
                    title: (
                        <Tab key={index}
                            label={
                                element.tentacle
                            }
                            value={index}
                            sx={
                                { textTransform: 'none' }
                            } />
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
                            object_layout={"grid"}
                            disable_properties={true}
                            required_by_default={true}
                        />
                    )
                }
            }
        });

    const saveTentaclesConfig = useSaveTentaclesConfig()
    function useSaveEditors() {
        const configs = {}
        Object.keys(window.$JsonEditors).forEach(editorKey => {
            configs[editorKey] = window.$JsonEditors[editorKey].getValue();
        })
        saveTentaclesConfig(configs, botDomain)
    };
    return useMemo(() => (
        <MuiTabs tabs={tabsData}
            rightContent={
                (
                    <Button variant="contained"
                        onClick={useSaveEditors}>Save</Button>
                )
            }
            defaultTabId={0} />
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [botPlottedElements.user_inputs])
}
