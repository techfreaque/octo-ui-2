import { Button, Tab } from "@mui/material";
import MuiTabs from "../../../components/Tabs/MuiTabs";
import { useEffect, useState } from "react";
import JsonEditor from "@techfreaque/json-editor-react";
import defaultJsonEditorSettings from "../../../components/Forms/JsonEditor/JsonEditorDefaults";
import { useSaveTentaclesConfig } from "../../../api/configs";
import { useBotPlottedElementsContext, useUpdateHiddenBacktestingMetadataColumnsContext } from "../../../context/data/BotPlottedElementsProvider";
import { userInputKey, validateJSONEditor } from "../../../components/UserInputs/utils";
import { CUSTOM_USER_INPUT_PATH_SEPARATOR } from "../../../constants/backendConstants";
import createNotification from "../../../components/Notifications/Notification";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";

export default function TradingConfig() {
    const botPlottedElements = useBotPlottedElementsContext();
    const userInputs = botPlottedElements.user_inputs
    const saveTentaclesConfig = useSaveTentaclesConfig()
    const setHiddenMetadataColumns = useUpdateHiddenBacktestingMetadataColumnsContext()
    const botInfo = useBotInfoContext()
    const tradingModeName = botInfo && botInfo.trading_mode_name
    const [tabs, setTabs] = useState([])
    function handleSaveUserInputs() {
        saveUserInputs(saveTentaclesConfig)
    }
    useEffect(() => {
        setTabs(tradingConfigTabs(userInputs, setHiddenMetadataColumns, tradingModeName))
    }, [userInputs, setHiddenMetadataColumns, tradingModeName]);

    return tabs &&
        <MuiTabs
            tabs={tabs}
            rightContent={<Button variant="contained" onClick={handleSaveUserInputs}>Save</Button>}
            defaultTabId={0} />
}

function tradingConfigTabs(userInputs, setHiddenMetadataColumns, tradingModeName) {
    const tabsData = []
    window.trading_mode_objects = {}
    if (userInputs) {
        window.tradingEditors = {}
        // avoid working on original elements as they will be edited for custom user inputs
        const editedUserInputs = JSON.parse(JSON.stringify(userInputs));
        _handleHiddenUserInputs(editedUserInputs, setHiddenMetadataColumns)
        window.customPathUserInputs = _applyCustomPathUserInputs(editedUserInputs, tradingModeName);
        _displayInputsForTentacle(editedUserInputs, "trading", "trading_mode", tabsData)
        _displayInputsForTentacle(editedUserInputs, "null", "evaluator", tabsData)
    }
    return tabsData
}

function _handleHiddenUserInputs(elements, setHiddenMetadataColumns) {
    let hiddenMetadataColumns = [];
    elements.data.elements.forEach(function (inputDetails) {
        hiddenMetadataColumns = hiddenMetadataColumns.concat(
            _hideNotShownUserInputs(inputDetails.tentacle, inputDetails.schema, inputDetails.is_hidden)
        );
    });
    setHiddenMetadataColumns(hiddenMetadataColumns)
}

function saveUserInputs(saveTentaclesConfig) {
    const tentaclesConfigByTentacle = {};
    let save = true;
    const nestedConfigurations = {};
    let tradingTentacle = null;

    Object.keys(window.tradingEditors).forEach((editorKey) => {
        const [tentacleType, tentacle] = editorKey.split("##");
        const configuration = window.$JsonEditors[editorKey]
        if (configuration) {
            const isNested = "nestedTradingModeConfig" === tentacleType;
            if (tentacleType === "tradingMode") {
                tradingTentacle = tentacle;
            }
            const errorsDesc = validateJSONEditor(configuration)
            if (errorsDesc.length === 0) {
                if (isNested) {
                    nestedConfigurations[tentacle] = configuration.getValue();
                } else {
                    tentaclesConfigByTentacle[tentacle] = configuration.getValue();
                }
            }
            else {
                save = false;
                createNotification(`Error when saving ${tentacle} configuration`, "error", `Invalid configuration: ${errorsDesc}`);
            }
        }
    });
    if (tradingTentacle !== null) {
        // trading mode nested configuration is split in their own editor. Merge them back on save
        // store into deep copy to avoid editing forms data when moving custom user inputs
        tentaclesConfigByTentacle[tradingTentacle] = JSON.parse(JSON.stringify({
            ...tentaclesConfigByTentacle[tradingTentacle],
            ...nestedConfigurations
        }));
    }
    _restoreCustomUserInputs(tentaclesConfigByTentacle);
    if (save) {
        saveTentaclesConfig(tentaclesConfigByTentacle)
    }
}

function _restoreCustomUserInputs(tentaclesConfigByTentacle) {
    const findByPath = (fullConfig, path) => {
        // look into a js object using keys
        if (path.length === 0) {
            return fullConfig;
        }
        let foundElement = null;
        Object.values(fullConfig).forEach((value) => {
            let found_config = value;
            let foundElements = 0;
            path.forEach((pathElement) => {
                if (typeof found_config[pathElement] != "undefined") {
                    found_config = found_config[pathElement];
                    foundElements = foundElements + 1;
                } else {
                    return;
                }
            })
            if (foundElements === path.length) {
                foundElement = found_config;
                return;
            }
        })
        return foundElement;
    };
    if (!window.customPathUserInputs.length) {
        return;
    }
    window.customPathUserInputs.forEach((customPathUserInput) => {
        // find each custom user input in their custom location and move them to their original one
        const customConfigContainer = findByPath(tentaclesConfigByTentacle, customPathUserInput.path);
        if (customConfigContainer === null) {
            console.log("Error: impossible to find user input at: ", customPathUserInput.path)
        }
        const value = customConfigContainer[customPathUserInput.key];
        delete customConfigContainer[customPathUserInput.key];
        const tentacle = customPathUserInput.originPath[0];
        // set original value
        findByPath(tentaclesConfigByTentacle[tentacle], customPathUserInput.originPath.slice(1))[customPathUserInput.key] = value;
    });
}

function _displayInputsForTentacle(elements, mainTab, tentacleType, tabsData) {
    const editorKey = tentacleType === "trading_mode" ? "tradingMode" : "tentacles";
    return elements.data.elements.forEach(function (inputDetails) {
        if (inputDetails.tentacle_type === tentacleType && !inputDetails.is_hidden) {
            try {
                // use a local deep copy of inputDetails to be able to edit it (split nested evaluator configurations)
                const localInputDetails = JSON.parse(JSON.stringify(inputDetails));

                if (tentacleType === "trading_mode") {
                    // only split nested evaluator configurations in trading mode configurations
                    _displayNestedEvaluatorInputs(localInputDetails, tabsData);
                }
                _createTentacleConfigTab(
                    localInputDetails.tentacle, localInputDetails.tentacle,
                    localInputDetails.config, localInputDetails.schema, editorKey, tabsData
                );
            } catch (error) {
                window.console && console.error(error);
            }
        }
    });
}

function _displayNestedEvaluatorInputs(inputDetails, tabsData) {
    // create new config elements
    const toRemoveKeys = [];
    Object.keys(inputDetails.config).forEach(key => {
        const value = inputDetails.config[key];
        const options = (inputDetails.schema.properties[key] && inputDetails.schema.properties[key].options) || {};
        const isEvaluatorPath = options.is_custom_path && options.tentacleType === "evaluator"
        if (value instanceof Object && !(value instanceof Array)) {
            if (options.is_nested_tentacle || isEvaluatorPath) {
                _createSplitNestedEvaluatorConfig(key, value, inputDetails.schema.properties[key], tabsData);
                toRemoveKeys.push(key);
            }
        }
    })
    toRemoveKeys.forEach(key => {
        delete inputDetails.config[key];
        delete inputDetails.schema.properties[key];
    })
}

function _createSplitNestedEvaluatorConfig(configName, config, schema, tabsData) {
    _createTentacleConfigTab(schema.title, configName.replaceAll(new RegExp(" ", "g"), "-"), config, schema, "nestedTradingModeConfig", tabsData);
}

function _createTentacleConfigTab(configTitle, configName, config, schema, editorKey, tabsData) {
    window.tradingEditors[editorKey + "##" + configName] = undefined
    Object.keys(schema.properties).length !== 0 && tabsData.push({
        title: (
            <Tab key={configName}
                label={configTitle}
                value={tabsData.length}
                sx={{ textTransform: 'none' }} />
        ),
        content: (
            <JsonEditor
                schema={schema}
                startval={config}
                editorName={editorKey + "##" + configName}
                {...defaultJsonEditorSettings()}
                display_required_only={false}
            />
        )
    });
}

function _hideNotShownUserInputs(tentacle, schema, is_hidden) {
    let hiddenColumns = [];
    Object.keys(schema.properties).forEach((key) => {
        const value = schema.properties[key];
        if (typeof value.properties === "object") {
            hiddenColumns = hiddenColumns.concat(_hideNotShownUserInputs(key, value, false));
        } else {
            if (is_hidden || !value.options.in_summary) {
                hiddenColumns.push(userInputKey(key, tentacle).replaceAll("_", " "));
            }
        }
    })
    return hiddenColumns;
}

function _applyCustomPathUserInputs(elements, tradingModeName) {
    // note: not working:
    // - " " in custom path
    // - custom paths for strategy optimizer
    // - custom paths merger with existing evaluator config
    // - custom paths containing only "trading"
    const customPathUserInputs = [];
    elements.data.elements.forEach((inputDetails) => {
        if (inputDetails.is_hidden) {
            return;
        }
        const toRemoveConfigKeys = [];
        // gather custom user inputs
        Object.keys(inputDetails.schema.properties).forEach((key) => {
            const property = inputDetails.schema.properties[key]
            if (property.options.custom_path !== null && property.options.custom_path !== undefined) {
                const customPath = property.options.custom_path.split(CUSTOM_USER_INPUT_PATH_SEPARATOR);
                if (customPath.length < 1) {
                    console.log("Error: at least 1 element is required is a custom user input path, path: ", customPath);
                    return;
                }
                const tentacleType = customPath[0];
                const originPath = [inputDetails.tentacle]
                customPath.splice(0, 1)
                customPathUserInputs.push({
                    tentacleType: tentacleType,
                    path: customPath,
                    originPath: originPath,
                    key: key,
                    config: inputDetails.config[key],
                    property: property,
                })
                toRemoveConfigKeys.push(key);
            }
        });
        // remove custom inputs from their original fields so that they don't appear there
        toRemoveConfigKeys.forEach(key => {
            delete inputDetails.config[key];
            delete inputDetails.schema.properties[key];
        })
    });
    // patch existing inputs with custom ones or create new groups
    customPathUserInputs.forEach((customInput) => {
        const bestMatchingInput = _findNestedUserInputPathInInputs(customInput, elements, tradingModeName);
        if (bestMatchingInput === null) {
            console.log("Error: no element matching required path for: ", customInput);
            return;
        }
        let currentInputConfig = bestMatchingInput.inputDetails.config;
        let currentInputSchema = bestMatchingInput.inputDetails.schema;
        customInput.path.forEach((toFindKey, index) => {
            if (typeof currentInputConfig[toFindKey] === "undefined") {
                currentInputConfig[toFindKey] = {};
            }
            if (typeof currentInputSchema.properties[toFindKey] === "undefined") {
                // default object schema
                currentInputSchema.properties[toFindKey] = {
                    type: "object",
                    title: toFindKey,
                    properties: {},
                    format: "grid",
                    options: {
                        collapsed: index > 1 && true,
                        grid_columns: 12,
                        is_custom_path: true,
                        tentacleType: customInput.tentacleType,
                    }
                };
            }
            currentInputConfig = currentInputConfig[toFindKey];
            currentInputSchema = currentInputSchema.properties[toFindKey];
        });
        if (typeof currentInputConfig[customInput.key] !== "undefined") {
            console.log("Warning: overriding existing user input by: ", customInput);
        }
        currentInputConfig[customInput.key] = customInput.config;
        currentInputSchema.properties[customInput.key] = customInput.property;
    })
    return customPathUserInputs;
}

function _findNestedUserInputPathInInputs(customInput, elements, tradingModeName) {
    let bestMatchingInputDetails = null;
    let bestMatchingPath = [];
    let toFindEvaluator = null;
    let firstEvaluator = null;
    if (customInput.tentacleType === "evaluator") {
        toFindEvaluator = customInput.path[0];
    } else if (customInput.tentacleType === "trading") {
        toFindEvaluator = tradingModeName;
        window.trading_mode_objects[customInput.path.length ? customInput.path[0] : customInput.key] = true
    }
    elements.data.elements.forEach((inputDetails, index) => {
        if (inputDetails.is_hidden) {
            return;
        }
        if (inputDetails.tentacle_type === "evaluator" || customInput.tentacleType === "trading") {
            if (firstEvaluator === null) {
                firstEvaluator = inputDetails;
            }
            if (toFindEvaluator !== null) {
                if (inputDetails.tentacle !== toFindEvaluator) {
                    return;
                }
            }
        }
        let localMatchingPath = [];
        let currentInput = inputDetails.config;
        customInput.path.forEach((toFindKey, index) => {
            if ((inputDetails.tentacle_type === "evaluator" || inputDetails.tentacle_type === "trading") && index === 0) {
                // for evaluators, the 1st element of the path is the evaluator name which is checked already
                return;
            }
            if (typeof currentInput[toFindKey] === "undefined") {
                return;
            } else {
                localMatchingPath.push(toFindKey)
            }
            currentInput = currentInput[toFindKey];
        });
        // use a score based matching system as paths might not exist and we need to figure out if we can bind to
        // an existing one before creating a new one
        if (bestMatchingPath.length <= localMatchingPath.length) {
            bestMatchingInputDetails = inputDetails
            bestMatchingPath = localMatchingPath;
        }
    });
    if (bestMatchingInputDetails === null && toFindEvaluator !== null) {
        bestMatchingInputDetails = firstEvaluator;
    }
    if (bestMatchingInputDetails !== null) {
        return {
            path: bestMatchingPath,
            inputDetails: bestMatchingInputDetails
        };
    }
    return null;
}