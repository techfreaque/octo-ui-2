import { useEffect } from "react";
import { CUSTOM_USER_INPUT_PATH_SEPARATOR, OPTIMIZER_INPUTS_KEY, _INPUT_SEPARATOR } from "../../../constants/backendConstants";
import { useUiConfigContext } from "../../../context/config/UiConfigProvider";
import { useBotPlottedElementsContext } from "../../../context/data/BotPlottedElementsProvider";
import $ from "jquery";

export default function OptimizerConfigForm() {
    const uiConfig = useUiConfigContext()
    const optimizerConfig = uiConfig[OPTIMIZER_INPUTS_KEY]
    const plotData = useBotPlottedElementsContext()
    const userInputs = plotData.user_inputs
    useEffect(() => {
        console.log("dsdsd", plotData)
        // plotData && userInputs &&
            // _buildOptimizerSettingsForm(userInputs, optimizerConfig);
    }, [userInputs]);
    return (
        <div>
            <div id="strategy-optimizer-inputs">
                <OptimizerSettingTemplate />
            </div>
            <div id="strategy-optimizer-filters" className="my-4 mx-2">
                <h4>
                    Run filters
                </h4>
                <p>
                    If a run validates any of these statements, it will be discarded.
                </p>
                <OptimizerRunFilterTemplate />
            </div>
        </div>
    )
}

function OptimizerSettingTemplate() {
    return (
        <div className="mx-4">
            <div className="row border">
                <div className="col-3 p-2">Input name</div>
                <div className="col-7 p-2">Values</div>
                <div className="col-2 p-2">Enabled</div>
            </div>
            <div className="row border" id="optimizer-settings-root">
            </div>
            <div className="row border d-none" id="optimizer-settings-default-values">
                <OptimizerSettingTentacleGroupTemplate />
                <OptimizerSettingNestedTentacleConfigTemplate />
                <OptimizerSetting valueType={"number"} />
                <OptimizerSetting valueType={"options"} />
                <OptimizerSetting valueType={"multiple-options"} />
                <OptimizerSetting valueType={"boolean"} />
            </div>
        </div>
    )
}
function OptimizerSettingTentacleGroupTemplate() {
    return (
        <div id="optimizer-settings-tentacle-group-template">
            <div id="optimizer-settings-XYZ-tentacle-group-template" className="w-100 border">
                <div className="row">
                    XYZT
                </div>
                <div className="row input-content w-100 mx-0">
                </div>
            </div>
        </div>
    )
}
function OptimizerSettingNestedTentacleConfigTemplate() {
    return (
        <div id="optimizer-settings-nested-tentacle-config-template">
            <div id="optimizer-settings-XYZ-nested-tentacle-config-template" className="w-100 px-4 border">
                <div className="row">
                    XYZT
                </div>
                <div className="row input-content w-100 mx-0">
                </div>
            </div>
        </div>
    )
}
function OptimizerSetting({ valueType }) {
    let input
    if (valueType === "number") {
        input = <OptimizerSettingNumber />
    } else if (valueType === "options" || valueType === "multiple-options") {
        input = <OptimizerSettingOptions />
    } else if (valueType === "boolean") {
        input = <OptimizerSettingBoolean />
    }
    return (
        <div className="row w-100 mx-0 border" id="optimizer-settings-{{value_type}}-template">
            <div className="col-3 setting-name p-2" id="XYZInput-name">
                XYZT
            </div>
            <div className="col-8 setting-values row p-2" id="XYZInput-values">
                {input}
            </div>
            <div className="col-1 setting-enabled p-2" id="XYZInput-enabled">
                <div className="custom-control custom-switch">
                    <input type="checkbox"
                        className="custom-control-input"
                        data-tentacle-name="TENTACLEABC"
                        id="TENTACLEABC-XYZ-Input-enabled-value" />
                    <label className="custom-control-label text-capitalize"
                        for="TENTACLEABC-XYZ-Input-enabled-value"
                        data-toggle="tooltip" title="Enabled">
                    </label>
                </div>
            </div>
        </div>
    )
}

function OptimizerSettingBoolean() {
    return (
        <div className="col">
            <label className="text-capitalize" for="TENTACLEABC-XYZ-Input-setting-boolean"></label>
            <select id="TENTACLEABC-XYZ-Input-setting-boolean"
                className="w-100 optimizer-input-setting"
                data-tentacle-name="TENTACLEABC"
                data-input-setting-name="XYZ"
                data-input-setting-base-name="XYZ"
                data-type="boolean"
                multiple="multiple"
                style={{ width: "99%" }}>
                <option value="true">
                    True
                </option>
                <option value="false">
                    False
                </option>
            </select>
        </div>
    )
}

function OptimizerSettingOptions() {
    return (
        <div className="col">
            <label className="text-capitalize" for="TENTACLEABC-XYZ-Input-setting-options"></label>
            <select id="TENTACLEABC-XYZ-Input-setting-options"
                className="optimizer-input-setting"
                data-tentacle-name="TENTACLEABC"
                data-input-setting-name="XYZ"
                data-input-setting-base-name="XYZ"
                data-type="string"
                multiple="multiple"
                style={{ width: "99%" }}>
            </select>
        </div>
    )
}
function OptimizerSettingNumber() {
    return (
        <><div className="col-4">
            <div className="input-group input-group-sm">
                <div className="input-group-prepend">
                    <label className="input-group-text" for="TENTACLEABC-XYZ-Input-setting-number-min">Min</label>
                </div>
                <input type="number" step="0.000001" value="ZYXDefaultValue"
                    id="TENTACLEABC-XYZ-Input-setting-number-min"
                    className="form-control optimizer-input-setting"
                    data-tentacle-name="TENTACLEABC"
                    data-input-setting-name="XYZ_min"
                    data-input-setting-base-name="XYZ"
                    data-type="number"
                    aria-label="Small" aria-describedby="XYZInput-setting-number-min" />
            </div>
        </div>
            <div className="col-4">
                <div className="input-group input-group-sm">
                    <div className="input-group-prepend">
                        <label className="input-group-text" for="TENTACLEABC-XYZ-Input-setting-number-max">Max</label>
                    </div>
                    <input type="number" step="0.000001" value="ZYXDefaultValue"
                        id="TENTACLEABC-XYZ-Input-setting-number-max"
                        className="form-control"
                        data-tentacle-name="TENTACLEABC"
                        data-input-setting-name="XYZ_max"
                        data-input-setting-base-name="XYZ"
                        data-type="number"
                        aria-label="Small" aria-describedby="XYZInput-setting-number-max" />
                </div>
            </div>
            <div className="col-4">
                <div className="input-group input-group-sm">
                    <div className="input-group-prepend">
                        <label className="input-group-text" for="TENTACLEABC-XYZ-Input-setting-number-step">Step</label>
                    </div>
                    <input type="number" step="1" value="1" min="0.000000000000000000001"
                        id="TENTACLEABC-XYZ-Input-setting-number-step"
                        className="form-control"
                        data-tentacle-name="TENTACLEABC"
                        data-input-setting-name="XYZ_step"
                        data-input-setting-base-name="XYZ"
                        data-type="number"
                        aria-label="Small" aria-describedby="XYZInput-setting-number-step" />
                </div>
            </div></>
    )
}

function OptimizerRunFilterTemplate() {
    return (
        <div className="mx-4">
            <div className="row border">
                <div className="col-4 p-2">Input name</div>
                <div className="col-1 p-2">Condition</div>
                <div className="col-4 p-2">Other input name</div>
                <div className="col-2 p-2">Value</div>
                <div className="col-1 p-2">Remove</div>
            </div>
            <div className="row border" id="optimizer-filters-root">
            </div>
            <div className="row border d-none" id="optimizer-filters-default-values">
                <OptimizerRunFilter />
            </div>
            <div className="text-right">
                <button className="btn btn-primary waves-effect" id="add-optimizer-filter">
                    Add filter
                </button>
            </div>
        </div>
    )
}

function OptimizerRunFilter() {
    return (
        <div className="row w-100 mx-0 border" id="optimizer-filter-template">
            <div className="col-12 optimizer-filter-entry row p-2">
                <OptimizerRunFilterValues />

            </div>
        </div>
    )
}

function OptimizerRunFilterValues() {
    return (<>
        <div className="col-4 form-group">
            <select className="w-100 form-control"
                data-type="user-input"
                data-role="user_input_left_operand">
                <option value="null"></option>
            </select>
        </div>
        <div className="col-1 form-group">
            <select className="w-100 form-control"
                data-type="operator"
                data-role="operator">
                <option value="lower_than">
                    {"<"}
                </option>
                <option value="lower_or_equal_to">
                    {"<="}
                </option>
                <option value="higher_than">
                    {">"}
                </option>
                <option value="higher_or_equal_to">
                    {">="}
                </option>
                <option value="equal_to">
                    {"="}
                </option>
                <option value="different_from">
                    {"!="}
                </option>
            </select>
        </div>
        <div className="col-4 form-group">
            <select className="w-100 form-control"
                data-type="user-input"
                data-role="user_input_right_operand">
                <option value="null"></option>
            </select>
        </div>
        <div className="col-2 form-group">
            <input type="text"
                className="w-100 form-control"
                data-type="text"
                data-role="text_right_operand" />
        </div>
        <div className="col-1">
            <button type="button"
                className="btn btn-sm btn-outline-danger waves-effect"
                data-action="delete"
            >
                <i className="fas fa-ban"></i>
            </button>
        </div></>
    )
}

function _buildOptimizerSettingsForm(schemaElements, optimizerConfig) {
    const settingsRoot = $("#optimizer-settings-root");
    settingsRoot.empty();
    // reset user inputs custom paths
    window.CUSTOM_PATH_USER_INPUTS = {};

    _buildCustomPathSchema(schemaElements, optimizerConfig)

    schemaElements.data.elements.forEach(function (element) {
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
            if (_buildOptimizerConfigElementSettingForm(inputGroupContent, inputDetail,
                configInputs, tentacleName, inputDetail.title)) {
                atLeastOneUserInput = true;
            }
        });
        if (!atLeastOneUserInput) {
            inputGroupElement.remove();
        }
    })
    $("#optimizer-filters-root").empty();
    _buildOptimizerFilters(optimizerConfig.filters_settings, false, optimizerConfig);
    _updateCounter(optimizerConfig);
    _updateInputSettingsDisplay(settingsRoot);
    settingsRoot.find("input, select").each((i, jsInputSetting) => {
        $(jsInputSetting).on("change", () => _updateCounter(optimizerConfig));
    })
    $("#add-optimizer-filter").click(() => {
        _buildOptimizerFilters(null, true, optimizerConfig);
    })
}
function _getOptimizerFiltersValues(settingsRoot) {
    const filterValues = [];
    settingsRoot.find(".optimizer-filter-entry").each((i, jsfilterEntry) => {
        const filterEntryElement = $(jsfilterEntry);
        filterValues.push({
            user_input_left_operand: _optimizerFilterPart(filterEntryElement, "[data-role='user_input_left_operand']"),
            operator: _optimizerFilterPart(filterEntryElement, "[data-role='operator']"),
            user_input_right_operand: _optimizerFilterPart(filterEntryElement, "[data-role='user_input_right_operand']"),
            text_right_operand: _optimizerFilterPart(filterEntryElement, "[data-role='text_right_operand']"),
        })
    });
    return filterValues;
}

function _optimizerFilterPart(parent, selector) {
    const element = $(parent.find(selector)[0]);
    return {
        role: element.data("role"),
        type: element.data("type"),
        value: element.val()
    }
}

function _buildOptimizerFilters(filtersSettings, blank, optimizerConfig) {
    const optimizerSettings = optimizerConfig.user_inputs;
    const userInputIdentifiers = Object.values(optimizerSettings).map(userInput => {
        return {
            identifier: _optimizeUserInputIdentifier(userInput.tentacle, userInput.user_input),
            text: `${userInput.user_input} [${userInput.tentacle.split(_INPUT_SEPARATOR).join(":")}]`
        }
    });
    const filterGroupContent = $("#optimizer-filters-root");
    if (blank) {
        _buildUserInputFilterEntry(filterGroupContent, null, userInputIdentifiers);
    } else if (typeof filtersSettings !== "undefined") {
        filtersSettings.forEach(filterSetting => {
            _buildUserInputFilterEntry(filterGroupContent, filterSetting, userInputIdentifiers);
        })
    }
}

function _buildUserInputFilterEntry(filterGroupContent, filterSetting, userInputIdentifiers) {
    const newInputFilter = _getInputFilterFromTemplate(userInputIdentifiers, filterSetting);
    filterGroupContent.append(newInputFilter);
}

function _buildUserInputConfigEntry(inputGroupContent, valueType, inputDetail, configValues, tentacleName) {
    const newInputSetting = _getInputSettingFromTemplate(valueType, inputDetail, tentacleName)
    if (newInputSetting !== null) {
        inputGroupContent.append(newInputSetting);
        _updateInputDetailValues(valueType, inputDetail, configValues, tentacleName);
    }
}

function _buildOptimizerConfigElementSettingForm(inputGroupContent, inputDetails, configValues,
    parentInputIdentifier, inputIdentifier) {
    if (inputDetails.options.in_optimizer) {
        const valueType = _getValueType(inputDetails);
        if (valueType === "nested_config") {
            _buildOptimizerNestedConfigSettingsForm(inputGroupContent, inputDetails, configValues,
                `${parentInputIdentifier}${_INPUT_SEPARATOR}${inputIdentifier}`);
        } else {
            _buildUserInputConfigEntry(inputGroupContent, valueType, inputDetails, configValues,
                parentInputIdentifier);
        }
        return true;
    }
    return false;
}
function _buildOptimizerNestedConfigSettingsForm(inputGroupContent, inputDetail, configValues, parentInputIdentifier) {
    let atLeastOneUserInput = false;
    const nestedInputGroupId = _appendNestedInputGroupFromTemplate(inputGroupContent, parentInputIdentifier, inputDetail.title);
    const nestedInputGroupElement = $(document.getElementById(nestedInputGroupId));
    const nestedInputGroupContent = nestedInputGroupElement.find(".input-content");
    Object.keys(inputDetail.properties).forEach(function (nestedInput) {
        const nestedInputDetails = inputDetail.properties[nestedInput];
        if (_buildOptimizerConfigElementSettingForm(nestedInputGroupContent, nestedInputDetails,
            configValues, parentInputIdentifier, nestedInput)) {
            atLeastOneUserInput = true;
        }
    });
    if (!atLeastOneUserInput) {
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
        inputSettings = inputSettings.replace(new RegExp("XYZ", "g"), inputDetail.title);
        inputSettings = inputSettings.replace(new RegExp("ZYXDefaultValue", "g"), inputDetail.default);
        inputSettings = inputSettings.replace(new RegExp("TENTACLEABC", "g"), tentacleName);
        return inputSettings;
    }
    else {
        console.log(`Unhandled value type: "${valueType}": no strategy optimizer template found.`)
        return null;
    }
}

function _getInputFilterFromTemplate(userInputIdentifiers, filterSetting) {
    const filterEntry = $("#optimizer-filter-template").clone();
    filterEntry.removeAttr("id");
    filterEntry.find("select[data-type='user-input'], select[data-type='operator']").each((i, jsElement) => {
        const element = $(jsElement);
        const role = element.data("role");
        if (element.data("type") === "user-input") {
            userInputIdentifiers.forEach(identifier => {
                element.append(new Option(identifier.text, identifier.identifier, false,
                    filterSetting === null ? false : filterSetting[role].value === identifier.identifier));
            })
        } else if (filterSetting !== null) {
            element.val(filterSetting[role].value);
        }
    });
    filterEntry.find("input[data-type='text']").each((i, jsElement) => {
        const element = $(jsElement);
        const role = element.data("role");
        if (filterSetting !== null && typeof filterSetting[role] !== "undefined") {
            element.val(filterSetting[role].value);
        }
    });
    filterEntry.find("button[data-action='delete']").click(() => {
        filterEntry.remove();
    })
    return filterEntry
}

function _getInputSettingTemplate(valueType) {
    return $(`#optimizer-settings-${valueType}-template`);
}

function _getValueType(inputDetail) {
    const schemaValueType = inputDetail.type;
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
    const rawValue = configValues[`${tentacleIdentifier}-${inputDetail.title.replaceAll(" ", "_")}`];
    let configValue = undefined;
    let isEnabled = false;
    if (typeof rawValue !== "undefined") {
        configValue = rawValue.value;
        isEnabled = rawValue.enabled;
    }
    if (valueType === "options" || valueType === "boolean") {
        let values = typeof configValue === "undefined" ? [] : configValue
        const valuesSelect = $(document.getElementById(`${tentacleIdentifier}-${inputDetail.title}-Input-setting-${valueType}`));
        if (valueType === "options") {
            inputDetail.enum.forEach(function (value) {
                const isSelected = values.indexOf(value) !== -1;
                valuesSelect.append(new Option(value, value, false, isSelected));
            })
        } else if (valueType === "boolean") {
            values = values.map((x) => String(x))
            valuesSelect.find("option").each(function (i, jsOption) {
                const option = $(jsOption);
                const isSelected = values.indexOf(option.attr("value")) !== -1;
                option.attr("selected", isSelected);
            })
        }
    } else if (valueType === "number") {
        let values = typeof configValue === "undefined" ? { min: 0, max: 0, step: 1 } : configValue;
        ["min", "max", "step"].forEach(function (suffix) {
            const element = $(document.getElementById(`${tentacleIdentifier}-${inputDetail.title}-Input-setting-number-${suffix}`));
            const value = values[suffix];
            element.val(value);
        })
    }
    $(document.getElementById(`${tentacleIdentifier}-${inputDetail.title}-Input-enabled-value`)).prop("checked", isEnabled);
}

function _updateInputSettingsDisplay(settingsRoot) {
    settingsRoot.find("select[multiple=\"multiple\"]").select2({
        width: 'resolve', // need to override the changed default
        closeOnSelect: false,
        placeholder: "Select values to use"
    });
}

function _updateCounter(optimizerConfig) {
    const userInputs = optimizerConfig.user_inputs;
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
    $("#optimizer-run-counts").text(runsCount);
    $("#backtesting-computations-count").text(runsCount * new Number($("#backtesting-candles-counts").text()));
}

function _optimizeUserInputIdentifier(tentacleValue, inputName) {
    return `${tentacleValue}-${inputName.replaceAll(" ", "_")}`
}
function _modifyStoredSettings(configValues, input_key, stored_settings_path, tentacle_name) {
    const old_name = `${tentacle_name}-${input_key}`
    if (configValues.user_inputs) {
        const saved_input = configValues.user_inputs[old_name]
        if (saved_input) {
            const new_name = `${stored_settings_path}-${input_key}`
            saved_input.tentacle = stored_settings_path
            configValues.user_inputs[new_name] = saved_input
            delete configValues.user_inputs[old_name]
        }
    }
}

function _moveInputToPath(input_key, tentacle_schema, configValues) {
    const path_list = tentacle_schema.schema.properties[input_key].options.custom_path.split(CUSTOM_USER_INPUT_PATH_SEPARATOR)
    let target_obj = tentacle_schema.schema.properties
    path_list.shift()
    let stored_settings_path = "ScriptedTradingMode"
    for (let path in path_list) {
        try {
            target_obj = target_obj[path_list[path]].properties
        } catch (e) {
            target_obj[path_list[path]] = {
                "title": path_list[path], "type": "object",
                "options": { "in_optimizer": true }, "properties": {}
            }
            target_obj = target_obj[path_list[path]]["properties"]
        }
        stored_settings_path = `${stored_settings_path}${_INPUT_SEPARATOR}${path_list[path]}`
    }
    target_obj[input_key] = tentacle_schema.schema.properties[input_key]
    window.CUSTOM_PATH_USER_INPUTS[target_obj[input_key].title] = tentacle_schema.tentacle

    _modifyStoredSettings(configValues, input_key, stored_settings_path, tentacle_schema.tentacle)

    delete tentacle_schema.schema.properties[input_key]
}

function _buildCustomPathSchema(schemaElements, configValues) {
    schemaElements.data.elements.forEach(function (_tentacle) {
        if (_tentacle.is_hidden) { return }
        for (let input_key in _tentacle.schema.properties) {
            if (_tentacle.schema.properties[input_key].options.custom_path) {
                // todo support nested inputs
                _moveInputToPath(input_key, _tentacle, configValues)
            }
        }
    })
}