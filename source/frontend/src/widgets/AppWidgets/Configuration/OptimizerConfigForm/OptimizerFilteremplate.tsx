import { Trans } from "react-i18next";

import { useBotColorsContext } from "../../../../context/config/BotColorsProvider";

export default function OptimizerRunFilterTemplate() {
  const botColors = useBotColorsContext();
  const borderStyle = {
    border: `1px solid ${botColors?.border}`,
  };
  return (
    <div className="mx-4">
      <div className="row" style={borderStyle}>
        <div className="col-4 p-2"><Trans i18nKey="optimizer.runConfig.runFilter.input-name" /></div>
        <div className="col-1 p-2"><Trans i18nKey="optimizer.runConfig.runFilter.condition" /></div>
        <div className="col-4 p-2"><Trans i18nKey="optimizer.runConfig.runFilter.other-input-name" /></div>
        <div className="col-2 p-2"><Trans i18nKey="optimizer.runConfig.runFilter.value" /></div>
        <div className="col-1 p-2"><Trans i18nKey="optimizer.runConfig.runFilter.remove" /></div>
      </div>
      <div className="row" style={borderStyle} id="optimizer-filters-root" />
      <div
        className="row d-none"
        style={borderStyle}
        id="optimizer-filters-default-values"
      >
        <OptimizerRunFilter />
      </div>
      <div className="text-right">
        <button
          className="btn btn-primary waves-effect"
          id="add-optimizer-filter"
        >
          <Trans i18nKey="optimizer.runConfig.runFilter.add-filter" />
        </button>
      </div>
    </div>
  );
}

function OptimizerRunFilter() {
  const botColors = useBotColorsContext();
  const borderStyle = {
    border: `1px solid ${  botColors?.border}`,
  };
  return (
    <div
      className="row w-100 mx-0"
      style={borderStyle}
      id="optimizer-filter-template"
    >
      <div className="col-12 optimizer-filter-entry row p-2">
        <OptimizerRunFilterValues />
      </div>
    </div>
  );
}

function OptimizerRunFilterValues() {
  return (
    <>
      <div className="col-4 form-group">
        <select
          className="w-100 form-control"
          data-type="user-input"
          data-role="user_input_left_operand"
        >
          <option value="null" />
        </select>
      </div>
      <div className="col-1 form-group">
        <select
          className="w-100 form-control"
          data-type="operator"
          data-role="operator"
        >
          <option value="lower_than"> {"<"} </option>
          <option value="lower_or_equal_to"> {"<="} </option>
          <option value="higher_than"> {">"} </option>
          <option value="higher_or_equal_to"> {">="} </option>
          <option value="equal_to"> {"="} </option>
          <option value="different_from"> {"!="} </option>
        </select>
      </div>
      <div className="col-4 form-group">
        <select
          className="w-100 form-control"
          data-type="user-input"
          data-role="user_input_right_operand"
        >
          <option value="null" />
        </select>
      </div>
      <div className="col-2 form-group">
        <input
          type="text"
          className="w-100 form-control"
          data-type="text"
          data-role="text_right_operand"
        />
      </div>
      <div className="col-1">
        <button
          type="button"
          className="btn btn-sm btn-outline-danger waves-effect"
          data-action="delete"
        >
          <i className="fas fa-ban" />
        </button>
      </div>
    </>
  );
}
