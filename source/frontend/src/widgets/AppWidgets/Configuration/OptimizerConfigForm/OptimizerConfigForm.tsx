import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import {
  OPTIMIZER_INPUTS_KEY,
  _INPUT_SEPARATOR,
} from "../../../../constants/backendConstants";
import {
  OptimizerEditorInputArrayType,
  OptimizerEditorInputNumberType,
  OptimizerEditorInputType,
  OptimizerEditorInputsType,
  SchemaValueType,
  useFetchProConfig,
  useSaveOptimizerForm,
  useOptimizerEditorContext,
  useUpdateOptimizerEditorContext,
  OptimizerEditorType,
} from "../../../../context/config/OptimizerEditorProvider";
import {
  SchemaValueRawType,
  TentaclesConfigsRootType,
  TentaclesConfigsSchemaType,
  tentacleConfigTypes,
  useTentaclesConfigContext,
} from "../../../../context/config/TentaclesConfigProvider";
import { useBotInfoContext } from "../../../../context/data/BotInfoProvider";
import { Alert, Typography } from "antd";
import { projectProName } from "../../../../constants/frontendConstants";
import OptimizerSettingsContainer, {
  OptimizerNotHandledValueType,
  OptimizerSettingBoolean,
  OptimizerSettingNestedTentacleConfig,
  OptimizerSettingNumber,
  OptimizerSettingOptions,
  OptimizerSettingTentacleGroup,
} from "./OptimizerInputTemplate";
import { useBotColorsContext } from "../../../../context/config/BotColorsProvider";
import { ColorsType } from "../../../../constants/uiTemplate/defaultColors";

export default function OptimizerConfigForm() {
  const optimizerEditor = useOptimizerEditorContext();
  const saveOptimizerEditor = useUpdateOptimizerEditorContext();
  const botColors = useBotColorsContext();
  const optimizerConfig: OptimizerEditorInputsType | undefined =
    optimizerEditor?.[OPTIMIZER_INPUTS_KEY];
  const formIsBuilt = Boolean(optimizerConfig);
  const currentTentaclesConfig = useTentaclesConfigContext();
  const currentTentaclesTradingConfig =
    currentTentaclesConfig?.[tentacleConfigTypes.tradingTentacles];
  const saveOptimizerForm = useSaveOptimizerForm();
  const fetchProConfig = useFetchProConfig();
  const botInfo = useBotInfoContext();
  const uiProInstalled = botInfo?.ui_pro_installed;
  useEffect(() => {
    if (uiProInstalled) {
      fetchProConfig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiProInstalled]);
  return useMemo(() => {
    return (
      <>
        <OptimizerNotInstalled />
        <div onBlur={saveOptimizerForm}>
          {/* <div>
                <AntButton buttonType={
                        buttonTypes.primary
                    }
                    onClick={saveOptimizerForm}
                    text="Save Optimizer Form"/>
            </div> */}
          <div id="strategy-optimizer-inputs">
            <OptimizerSettingsContainer botColors={botColors}>
              {optimizerConfig && currentTentaclesTradingConfig ? (
                <OptimizerSettingsForm
                  botColors={botColors}
                  saveOptimizerEditor={saveOptimizerEditor}
                  currentTentaclesTradingConfig={currentTentaclesTradingConfig}
                  optimizerConfig={optimizerConfig}
                />
              ) : (
                <div>
                  <h2>Config is loading...</h2>
                </div>
              )}
            </OptimizerSettingsContainer>
          </div>
          {/* <div id="strategy-optimizer-filters" className="my-4 mx-2 pb-4">
                    <h4>
                        Run filters
                    </h4>
                    <p>
                        If a run validates any of these statements, it will be discarded.
                    </p>
                    <OptimizerRunFilterTemplate />
                </div> */}
        </div>
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTentaclesConfig, formIsBuilt]);
}

export function OptimizerNotInstalled() {
  const botInfo = useBotInfoContext();
  const uiProInstalled = botInfo?.ui_pro_installed;
  return uiProInstalled ? (
    <></>
  ) : (
    <Alert
      style={{ margin: "10px" }}
      showIcon
      type="warning"
      message={
        <Typography.Title level={3}>
          {`Seems like you haven't installed ${projectProName}`}
        </Typography.Title>
      }
      description={`${projectProName} is required to use the Optimizer`}
    />
  );
}

function OptimizerSettingsForm({
  currentTentaclesTradingConfig,
  optimizerConfig,
  botColors,
  saveOptimizerEditor,
}: {
  currentTentaclesTradingConfig: TentaclesConfigsRootType;
  optimizerConfig: OptimizerEditorInputsType;
  botColors: ColorsType;
  saveOptimizerEditor: Dispatch<
    SetStateAction<OptimizerEditorType | undefined>
  >;
}): JSX.Element {
  return (
    <>
      {" "}
      {Object.values(currentTentaclesTradingConfig).map((element) => {
        if (element.is_hidden) {
          return <></>;
        }
        let atLeastOneUserInput = false;
        const tentacleName = element.tentacle;

        const configInputs: OptimizerEditorInputType =
          typeof optimizerConfig?.user_inputs === "undefined"
            ? {}
            : optimizerConfig?.user_inputs;
        const groupInputs =
          element.schema?.properties &&
          Object.values(element.schema.properties).map((inputDetail) => {
            const value = getOptimizerConfigElementSettingForm({
              botColors,
              saveOptimizerEditor,
              inputDetails: inputDetail,
              configValues: configInputs,
              parentInputIdentifier: tentacleName,
              inputIdentifier: inputDetail?.options?.name || "no input name",
            });
            if (value) {
              atLeastOneUserInput = true;
            }
            return value || <></>;
          });
        if (atLeastOneUserInput && groupInputs) {
          return (
            <OptimizerSettingTentacleGroup
              botColors={botColors}
              name={tentacleName}
              title={tentacleName}
            >
              <>{groupInputs}</>
            </OptimizerSettingTentacleGroup>
          );
        }
        return <></>;
      })}
    </>
  );
}

// function _getOptimizerFiltersValues(
//   settingsRoot: HTMLElement
// ): OptimizerFiltersValuesType[] {
//   const filterValues: OptimizerFiltersValuesType[] = [];
//   Array.from(
//     settingsRoot.getElementsByClassName(
//       "optimizer-filter-entry"
//     ) as HTMLCollectionOf<HTMLElement>
//   ).forEach((filterEntryElement) => {
//     filterValues.push({
//       user_input_left_operand: _optimizerFilterPart(
//         filterEntryElement,
//         "[data-role='user_input_left_operand']"
//       ),
//       operator: _optimizerFilterPart(
//         filterEntryElement,
//         "[data-role='operator']"
//       ),
//       user_input_right_operand: _optimizerFilterPart(
//         filterEntryElement,
//         "[data-role='user_input_right_operand']"
//       ),
//       text_right_operand: _optimizerFilterPart(
//         filterEntryElement,
//         "[data-role='text_right_operand']"
//       ),
//     });
//   });
//   return filterValues;
// }

// function _optimizerFilterPart(
//   parent: HTMLElement,
//   selector: string
// ): OptimizerFilterPartType {
//   const element = (parent.querySelectorAll(selector) as NodeListOf<
//     HTMLInputElement
//   >)[0];
//   return {
//     role: element.dataset.role as string,
//     type: element.dataset.type as string,
//     value: element.value as string,
//   };
// }

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

function UserInputConfigEntry({
  valueType,
  inputDetail,
  configValues,
  tentacleName,
  botColors,
  saveOptimizerEditor,
}: {
  valueType: SchemaValueType;
  inputDetail: TentaclesConfigsSchemaType;
  configValues: OptimizerEditorInputType;
  tentacleName: string;
  botColors: ColorsType;
  saveOptimizerEditor: Dispatch<
    SetStateAction<OptimizerEditorType | undefined>
  >;
}): JSX.Element {
  const inputName = inputDetail.options?.name || inputDetail.title;
  const currentSettingsState =
    configValues[_optimizeUserInputIdentifier(tentacleName, inputName)];
  if (valueType === "number") {
    return (
      <OptimizerSettingNumber
        name={inputName}
        title={inputDetail.title}
        tentacleName={tentacleName}
        botColors={botColors}
        saveOptimizerEditor={saveOptimizerEditor}
        currentMinValue={
          (currentSettingsState?.value as OptimizerEditorInputNumberType).min ||
          (inputDetail.default as number)
        }
        currentMaxValue={
          (currentSettingsState?.value as OptimizerEditorInputNumberType).max ||
          (inputDetail.default as number)
        }
        currentStepValue={
          (currentSettingsState?.value as OptimizerEditorInputNumberType)
            .step || 1
        }
        isEnabled={currentSettingsState?.enabled || false}
      />
    );
  } else if (valueType === "multiple-options") {
    return (
      <OptimizerSettingOptions
        name={inputName}
        title={inputDetail.title}
        tentacleName={tentacleName}
        botColors={botColors}
        options={
          inputDetail.items?.enum?.map((value) => ({
            label: `${value}`,
            value,
          })) || []
        }
        valueType={valueType}
        saveOptimizerEditor={saveOptimizerEditor}
        value={
          (currentSettingsState?.value as
            | undefined
            | OptimizerEditorInputArrayType) || []
        }
        isEnabled={currentSettingsState?.enabled || false}
      />
    );
  } else if (valueType === "options" && inputDetail?.enum) {
    return (
      <OptimizerSettingOptions
        name={inputName}
        title={inputDetail.title}
        tentacleName={tentacleName}
        botColors={botColors}
        options={
          inputDetail.enum?.map((value) => ({
            label: `${value}`,
            value,
          })) || []
        }
        valueType={valueType}
        saveOptimizerEditor={saveOptimizerEditor}
        value={
          (currentSettingsState?.value as
            | undefined
            | OptimizerEditorInputArrayType) || []
        }
        isEnabled={currentSettingsState?.enabled || false}
      />
    );
  } else if (valueType === "boolean") {
    return (
      <OptimizerSettingBoolean
        name={inputName}
        title={inputDetail.title}
        tentacleName={tentacleName}
        botColors={botColors}
        saveOptimizerEditor={saveOptimizerEditor}
        value={(currentSettingsState?.value as undefined | boolean[]) || []}
        isEnabled={currentSettingsState?.enabled || false}
      />
    );
  }
  return (
    <OptimizerNotHandledValueType
      name={inputName}
      title={inputDetail.title}
      valueType={valueType}
      tentacleName={tentacleName}
      botColors={botColors}
    />
  );
}

function getOptimizerConfigElementSettingForm({
  inputDetails,
  configValues,
  parentInputIdentifier,
  inputIdentifier,
  botColors,
  saveOptimizerEditor,
}: {
  inputDetails: TentaclesConfigsSchemaType;
  configValues: OptimizerEditorInputType;
  parentInputIdentifier: string;
  inputIdentifier: string;
  botColors: ColorsType;
  saveOptimizerEditor: Dispatch<
    SetStateAction<OptimizerEditorType | undefined>
  >;
}): JSX.Element | undefined {
  if (inputDetails.options?.in_optimizer) {
    const valueType = _getValueType(inputDetails.type);
    if (valueType === "nested_config") {
      return getOptimizerNestedConfigSettingsForm({
        inputDetail: inputDetails,
        configValues,
        botColors,
        saveOptimizerEditor,
        parentInputIdentifier: `${parentInputIdentifier}${_INPUT_SEPARATOR}${inputIdentifier}`,
      });
    }
    return (
      <UserInputConfigEntry
        valueType={valueType}
        inputDetail={inputDetails}
        configValues={configValues}
        botColors={botColors}
        tentacleName={parentInputIdentifier}
        saveOptimizerEditor={saveOptimizerEditor}
      />
    );
  }
  return undefined;
}
function getOptimizerNestedConfigSettingsForm({
  inputDetail,
  configValues,
  parentInputIdentifier,
  botColors,
  saveOptimizerEditor,
}: {
  inputDetail: TentaclesConfigsSchemaType;
  configValues: OptimizerEditorInputType;
  parentInputIdentifier: string;
  botColors: ColorsType;
  saveOptimizerEditor: Dispatch<
    SetStateAction<OptimizerEditorType | undefined>
  >;
}): JSX.Element | undefined {
  let atLeastOneUserInput = false;
  const inputs =
    inputDetail.properties &&
    Object.entries(inputDetail.properties).forEach(
      ([nestedInput, nestedInputDetails]) => {
        const element = getOptimizerConfigElementSettingForm({
          inputDetails: nestedInputDetails,
          configValues,
          parentInputIdentifier,
          inputIdentifier: nestedInput,
          botColors,
          saveOptimizerEditor,
        });
        if (element) {
          atLeastOneUserInput = true;
        }
        return element || <></>;
      }
    );
  if (atLeastOneUserInput) {
    return (
      <OptimizerSettingNestedTentacleConfig
        botColors={botColors}
        name={parentInputIdentifier}
        title={
          inputDetail.title || inputDetail.options?.name || "no input name"
        }
      >
        <>{inputs}</>
      </OptimizerSettingNestedTentacleConfig>
    );
  }
  return <></>;
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

function _getValueType(schemaValueType: SchemaValueRawType): SchemaValueType {
  if (schemaValueType === "string") {
    return "options";
  } else if (schemaValueType === "array") {
    return "multiple-options";
  } else if (schemaValueType === "object") {
    return "nested_config";
  }
  return schemaValueType;
}

function _optimizeUserInputIdentifier(
  tentacleValue: string,
  inputName: string
): string {
  return `${tentacleValue}-${inputName.replaceAll(" ", "_")}`;
}
