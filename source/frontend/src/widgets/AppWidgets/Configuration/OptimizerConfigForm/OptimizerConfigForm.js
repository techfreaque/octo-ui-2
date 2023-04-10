import {useEffect, useMemo} from "react";
import {OPTIMIZER_INPUTS_KEY, _INPUT_SEPARATOR} from "../../../../constants/backendConstants";
import {useUiConfigContext} from "../../../../context/config/UiConfigProvider";
import $ from "jquery";
import OptimizerSettingTemplate from "./OptimizerInputTemplate";
// eslint-disable-next-line no-unused-vars
import select2 from "select2/dist/js/select2.js" // required
import {useUpdateOptimizerEditorCounterContext} from "../../../../context/config/OptimizerEditorProvider";
import {useGetAndSaveOptimizerForm} from "../../../../context/actions/BotOptimizerProvider";
import {tentacleConfigType, useTentaclesConfigContext} from "../../../../context/config/TentaclesConfigProvider";
import AntButton , { buttonTypes } from "../../../../components/Buttons/AntButton";

export default function OptimizerConfigForm() {
    const uiConfig = useUiConfigContext()
    const optimizerConfig = uiConfig[OPTIMIZER_INPUTS_KEY] || {}
    const currentTentaclesConfig = useTentaclesConfigContext()
    const currentTentaclesTradingConfig = currentTentaclesConfig?.[tentacleConfigType.tradingTentacles]

    const updateOptimizerEditorCounter = useUpdateOptimizerEditorCounterContext()
    const saveOptimizerForm = useGetAndSaveOptimizerForm()
    useEffect(() => {
        currentTentaclesTradingConfig && uiConfig && _buildOptimizerSettingsForm(currentTentaclesTradingConfig, optimizerConfig, updateOptimizerEditorCounter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTentaclesTradingConfig, optimizerConfig, uiConfig]);
    return useMemo(() => {
        return (<div>
            <div>
                <AntButton buttonType={
                        buttonTypes.primary
                    }
                    onClick={saveOptimizerForm}
                    text="Save Optimizer Form"/>
            </div>
            <div id="strategy-optimizer-inputs">
                <OptimizerSettingTemplate/>
            </div>
            {/* <div id="strategy-optimizer-filters" className="my-4 mx-2 pb-4">
                    <h4>
                        Run filters
                    </h4>
                    <p>
                        If a run validates any of these statements, it will be discarded.
                    </p>
                    <OptimizerRunFilterTemplate />
                </div> */} </div>)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTentaclesConfig, optimizerConfig, uiConfig])
}

async function _buildOptimizerSettingsForm(schemaElements, optimizerConfig, updateOptimizerEditorCounter) {
    const settingsRoot = $("#optimizer-settings-root");
    settingsRoot.empty();
    // reset user inputs custom paths
    // window.CUSTOM_PATH_USER_INPUTS = {};

    // _buildCustomPathSchema(schemaElements, optimizerConfig)

    Object.values(schemaElements).forEach(function (element) {
        if (element.is_hidden) {
            return;
        }
        let atLeastOneUserInput = false;
        const tentacleName = element.tentacle
        const inputGroupId = _appendInputGroupFromTemplate(settingsRoot, tentacleName);
        const inputGroupElement = $(document.getElementById(inputGroupId));
        const inputGroupContent = inputGroupElement.find(".input-content");
        const configInputs = typeof optimizerConfig.user_inputs === "undefined" ? {} : optimizerConfig.user_inputs
        Object.values(element.schema.properties).forEach(function (inputDetail) {
            if (_buildOptimizerConfigElementSettingForm(inputGroupContent, inputDetail, configInputs, tentacleName, inputDetail.options.name)) {
                atLeastOneUserInput = true;
            }
        });
        if (! atLeastOneUserInput) {
            inputGroupElement.remove();
        }
    })
    // $("#optimizer-filters-root").empty();
    // _buildOptimizerFilters(optimizerConfig.filters_settings, false);
    _updateCounter(updateOptimizerEditorCounter);
    updateInputSettingsDisplay(settingsRoot);
    // settingsRoot.find("input, select").each((i, jsInputSetting) => {
    //     $(jsInputSetting).on("change", () => _updateCounter(updateOptimizerEditorCounter));
    // })
    // $("#add-optimizer-filter").click(() => {
    //     _buildOptimizerFilters(null, true);
    // })
}

export function getOptimizerSettingsValues() {
    const settings = {
        filters_settings: _getOptimizerFiltersValues($("#optimizer-filters-root")),
        user_inputs: {}
    };
    $("#optimizer-settings-root").find(".optimizer-input-setting").each(function (i, jsInputSetting) {
        const inputSetting = $(jsInputSetting);
        const rawSettingName = inputSetting.data("input-setting-base-name")
        let tentacleValue = inputSetting.data("tentacle-name")
        let settingValue = inputSetting.val();
        const valueType = inputSetting.data("type")
        if (valueType === "number") {
            const minInputSetting = inputSetting
            const maxInputSetting = $(document.getElementById(`${tentacleValue}-${rawSettingName}-Input-setting-number-max`));
            const stepInputSetting = $(document.getElementById(`${tentacleValue}-${rawSettingName}-Input-setting-number-step`));
            settingValue = {
                min: Number(minInputSetting.val()),
                max: Number(maxInputSetting.val()),
                step: Number(stepInputSetting.val())
            }
        } else if (valueType === "boolean") {
            settingValue = inputSetting.val().map((x) => (x.toLowerCase() === "true"));
        }
        const enabled = $(document.getElementById(`${tentacleValue}-${rawSettingName}-Input-enabled-value`)).prop("checked");
        // TODO Here for custom input path writing (in a dedicated function):
        // nested config as well as custom path will contain "_INPUT_SEPARATOR" as a separator in "rawSettingName"
        // this is fine for nested config and should not be changed but has to be rolled back to the original path
        // (split by "_INPUT_SEPARATOR") when it comes to custom path fields
        // => if rawSettingName is corresponding to a custom path user input listed into "CUSTOM_PATH_USER_INPUTS"
        //    when building the optimizer form,
        //    restore the original path for this input (split by "_INPUT_SEPARATOR" if necessary) and store it into
        //    "rawSettingName" to be used in the following line

        // const originalTentacleValue = window.CUSTOM_PATH_USER_INPUTS[rawSettingName]
        // if (originalTentacleValue) {
        //     tentacleValue = originalTentacleValue
        // }

        settings.user_inputs[_optimizeUserInputIdentifier(tentacleValue, rawSettingName)] = {
            value: settingValue,
            user_input: rawSettingName.replaceAll(" ", "_"),
            tentacle: tentacleValue,
            type: valueType,
            enabled
        };
    })
    return settings;
}

function _getOptimizerFiltersValues(settingsRoot) {
    const filterValues = [];
    settingsRoot.find(".optimizer-filter-entry").each((i, jsfilterEntry) => {
        const filterEntryElement = $(jsfilterEntry);
        filterValues.push({
            user_input_left_operand: _optimizerFilterPart(filterEntryElement, "[data-role='user_input_left_operand']"),
            operator: _optimizerFilterPart(filterEntryElement, "[data-role='operator']"),
            user_input_right_operand: _optimizerFilterPart(filterEntryElement, "[data-role='user_input_right_operand']"),
            text_right_operand: _optimizerFilterPart(filterEntryElement, "[data-role='text_right_operand']")
        })
    });
    return filterValues;
}

function _optimizerFilterPart(parent, selector) {
    const element = $(parent.find(selector)[0]);
    return {role: element.data("role"), type: element.data("type"), value: element.val()}
}

// function _buildOptimizerFilters(filtersSettings, blank) {
//     const optimizerSettings = getOptimizerSettingsValues().user_inputs;
//     const userInputIdentifiers = Object.values(optimizerSettings).map(userInput => {
//         return {
//             identifier: _optimizeUserInputIdentifier(userInput.tentacle, userInput.user_input),
//             text: `${userInput.user_input} [${userInput.tentacle.split(_INPUT_SEPARATOR).join(":")}]`
//         }
//     });
//     const filterGroupContent = $("#optimizer-filters-root");
//     if (blank) {
//         _buildUserInputFilterEntry(filterGroupContent, null, userInputIdentifiers);
//     } else if (typeof filtersSettings !== "undefined") {
//         filtersSettings.forEach(filterSetting => {
//             _buildUserInputFilterEntry(filterGroupContent, filterSetting, userInputIdentifiers);
//         })
//     }
// }

// function _buildUserInputFilterEntry(filterGroupContent, filterSetting, userInputIdentifiers) {
//     const newInputFilter = _getInputFilterFromTemplate(userInputIdentifiers, filterSetting);
//     filterGroupContent.append(newInputFilter);
// }

function _buildUserInputConfigEntry(inputGroupContent, valueType, inputDetail, configValues, tentacleName) {
    const newInputSetting = _getInputSettingFromTemplate(valueType, inputDetail, tentacleName)
    if (newInputSetting !== null) {
        inputGroupContent.append(newInputSetting);
        _updateInputDetailValues(valueType, inputDetail, configValues, tentacleName);
    }
}

function _buildOptimizerConfigElementSettingForm(inputGroupContent, inputDetails, configValues, parentInputIdentifier, inputIdentifier) {
    if (inputDetails.options.in_optimizer) {
        const valueType = _getValueType(inputDetails.type);
        if (valueType === "nested_config") {
            _buildOptimizerNestedConfigSettingsForm(inputGroupContent, inputDetails, configValues, `${parentInputIdentifier}${_INPUT_SEPARATOR}${inputIdentifier}`);
        } else {
            _buildUserInputConfigEntry(inputGroupContent, valueType, inputDetails, configValues, parentInputIdentifier);
        }
        return true;
    }
    return false;
}
function _buildOptimizerNestedConfigSettingsForm(inputGroupContent, inputDetail, configValues, parentInputIdentifier) {
    let atLeastOneUserInput = false;
    const nestedInputGroupId = _appendNestedInputGroupFromTemplate(inputGroupContent, parentInputIdentifier, inputDetail.options.name);
    const nestedInputGroupElement = $(document.getElementById(nestedInputGroupId));
    const nestedInputGroupContent = nestedInputGroupElement.find(".input-content");
    Object.keys(inputDetail.properties).forEach(function (nestedInput) {
        const nestedInputDetails = inputDetail.properties[nestedInput];
        if (_buildOptimizerConfigElementSettingForm(nestedInputGroupContent, nestedInputDetails, configValues, parentInputIdentifier, nestedInput)) {
            atLeastOneUserInput = true;
        }
    });
    if (! atLeastOneUserInput) {
        nestedInputGroupElement.remove();
    }
}

function _appendInputGroup(parent, template, groupIdentifier, groupName) {
    let inputGroup = template.html().replace(new RegExp("XYZT", "g"), groupName);
    inputGroup = inputGroup.replace(new RegExp("XYZ", "g"), groupIdentifier);
    parent.append(inputGroup);
}

function _appendInputGroupFromTemplate(settingsRoot, tentacleName) {
    const template = $("#optimizer-settings-tentacle-group-template");
    _appendInputGroup(settingsRoot, template, tentacleName, tentacleName)
    return `optimizer-settings-${tentacleName}-tentacle-group-template`;
}

function _appendNestedInputGroupFromTemplate(settingsRoot, nestedConfigIdentifier, nestedConfigName) {
    const template = $("#optimizer-settings-nested-tentacle-config-template");
    _appendInputGroup(settingsRoot, template, nestedConfigIdentifier, nestedConfigName)
    return `optimizer-settings-${nestedConfigIdentifier}-nested-tentacle-config-template`;
}

function _getInputSettingFromTemplate(valueType, inputDetail, tentacleName) {
    const template = _getInputSettingTemplate(valueType);
    if (template.length) {
        let inputSettings = template.html().replace(new RegExp("XYZT", "g"), inputDetail.title);
        inputSettings = inputSettings.replace(new RegExp("XYZ", "g"), inputDetail.options.name);
        inputSettings = inputSettings.replace(new RegExp("ZYXDefaultValue", "g"), inputDetail.default);
        inputSettings = inputSettings.replace(new RegExp("TENTACLEABC", "g"), tentacleName);
        return inputSettings;
    } else {
        console.log(`Unhandled value type: "${valueType}": no strategy optimizer template found.`)
        return null;
    }
}

// function _getInputFilterFromTemplate(userInputIdentifiers, filterSetting) {
//     const filterEntry = $("#optimizer-filter-template").clone();
//     filterEntry.removeAttr("id");
//     filterEntry.find("select[data-type='user-input'], select[data-type='operator']").each((i, jsElement) => {
//         const element = $(jsElement);
//         const role = element.data("role");
//         if (element.data("type") === "user-input") {
//             userInputIdentifiers.forEach(identifier => {
//                 element.append(new Option(identifier.text, identifier.identifier, false,
//                     filterSetting === null ? false : filterSetting[role].value === identifier.identifier));
//             })
//         } else if (filterSetting !== null) {
//             element.val(filterSetting[role].value);
//         }
//     });
//     filterEntry.find("input[data-type='text']").each((i, jsElement) => {
//         const element = $(jsElement);
//         const role = element.data("role");
//         if (filterSetting !== null && typeof filterSetting[role] !== "undefined") {
//             element.val(filterSetting[role].value);
//         }
//     });
//     filterEntry.find("button[data-action='delete']").click(() => {
//         filterEntry.remove();
//     })
//     return filterEntry
// }

function _getInputSettingTemplate(valueType) {
    return $(`#optimizer-settings-${valueType}-template`);
}

function _getValueType(schemaValueType) {
    if (schemaValueType === "string") {
        return "options";
    } else if (schemaValueType === "array") {
        return "multiple-options";
    } else if (schemaValueType === "object") {
        return "nested_config"
    }
    return schemaValueType;
}

function _updateInputDetailValues(valueType, inputDetail, configValues, tentacleIdentifier) {
    const rawValue = configValues[`${tentacleIdentifier}-${
            inputDetail.options.name.replaceAll(" ", "_")
        }`];
    let configValue = undefined;
    let isEnabled = false;
    if (typeof rawValue !== "undefined") {
        configValue = rawValue.value;
        isEnabled = rawValue.enabled;
    }
    if (["options", "multiple-options", "boolean"].includes(valueType)) {
        let values = typeof configValue === "undefined" ? [] : configValue
        const valuesSelect = $(document.getElementById(`${tentacleIdentifier}-${
            inputDetail.options.name
        }-Input-setting-${valueType}`));
        if (valueType === "options") {
            if (inputDetail?.enum) {
                inputDetail.enum.forEach((value) => {
                    const isSelected = values.includes(value);
                    valuesSelect.append(new Option(value, value, false, isSelected));
                })

            } else { // TODO add string support
            }
        } else if (valueType === "multiple-options") {
            inputDetail.items.enum.forEach((value) => {
                const isSelected = values.includes(value);
                valuesSelect.append(new Option(value, value, false, isSelected));
            })
        } else if (valueType === "boolean") {
            values = values.map((x) => String(x))
            valuesSelect.find("option").each((i, jsOption) => {
                const option = $(jsOption);
                const isSelected = values.indexOf(option.attr("value")) !== -1;
                option.attr("selected", isSelected);
            })
        }
    } else if (valueType === "number") {
        let values = typeof configValue === "undefined" ? {
            min: 0,
            max: 0,
            step: 1
        } : configValue;
        ["min", "max", "step"].forEach(function (suffix) {
            const element = $(document.getElementById(`${tentacleIdentifier}-${
                inputDetail.options.name
            }-Input-setting-number-${suffix}`));
            const value = values[suffix];
            element.val(value);
        })
    }
    $(document.getElementById(`${tentacleIdentifier}-${
        inputDetail.options.name
    }-Input-enabled-value`)).prop("checked", isEnabled);
}

function updateInputSettingsDisplay(settingsRoot) {
    settingsRoot.find("select[multiple]").select2({
        width: 'resolve', // need to override the changed default
        closeOnSelect: false,
        placeholder: "Select values to use"
    });
}

function _updateCounter(updateOptimizerEditorCounter) {
    const userInputs = getOptimizerSettingsValues().user_inputs;
    let runsCount = 0;
    Object.values(userInputs).forEach(userInput => {
        if (userInput.enabled) {
            if (runsCount === 0) {
                runsCount = 1;
            }
            const value = userInput.value;
            if (value instanceof Array) {
                runsCount *= value.length;
            } else if (typeof value.step !== "undefined") {
                if (value.step > 0) {
                    const window = value.max - value.min;
                    runsCount *= Math.floor(window / value.step + 1);
                }
            } else {
                console.log("Unhandled user input type to compute optimizer runs count: ", value);
            }
        }
    });
    updateOptimizerEditorCounter(runsCount);
    // $("#backtesting-computations-count").text(runsCount * new Number($("#backtesting-candles-counts").text()));
}

function _optimizeUserInputIdentifier(tentacleValue, inputName) {
    return `${tentacleValue}-${
        inputName.replaceAll(" ", "_")
    }`
}
// function _modifyStoredSettings(configValues, input_key, stored_settings_path, tentacle_name) {
//     const old_name = `${tentacle_name}-${input_key}`
//     if (configValues.user_inputs) {
//         const saved_input = configValues.user_inputs[old_name]
//         if (saved_input) {
//             const new_name = `${stored_settings_path}-${input_key}`
//             saved_input.tentacle = stored_settings_path
//             configValues.user_inputs[new_name] = saved_input
//             delete configValues.user_inputs[old_name]
//         }
//     }
// }

// function _moveInputToPath(input_key, tentacle_schema, configValues) {
//     const path_list = tentacle_schema.schema.properties[input_key].options.custom_path.split(CUSTOM_USER_INPUT_PATH_SEPARATOR)
//     let target_obj = tentacle_schema.schema.properties
//     path_list.shift()
//     let stored_settings_path = tentacle_schema.tentacle;
//     for (let path in path_list) {
//         try {
//             target_obj = target_obj[path_list[path]].properties
//         } catch (e) {
//             target_obj[path_list[path]] = {
//                 title: path_list[path],
//                 type: "object",
//                 options: {
//                     in_optimizer: true,
//                     name: path_list[path],
//                 },
//                 properties: {},
//             }
//             target_obj = target_obj[path_list[path]]["properties"]
//         }
//         stored_settings_path = `${stored_settings_path}${_INPUT_SEPARATOR}${path_list[path]}`
//     }
//     target_obj[input_key] = tentacle_schema.schema.properties[input_key]
//     window.CUSTOM_PATH_USER_INPUTS[target_obj[input_key].options.name] = tentacle_schema.tentacle

//     _modifyStoredSettings(configValues, input_key, stored_settings_path, tentacle_schema.tentacle)

//     delete tentacle_schema.schema.properties[input_key]
// }

// function _buildCustomPathSchema(schemaElements, configValues) {
//     schemaElements.data.elements.forEach(function (_tentacle) {
//         if (_tentacle.is_hidden) { return }
//         for (let input_key in _tentacle.schema.properties) {
//             if (_tentacle.schema.properties[input_key].options.custom_path) {
//                 _moveInputToPath(input_key, _tentacle, configValues)
//             }
//         }
//     })
// }
