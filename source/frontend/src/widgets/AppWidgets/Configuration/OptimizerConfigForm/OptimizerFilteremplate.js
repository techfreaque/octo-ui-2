export default function OptimizerRunFilterTemplate() {
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