export default function OptimizerSettingTemplate() {
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
                <OptimizerSettingArrayTemplate />
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
        <div className="row w-100 mx-0 border" id={`optimizer-settings-${valueType}-template`}>
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
                        htmlFor="TENTACLEABC-XYZ-Input-enabled-value"
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
            <label className="text-capitalize" htmlFor="TENTACLEABC-XYZ-Input-setting-boolean"></label>
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

function OptimizerSettingArrayTemplate() {
    return (
        <div id="optimizer-settings-object-array-template">
            <div id="optimizer-settings-XYZ-object-array-template" className="w-100 px-4 border">
                <div className="row">
                    XYZT
                </div>
                <div className="row input-content w-100 mx-0">
                </div>
            </div>
        </div>)
}

function OptimizerSettingOptions() {
    return (
        <div className="col">
            <label className="text-capitalize" htmlFor="TENTACLEABC-XYZ-Input-setting-options"></label>
            <select id="TENTACLEABC-XYZ-Input-setting-options"
                className="optimizer-input-setting"
                data-tentacle-name="TENTACLEABC"
                data-input-setting-name="XYZ"
                data-input-setting-base-name="XYZ"
                data-type="string"
                data-tags="false"
                multiple="multiple"
                style={{ width: "99%" }}
            >
            </select>
        </div>
    )
}
function OptimizerSettingNumber() {
    return (
        <><div className="col-4">
            <div className="input-group input-group-sm">
                <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="TENTACLEABC-XYZ-Input-setting-number-min">Min</label>
                </div>
                <input type="number" step="0.000001" defaultValue="ZYXDefaultValue"
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
                        <label className="input-group-text" htmlFor="TENTACLEABC-XYZ-Input-setting-number-max">Max</label>
                    </div>
                    <input type="number" step="0.000001" defaultValue="ZYXDefaultValue"
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
                        <label className="input-group-text" htmlFor="TENTACLEABC-XYZ-Input-setting-number-step">Step</label>
                    </div>
                    <input type="number" step="1" defaultValue="1" min="0.000000000000000000001"
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