import "./OptimizerInputTemplate.css";

import { InputNumber, Select, Switch } from "antd";
import { t } from "i18next";
import { CSSProperties, useMemo } from "react";
import { Trans } from "react-i18next";

import { ColorsType } from "../../../../constants/uiTemplate/defaultColors";
import {
  OptimizerEditorInputArrayType,
  OptimizerEditorInputNumberType,
  SchemaOptionsValueType,
  SchemaValueType,
} from "../../../../context/config/OptimizerEditorProvider";
import { HandleOptimizerSettingsUpdateType } from "./OptimizerConfigForm";

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
        <div className="col-3 p-2">
          <Trans i18nKey="optimizer.runConfig.input-name" />
        </div>
        <div className="col-7 p-2">
          <Trans i18nKey="optimizer.runConfig.values" />
        </div>
        <div className="col-2 p-2">
          <Trans i18nKey="optimizer.runConfig.enabled" />
        </div>
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
  valueType,
  value,
  handleSettingsChange,
}: {
  name: string;
  title: string;
  tentacleName: string;
  isEnabled: boolean;
  botColors: ColorsType;
  valueType: SchemaValueType;
  value: OptimizerEditorInputArrayType | OptimizerEditorInputNumberType;
  children: JSX.Element;
  handleSettingsChange: HandleOptimizerSettingsUpdateType;
}) {
  return (
    <div className="row w-100 mx-0 " style={getBorderStyle(botColors)}>
      <div className="col-3 setting-name p-2" id={`${name}Input-name`}>
        {title}
      </div>
      <div className="col-8 setting-values row p-2" id={`${name}Input-values`}>
        {children}
      </div>
      <div className="col-1 setting-enabled p-2" id={`${name}Input-enabled`}>
        <div className="custom-control custom-switch">
          <Switch
            value={isEnabled}
            onChange={(enabled) =>
              handleSettingsChange(
                enabled,
                tentacleName,
                valueType,
                name,
                value
              )
            }
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
  handleSettingsChange,
  botColors,
  isEnabled,
}: {
  name: string;
  title: string;
  tentacleName: string;
  value: boolean[];
  botColors: ColorsType;
  handleSettingsChange: HandleOptimizerSettingsUpdateType;
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
        { label: t("optimizer.runConfig.true"), value: true },
        { label: t("optimizer.runConfig.false"), value: false },
      ]}
      handleSettingsChange={handleSettingsChange}
    />
  );
}

export function OptimizerSettingOptions({
  title,
  name,
  tentacleName,
  value,
  options,
  botColors,
  handleSettingsChange,
  valueType,
  isEnabled,
}: {
  title: string;
  name: string;
  tentacleName: string;
  value: string[] | boolean[] | number[];
  options: { label: string; value: string | boolean | number }[];
  botColors: ColorsType;
  handleSettingsChange: HandleOptimizerSettingsUpdateType;
  valueType: SchemaOptionsValueType;
  isEnabled: boolean;
}) {
  return useMemo(() => {
    function onChange(_value: string[] | boolean[] | number[]) {
      handleSettingsChange(isEnabled, tentacleName, valueType, name, _value);
    }
    return (
      <OptimizerSettingContainer
        botColors={botColors}
        name={name}
        title={title}
        tentacleName={tentacleName}
        isEnabled={isEnabled}
        valueType={valueType}
        value={value}
        handleSettingsChange={handleSettingsChange}
      >
        <div className="col">
          <label
            className="text-capitalize"
            htmlFor={`${tentacleName}-${name}-Input-setting`}
          />
          <Select
            id={`${tentacleName}-${name}-Input-setting`}
            mode="multiple"
            allowClear
            style={{ width: "99%" }}
            placeholder={t("optimizer.runConfig.select-values-to-use")}
            onChange={(value) => onChange(value)}
            options={options}
            value={value}
          />
        </div>
      </OptimizerSettingContainer>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    botColors,
    isEnabled,
    name,
    options,
    tentacleName,
    title,
    value,
    valueType,
  ]);
}

export function OptimizerNotHandledValueType({
  title,
  name,
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
    <div className="row w-100 mx-0 " style={getBorderStyle(botColors)}>
      <div className="col-3 setting-name p-2" id={`${name}Input-name`}>
        {title}
      </div>
      <div className="col-8 setting-values row p-2" id={`${name}Input-values`}>
        <h2>
          {t("optimizer.runConfig.valuetype-not-handled-yet", { valueType })}
        </h2>
      </div>
    </div>
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
  handleSettingsChange,
}: {
  name: string;
  title: string;
  botColors: ColorsType;
  tentacleName: string;
  currentMinValue: number;
  currentMaxValue: number;
  currentStepValue: number;
  isEnabled: boolean;
  handleSettingsChange: HandleOptimizerSettingsUpdateType;
}) {
  return useMemo(() => {
    const value = {
      min: currentMinValue,
      max: currentMaxValue,
      step: currentStepValue,
    };
    function onChange(_value: number, valueName: "min" | "max" | "step") {
      handleSettingsChange(isEnabled, tentacleName, "number", name, {
        ...value,
        [valueName]: _value,
      });
    }
    return (
      <OptimizerSettingContainer
        botColors={botColors}
        name={name}
        title={title}
        valueType="number"
        tentacleName={tentacleName}
        value={value}
        isEnabled={isEnabled}
        handleSettingsChange={handleSettingsChange}
      >
        <>
          <div className="col-4">
            <div className="input-group input-group-sm">
              <InputNumber
                style={{ width: "100%" }}
                prefix={t("optimizer.runConfig.min")}
                min={0.000000000000000000001}
                value={currentMinValue}
                onChange={(value) => value && onChange(value, "min")}
              />
            </div>
          </div>
          <div className="col-4">
            <div className="input-group input-group-sm">
              <InputNumber
                prefix={t("optimizer.runConfig.max")}
                style={{ width: "100%" }}
                min={0.000000000000000000001}
                value={currentMaxValue}
                onChange={(value) => value && onChange(value, "max")}
              />
            </div>
          </div>
          <div className="col-4">
            <div className="input-group input-group-sm">
              <InputNumber
                style={{ width: "100%" }}
                prefix={t("optimizer.runConfig.step")}
                min={0.000000000000000000001}
                value={currentStepValue}
                onChange={(value) => value && onChange(value, "step")}
              />
            </div>
          </div>
        </>
      </OptimizerSettingContainer>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    botColors,
    currentMaxValue,
    currentMinValue,
    currentStepValue,
    isEnabled,
    name,
    tentacleName,
    title,
  ]);
}
