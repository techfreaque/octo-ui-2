import {Button, Tab} from "@mui/material";
import MuiTabs from "../../../components/Tabs/MuiTabs";
import {useEffect, useMemo, useState} from "react";
import defaultJsonEditorSettings from "../../../components/Forms/JsonEditor/JsonEditorDefaults";
import {useUpdateHiddenBacktestingMetadataColumnsContext} from "../../../context/data/BotPlottedElementsProvider";
import {userInputKey, validateJSONEditor} from "../../../components/UserInputs/utils";
import createNotification from "../../../components/Notifications/Notification";
import {useBotInfoContext} from "../../../context/data/BotInfoProvider";
import {useBotDomainContext} from "../../../context/config/BotDomainProvider";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";
import JsonEditor from "@techfreaque/json-editor-react";
import {tentacleConfigType, useFetchCurrentTradingTentaclesConfig, useSaveTentaclesConfig, useTentaclesConfigContext} from "../../../context/config/TentaclesConfigProvider";
import {useFetchTentaclesConfig} from "../../../context/config/TentaclesConfigProvider";


export default function TentaclesConfig({
    content,
    tentacleNames = "RunAnalysisModePlugin"
}) {
    const botInfo = useBotInfoContext()
    const fetchTentaclesConfig = useFetchTentaclesConfig()


    const currentTentaclesConfig = useTentaclesConfigContext()
    const currentTentaclesNonTradingConfig = currentTentaclesConfig ?. [tentacleConfigType.tentacles]
    const saveTentaclesConfig = useSaveTentaclesConfig()
    function handleTentaclesUpdate() {
        fetchTentaclesConfig(tentacleNames.split(","))
    }
    useEffect(() => {
        handleTentaclesUpdate()
    }, [botInfo])

    return (<AbstractTentaclesConfig botInfo={botInfo}
        fetchCurrentTentaclesConfig={handleTentaclesUpdate}
        currentTentaclesTradingConfig={
            {
                [tentacleNames]: currentTentaclesNonTradingConfig ?. [tentacleNames] || {}
            }
        }
        saveTentaclesConfig={saveTentaclesConfig}
        content={content}/>)
}
export function AbstractTentaclesConfig({
    botInfo,
    fetchCurrentTentaclesConfig,
    currentTentaclesTradingConfig,
    saveTentaclesConfig,
    setHiddenMetadataColumns,
    content
}) {
    const botDomain = useBotDomainContext()
    const exchangeId = botInfo ?. exchange_id
    const [tabs, setTabs] = useState()
    const [isSaving, setIsSaving] = useState(false)
    useEffect(() => {
        if (currentTentaclesTradingConfig) 
            setTabs(tradingConfigTabs(currentTentaclesTradingConfig, setHiddenMetadataColumns, exchangeId, botDomain));
        


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTentaclesTradingConfig]);
    useEffect(() => {
        fetchCurrentTentaclesConfig()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exchangeId, botDomain, botInfo]);
    const defaultTabId = botInfo ?. trading_mode_name || botInfo ?. strategy_name
    return useMemo(() => {
        return tabs && defaultTabId && (<MuiTabs tabs={tabs}
            rightContent={
                (<>
                    <AppWidgets layout={content}/>
                    <Button disabled={isSaving}
                        style={
                            {marginLeft: "5px"}
                        }
                        variant="contained"
                        onClick={
                            () => saveUserInputs((newConfigs) => saveTentaclesConfig(newConfigs, setIsSaving, true, true), setIsSaving)
                    }>Save</Button>
                </>)
            }
            defaultTabId={defaultTabId}/>)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content, tabs, defaultTabId])
}

function tradingConfigTabs(userInputs, setHiddenMetadataColumns, exchangeId, botDomain) {
    const tabsData = []
    window.trading_mode_objects = {}
    destroyAllEditors()

    // avoid working on original elements as they will be edited for custom user inputs
    const editedUserInputs = JSON.parse(JSON.stringify(userInputs));

    window.customDisplayAsTabInputs = {}
    Object.keys(editedUserInputs).forEach(TentacleName => {
        create_custom_tabs(editedUserInputs[TentacleName], tabsData)
        _handleHiddenUserInputs(editedUserInputs, setHiddenMetadataColumns)
        // _applyCustomPathUserInputs(editedUserInputs, tradingModeName);
        _createTentacleConfigTab(editedUserInputs[TentacleName].tentacle, editedUserInputs[TentacleName].tentacle, editedUserInputs[TentacleName].config, editedUserInputs[TentacleName].schema, editedUserInputs[TentacleName].tentacle_type, tabsData);

    })
    return tabsData
}

function create_custom_tabs(tentacleInputs, tabsData) {
    window.customDisplayAsTabInputs[tentacleInputs.tentacle] = []
    // gather custom user inputs
    tentacleInputs ?. schema ?. properties && Object.keys(tentacleInputs.schema.properties).forEach((key) => {
        const property = tentacleInputs.schema.properties[key]
        if (property.display_as_tab) {
            window.customDisplayAsTabInputs[tentacleInputs.tentacle].push(key)
            _createTentacleConfigTab(tentacleInputs.schema.properties[key].title, key, tentacleInputs.config[key], tentacleInputs.schema.properties[key], tentacleInputs.tentacle, tabsData)
            delete tentacleInputs.config[key];
            delete tentacleInputs.schema.properties[key]
        }
    })
}

function destroyAllEditors() {
    window.$tradingConfig && Object.keys(window.$tradingConfig).forEach(editorKey => {
        window.$tradingConfig[editorKey].destroy()
        delete window.$tradingConfig[editorKey]
    })
}

function _handleHiddenUserInputs(elements, setHiddenMetadataColumns) {
    let hiddenMetadataColumns = [];
    Object.values(elements).forEach(function (inputDetails) {
        hiddenMetadataColumns = hiddenMetadataColumns.concat(_hideNotShownUserInputs(inputDetails.tentacle, inputDetails.schema, inputDetails.is_hidden));
    });
    setHiddenMetadataColumns && setHiddenMetadataColumns(hiddenMetadataColumns)
}

export function saveUserInputs(saveTentaclesConfig, setIsLoading) {
    setIsLoading && setIsLoading(true)
    const tentaclesConfigByTentacle = {};
    let save = true;
    Object.keys(window.$tradingConfig).forEach((editorKey) => {
        const editor = window.$tradingConfig[editorKey]
        if (editor) {
            const tentacle = editorKey.split("##")[1];
            const errorsDesc = validateJSONEditor(editor)
            if (errorsDesc.length === 0) {
                tentaclesConfigByTentacle[tentacle] = editor.getValue();
            } else {
                save = false;
                createNotification(`Error when saving ${editorKey} configuration`, "danger", `Invalid configuration: ${errorsDesc}`);
            }
        }
    });
    if (save) { // _restoreCustomUserInputs(tentaclesConfigByTentacle);
        _restoreCustomDisplayAsTabInputs(tentaclesConfigByTentacle);
        saveTentaclesConfig(tentaclesConfigByTentacle)
    }
}

function _restoreCustomDisplayAsTabInputs(tentaclesConfigByTentacle) {
    Object.keys(window.customDisplayAsTabInputs).forEach((tentacleName) => {
        window.customDisplayAsTabInputs[tentacleName].forEach((configKey) => {
            tentaclesConfigByTentacle[tentacleName][configKey] = tentaclesConfigByTentacle[configKey]
            delete tentaclesConfigByTentacle[configKey]
        })
    })
}


function _createTentacleConfigTab(configTitle, configName, config, schema, editorKey, tabsData) {
    schema && _addGridDisplayOptions(schema, editorKey);
    try {
        Object.values(schema.properties).forEach(property => property && _addGridDisplayOptions(property, null));
        window.$$counter = window.$$counter + 1 || 1
        Object.keys(schema.properties).length !== 0 && tabsData.push({
            title: (<Tab key={configName}
                label={configTitle}
                value={configName}
                sx={
                    {textTransform: 'none'}
                }/>),
            tabId: configName,
            content: (<JsonEditor schema={schema}
                startval={config}
                editorName={
                    editorKey + "##" + configName
                }
                {...defaultJsonEditorSettings()}
                display_required_only={true}
                counter={
                    window.$$counter
                }
                storageName="tradingConfig"/>)
        });
    } catch (error) {
        window.console && console.error(error);
    }
}

function _addGridDisplayOptions(schema, editorKey) {
    if (typeof schema.format === "undefined") { // display user inputs as grid
        schema.format = "grid";
    }
    if (typeof schema.options === "undefined") {
        schema.options = {};
    }
    if (schema.grid_columns) {
        schema.options.grid_columns = schema.grid_columns
    }
    if (typeof schema.options.grid_columns === "undefined") {
        schema.options.grid_columns = 12;
    }
}

function _hideNotShownUserInputs(tentacle, schema, is_hidden) {
    let hiddenColumns = [];
    schema?.properties && Object.keys(schema.properties).forEach((key) => {
        const value = schema.properties[key];
        if (typeof value.properties === "object") {
            hiddenColumns = hiddenColumns.concat(_hideNotShownUserInputs(key, value, false));
        } else if (is_hidden || ! value.options.in_summary) {
            hiddenColumns.push(userInputKey(key, tentacle).replaceAll("_", " "));
        }
    })
    return hiddenColumns;
}


// function _restoreCustomUserInputs(tentaclesConfigByTentacle) {
//     const findByPath = (fullConfig, path) => {
//         // look into a js object using keys
//         if (path.length === 0) {
//             return fullConfig;
//         }
//         let foundElement = null;
//         Object.values(fullConfig).forEach((value) => {
//             let found_config = value;
//             let foundElements = 0;
//             path.forEach((pathElement) => {
//                 if (typeof found_config[pathElement] != "undefined") {
//                     found_config = found_config[pathElement];
//                     foundElements = foundElements + 1;
//                 } else {
//                     return;
//                 }
//             })
//             if (foundElements === path.length) {
//                 foundElement = found_config;
//                 return;
//             }
//         })
//         return foundElement;
//     };
//     if (!window.customPathUserInputs.length) {
//         return;
//     }
//     window.customPathUserInputs.forEach((customPathUserInput) => {
//         // find each custom user input in their custom location and move them to their original one
//         const customConfigContainer = findByPath(tentaclesConfigByTentacle, customPathUserInput.path);
//         if (customConfigContainer === null) {
//             console.log("Error: impossible to find user input at: ", customPathUserInput.path)
//         }
//         const value = customConfigContainer[customPathUserInput.key];
//         delete customConfigContainer[customPathUserInput.key];
//         const tentacle = customPathUserInput.originPath[0];
//         // set original value
//         findByPath(tentaclesConfigByTentacle[tentacle], customPathUserInput.originPath.slice(1))[customPathUserInput.key] = value;
//     });
// }

// function _displayInputsForTentacle(elements, mainTab, tentacleType, tabsData) {
//     const editorKey = tentacleType === "trading_mode" ? "tradingMode" : "tentacles";
//     return elements.forEach(function (inputDetails) {
//         if (inputDetails.tentacle_type === tentacleType && !inputDetails.is_hidden) {
//             try {
//                 // use a local deep copy of inputDetails to be able to edit it (split nested evaluator configurations)
//                 const localInputDetails = JSON.parse(JSON.stringify(inputDetails));

//                 if (tentacleType === "trading_mode") {
//                     // only split nested evaluator configurations in trading mode configurations
//                     _displayNestedEvaluatorInputs(localInputDetails, tabsData);
//                 }
//                 _createTentacleConfigTab(
//                     localInputDetails.tentacle, localInputDetails.tentacle,
//                     localInputDetails.config, localInputDetails.schema, editorKey, tabsData
//                 );
//             } catch (error) {
//                 window.console && console.error(error);
//             }
//         }
//     });
// }

// function _displayNestedEvaluatorInputs(inputDetails, tabsData) {
//     // create new config elements
//     const toRemoveKeys = [];
//     Object.keys(inputDetails.config).forEach(key => {
//         const value = inputDetails.config[key];
//         const options = (inputDetails.schema.properties[key] && inputDetails.schema.properties[key].options) || {};
//         const isEvaluatorPath = options.is_custom_path && options.tentacleType === "evaluator"
//         if (value instanceof Object && !(value instanceof Array)) {
//             if (options.is_nested_tentacle || isEvaluatorPath) {
//                 _createSplitNestedEvaluatorConfig(key, value, inputDetails.schema.properties[key], tabsData);
//                 toRemoveKeys.push(key);
//             }
//         }
//     })
//     toRemoveKeys.forEach(key => {
//         delete inputDetails.config[key];
//         delete inputDetails.schema.properties[key];
//     })
// }

// function _createSplitNestedEvaluatorConfig(configName, config, schema, tabsData) {
//     _createTentacleConfigTab(schema.title, configName.replaceAll(new RegExp(" ", "g"), "-"), config, schema, "nestedTradingModeConfig", tabsData);
// }

// function _applyCustomPathUserInputs(elements, tradingModeName) {
//     // note: not working:
//     // - " " in custom path
//     // - custom paths for strategy optimizer
//     // - custom paths merger with existing evaluator config
//     // - custom paths containing only "trading"
//     const customPathUserInputs = [];
//     const customDisplayAsTabInputs = [];
//     elements.forEach((inputDetails) => {
//         if (inputDetails.is_hidden) {
//             return;
//         }
//         const toRemoveConfigKeys = [];
//         // gather custom user inputs
//         Object.keys(inputDetails.schema.properties).forEach((key) => {
//             const property = inputDetails.schema.properties[key]
//             if (property.display_as_tab) {
//                 customDisplayAsTabInputs.push({
//                     tentacleType: inputDetails.tentacle_type,
//                     tentacle: inputDetails.tentacle,
//                     key: key,
//                     title: property.title,
//                     config: JSON.parse(JSON.stringify(inputDetails.config[key])),
//                     property: property,
//                 })
//                 toRemoveConfigKeys.push(key);
//             }
//             // else if (property.options.custom_path !== null && property.options.custom_path !== undefined) {
//             //     const customPath = property.options.custom_path.split(CUSTOM_USER_INPUT_PATH_SEPARATOR);
//             //     if (customPath.length < 1) {
//             //         console.log("Error: at least 1 element is required for a custom user input path, path: ", customPath);
//             //         return;
//             //     }
//             //     const tentacleType = customPath[0];
//             //     const originPath = [inputDetails.tentacle]
//             //     customPath.splice(0, 1)
//             //     customPathUserInputs.push({
//             //         tentacleType: tentacleType,
//             //         path: customPath,
//             //         originPath: originPath,
//             //         key: key,
//             //         config: inputDetails.config[key],
//             //         property: property,
//             //     })
//             //     toRemoveConfigKeys.push(key);
//             // }
//         });
//         // remove custom inputs from their original fields so that they don't appear there
//         toRemoveConfigKeys.forEach(key => {
//             delete inputDetails.config[key];
//             delete inputDetails.schema.properties[key];
//         })
//     });
//     // patch existing inputs with custom ones or create new groups
//     customPathUserInputs.forEach((customInput) => {
//         const bestMatchingInput = _findNestedUserInputPathInInputs(customInput, elements, tradingModeName);
//         if (bestMatchingInput === null) {
//             console.log("Error: no element matching required path for: ", customInput);
//             return;
//         }
//         let currentInputConfig = bestMatchingInput.inputDetails.config;
//         let currentInputSchema = bestMatchingInput.inputDetails.schema;
//         customInput.path.forEach((toFindKey, index) => {
//             if (typeof currentInputConfig[toFindKey] === "undefined") {
//                 currentInputConfig[toFindKey] = {};
//             }
//             if (typeof currentInputSchema.properties[toFindKey] === "undefined") {
//                 // default object schema
//                 currentInputSchema.properties[toFindKey] = {
//                     type: "object",
//                     title: toFindKey,
//                     properties: {},
//                     format: "grid",
//                     options: {
//                         collapsed: index > 1 && true,
//                         grid_columns: 12,
//                         is_custom_path: true,
//                         tentacleType: customInput.tentacleType,
//                     }
//                 };
//             }
//             currentInputConfig = currentInputConfig[toFindKey];
//             currentInputSchema = currentInputSchema.properties[toFindKey];
//         });
//         if (typeof currentInputConfig[customInput.key] !== "undefined") {
//             console.log("Warning: overriding existing user input by: ", customInput);
//         }
//         currentInputConfig[customInput.key] = customInput.config;
//         currentInputSchema.properties[customInput.key] = customInput.property;
//     })
//     window.customPathUserInputs = customPathUserInputs
//     window.customDisplayAsTabInputs = customDisplayAsTabInputs
//     return customDisplayAsTabInputs
// }

// function _findNestedUserInputPathInInputs(customInput, elements, tradingModeName) {
//     let bestMatchingInputDetails = null;
//     let bestMatchingPath = [];
//     let toFindEvaluator = null;
//     let firstEvaluator = null;
//     if (customInput.tentacleType === "evaluator") {
//         toFindEvaluator = customInput.path[0];
//     } else if (customInput.tentacleType === "trading") {
//         toFindEvaluator = tradingModeName;
//         window.trading_mode_objects[customInput.path.length ? customInput.path[0] : customInput.key] = true
//     }
//     elements.forEach((inputDetails, index) => {
//         if (inputDetails.is_hidden) {
//             return;
//         }
//         if (inputDetails.tentacle_type === "evaluator" || customInput.tentacleType === "trading") {
//             if (firstEvaluator === null) {
//                 firstEvaluator = inputDetails;
//             }
//             if (toFindEvaluator !== null) {
//                 if (inputDetails.tentacle !== toFindEvaluator) {
//                     return;
//                 }
//             }
//         }
//         let localMatchingPath = [];
//         let currentInput = inputDetails.config;
//         customInput.path.forEach((toFindKey, index) => {
//             if ((inputDetails.tentacle_type === "evaluator" || inputDetails.tentacle_type === "trading") && index === 0) {
//                 // for evaluators, the 1st element of the path is the evaluator name which is checked already
//                 return;
//             }
//             if (typeof currentInput[toFindKey] === "undefined") {
//                 return;
//             } else {
//                 localMatchingPath.push(toFindKey)
//             }
//             currentInput = currentInput[toFindKey];
//         });
//         // use a score based matching system as paths might not exist and we need to figure out if we can bind to
//         // an existing one before creating a new one
//         if (bestMatchingPath.length <= localMatchingPath.length) {
//             bestMatchingInputDetails = inputDetails
//             bestMatchingPath = localMatchingPath;
//         }
//     });
//     if (bestMatchingInputDetails === null && toFindEvaluator !== null) {
//         bestMatchingInputDetails = firstEvaluator;
//     }
//     if (bestMatchingInputDetails !== null) {
//         return {
//             path: bestMatchingPath,
//             inputDetails: bestMatchingInputDetails
//         };
//     }
//     return null;
// }
