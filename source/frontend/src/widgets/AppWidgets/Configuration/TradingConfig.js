import { Button, Tab } from "@mui/material";
import { useSaveTentaclesConfig } from "../../../api/botData";
import MuiTabs from "../../../components/Tabs/MuiTabs";
import { useBotPlottedElementsContext } from "../../../context/BotPlottedElementsProvider";
import { useMemo } from "react";
import JsonEditor from "@techfreaque/json-editor-react";
import defaultJsonEditorSettings from "../../../components/Forms/JsonEditor/JsonEditorDefaults";

export default function TradingConfig() {
    const botPlottedElements = useBotPlottedElementsContext();
    const tabsData = []
    botPlottedElements.user_inputs
        && botPlottedElements.user_inputs.data.elements.forEach((element, index) => {
            if (!element.is_hidden) {
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
                            {...defaultJsonEditorSettings()}
                        />
                    )
                }
            }
        });

    const saveTentaclesConfig = useSaveTentaclesConfig()
    function useSaveEditors() {
        const configs = {}
        botPlottedElements.user_inputs.data.elements.forEach(editor => {
            configs[editor.tentacle] = window.$JsonEditors[editor.tentacle].getValue();
        })
        saveTentaclesConfig(configs)
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
