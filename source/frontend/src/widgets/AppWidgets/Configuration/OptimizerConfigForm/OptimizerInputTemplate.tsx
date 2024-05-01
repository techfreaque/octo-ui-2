import { CSSProperties, Dispatch, SetStateAction } from "react";
import "./OptimizerInputTemplate.css";
import { ColorsType } from "../../../../constants/uiTemplate/defaultColors";
import { Select } from "antd";
import { OptimizerEditorType, SchemaOptionsValueType, SchemaValueType } from "../../../../context/config/OptimizerEditorProvider";

export default function OptimizerSettingsContainer({
  botColors,
  children,
}: {
  children: JSX.Element;
  botColors: ColorsType;
}) {
  const borderStyle = getBorderStyle(botColors);
  return (
    <div className="mx-4">
      <div className="row" style={borderStyle}>
        <div className="col-3 p-2">Input name</div>
        <div className="col-7 p-2">Values</div>
        <div className="col-2 p-2">Enabled</div>
      </div>
      <div className="row" style={borderStyle} id="optimizer-settings-root">
        {children}
      </div>

      {/* <OptimizerSettingTentacleGroupTemplate borderStyle={borderStyle} />
        <OptimizerSettingNestedTentacleConfigTemplate
          borderStyle={borderStyle}
        />
        <OptimizerSettingArrayTemplate borderStyle={borderStyle} />
        <OptimizerSetting borderStyle={borderStyle} valueType={"number"} />
        <OptimizerSetting borderStyle={borderStyle} valueType={"options"} />
        <OptimizerSetting
          borderStyle={borderStyle}
          valueType={"multiple-options"}
        />
        <OptimizerSetting borderStyle={borderStyle} valueType={"boolean"} /> */}
    </div>
  );
}

type ValueType = "number" | "options" | "multiple-options" | "boolean";

function getBorderStyle(botColors: ColorsType): CSSProperties {
  return {
    border: `1px solid ${botColors?.border}`,
  };
}

export function OptimizerSettingTentacleGroup({
  botColors,
  children,
  name,
  title,
}: {
  name: string;
  title: string;
  children: JSX.Element;
  botColors: ColorsType;
}) {
  return (
    <div id="optimizer-settings-tentacle-group-template">
      <div
        id={`optimizer-settings-${name}-tentacle-group-template`}
        className="w-100"
        style={getBorderStyle(botColors)}
      >
        <div className="row">{title}</div>
        <div className="row input-content w-100 mx-0">{children}</div>
      </div>
    </div>
  );
}
export function OptimizerSettingNestedTentacleConfig({
  name,
  title,
  botColors,
  children,
}: {
  name: string;
  title: string;
  children: JSX.Element;
  botColors: ColorsType;
}): JSX.Element {
  return (
    <div id="optimizer-settings-nested-tentacle-config-template">
      <div
        id={`optimizer-settings-${name}-nested-tentacle-config-template`}
        className="w-100 px-4 "
        style={getBorderStyle(botColors)}
      >
        <div className="row">{title}</div>
        <div className="row input-content w-100 mx-0">{children}</div>
      </div>
    </div>
  );
}

function OptimizerSettingContainer({
  botColors,
  name,
  title,
  tentacleName,
  children,
  isEnabled,
}: {
  name: string;
  title: string;
  tentacleName: string;
  isEnabled: boolean;
  botColors: ColorsType;
  children: JSX.Element;
}) {
  return (
    <div
      className="row w-100 mx-0 "
      style={getBorderStyle(botColors)}
      // id={`optimizer-settings-${valueType}-template`}
    >
      <div className="col-3 setting-name p-2" id={`${name}Input-name`}>
        {title}
      </div>
      <div className="col-8 setting-values row p-2" id={`${name}Input-values`}>
        {children}
      </div>
      <div className="col-1 setting-enabled p-2" id={`${name}Input-enabled`}>
        <div className="custom-control custom-switch">
          <input
            type="checkbox"
            className="custom-control-input"
            data-tentacle-name={tentacleName}
            id={`${tentacleName}-${name}-Input-enabled-value`}
            checked={isEnabled}
          />
          <label
            className="custom-control-label text-capitalize"
            htmlFor={`${tentacleName}-${name}-Input-enabled-value`}
            data-toggle="tooltip"
            title="Enabled"
          />
        </div>
      </div>
    </div>
  );
}

export function OptimizerSettingBoolean({
  name,
  title,
  tentacleName,
  value,
  saveOptimizerEditor,
  botColors,
  isEnabled,
}: {
  name: string;
  title: string;
  tentacleName: string;
  value: boolean[];
  botColors: ColorsType;
  saveOptimizerEditor: Dispatch<SetStateAction<OptimizerEditorType | undefined>>
  isEnabled: boolean;
}) {
  return (
    <OptimizerSettingOptions
      title={title}
      valueType={"multiple-options"}
      name={name}
      isEnabled={isEnabled}
      tentacleName={tentacleName}
      value={value}
      botColors={botColors}
      options={[
        { label: "True", value: true },
        { label: "False", value: false },
      ]}
      saveOptimizerEditor={saveOptimizerEditor}
    />
  );
}

function OptimizerSettingArrayTemplate({
  name,
  title,
  botColors,
}: {
  name: string;
  title: string;
  botColors: ColorsType;
}) {
  return (
    <div id="optimizer-settings-object-array-template">
      <div
        id={`optimizer-settings-${name}-object-array-template`}
        className="w-100 px-4"
        style={getBorderStyle(botColors)}
      >
        <div className="row">{title}</div>
        <div className="row input-content w-100 mx-0" />
      </div>
    </div>
  );
}

export function OptimizerSettingOptions({
  title,
  name,
  tentacleName,
  value,
  options,
  botColors,
  saveOptimizerEditor,
  valueType,
  isEnabled,
}: {
  title: string;
  name: string;
  tentacleName: string;
  value: string[] | boolean[] | number[];
  options: { label: string; value: string | boolean | number }[];
  botColors: ColorsType;
  saveOptimizerEditor: Dispatch<SetStateAction<OptimizerEditorType | undefined>>
  valueType: SchemaOptionsValueType;
  isEnabled: boolean;
}) {
  return (
    <OptimizerSettingContainer
      botColors={botColors}
      name={name}
      title={title}
      tentacleName={tentacleName}
      isEnabled={isEnabled}
    >
      <div className="col">
        <label
          className="text-capitalize"
          htmlFor={`${tentacleName}-${name}-Input-setting`}
        />
        <Select
          id={`${tentacleName}-${name}-Input-setting`}
          // className="optimizer-input-setting"
          mode="multiple"
          allowClear
          style={{ width: "99%" }}
          placeholder="Select values to use"
          // onChange={saveOptimizerEditor}
          options={options}
          value={value}
        />
      </div>
    </OptimizerSettingContainer>
  );
}

export function OptimizerNotHandledValueType({
  title,
  name,
  tentacleName,
  botColors,
  valueType,
}: {
  name: string;
  title: string;
  botColors: ColorsType;
  tentacleName: string;
  valueType: SchemaValueType;
}): JSX.Element {
  return (
    <OptimizerSettingContainer
      botColors={botColors}
      name={name}
      title={title}
      tentacleName={tentacleName}
      isEnabled={false}
    >
      <div>
        <h2>{valueType} not handled yet</h2>
      </div>
    </OptimizerSettingContainer>
  );
}

export function OptimizerSettingNumber({
  title,
  name,
  tentacleName,
  botColors,
  currentMinValue,
  currentMaxValue,
  currentStepValue,
  isEnabled,
  saveOptimizerEditor,
}: {
  name: string;
  title: string;
  botColors: ColorsType;
  tentacleName: string;
  currentMinValue: number;
  currentMaxValue: number;
  currentStepValue: number;
  isEnabled: boolean;
  saveOptimizerEditor: Dispatch<SetStateAction<OptimizerEditorType | undefined>>
}) {
  return (
    <OptimizerSettingContainer
      botColors={botColors}
      name={name}
      title={title}
      tentacleName={tentacleName}
      isEnabled={isEnabled}
    >
      <>
        <div className="col-4">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <label
                className="input-group-text"
                htmlFor={`${tentacleName}-${name}-Input-setting-number-min`}
              >
                Min
              </label>
            </div>
            <input
              type="number"
              step="0.000001"
              id={`${tentacleName}-${name}-Input-setting-number-min`}
              className="form-control optimizer-input-setting"
              data-tentacle-name={tentacleName}
              data-input-setting-name={`${name}_min`}
              data-input-setting-base-name={name}
              data-type="number"
              aria-label="Small"
              aria-describedby={`${name}Input-setting-number-min`}
              value={currentMinValue}
            />
          </div>
        </div>
        <div className="col-4">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <label
                className="input-group-text"
                htmlFor={`${tentacleName}-${name}-Input-setting-number-max`}
              >
                Max
              </label>
            </div>
            <input
              type="number"
              step="0.000001"
              id={`${tentacleName}-${name}-Input-setting-number-max`}
              className="form-control"
              data-tentacle-name={tentacleName}
              data-input-setting-name={`${name}_max`}
              data-input-setting-base-name={name}
              data-type="number"
              aria-label="Small"
              aria-describedby={`${name}Input-setting-number-max`}
              value={currentMaxValue}
            />
          </div>
        </div>
        <div className="col-4">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <label
                className="input-group-text"
                htmlFor={`${tentacleName}-${name}-Input-setting-number-step`}
              >
                Step
              </label>
            </div>
            <input
              type="number"
              step="1"
              defaultValue="1"
              min="0.000000000000000000001"
              id={`${tentacleName}-${name}-Input-setting-number-step`}
              className="form-control"
              data-tentacle-name={tentacleName}
              data-input-setting-name={`${name}_step`}
              data-input-setting-base-name={name}
              data-type="number"
              aria-label="Small"
              aria-describedby={`${name}Input-setting-number-step`}
              value={currentStepValue}
            />
          </div>
        </div>
      </>
    </OptimizerSettingContainer>
  );
}
