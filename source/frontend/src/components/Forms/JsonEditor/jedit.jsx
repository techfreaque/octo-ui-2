import React, {useCallback, useMemo} from "react";
import {useEffect} from "react";
import "./JsonEditor.css"
import {JSONEditor} from "@json-editor/json-editor"
import PropTypes from "prop-types";


export default function JsonEditor(props) {
    const storageName = props.storageName ? `$${
        props.storageName
    }` : "$JsonEditors"
    const HtmlEditorId = `json-editor-${storageName}-${
        props.editorName
    }`;
    const handleOnChange = useCallback(() => {
        function onChange() {
            if (window[storageName]?.[props.editorName]){   
                if (window[storageName][props.editorName]?.didRunOnce) {
                    props.onChange?.()
                } else {
                    window[storageName][props.editorName].didRunOnce = true
                }
            }
        }
        window[storageName][props.editorName].on('change', onChange);
    }, [props.onChange, storageName, props.editorName])
    function createEditor(props) {
        if (!window[storageName]) {
            window[storageName] = {}
        }
        let editor = window[storageName][props.editorName]
        editor instanceof JSONEditor && editor.destroy();
        const editorElement = document.getElementById(HtmlEditorId)
        editorElement.innerHTML = ""
        if (props.templateCallbacks) {
            JSONEditor.defaults.callbacks.template = {
                ...JSONEditor.defaults.callbacks.template,
                ...props.templateCallbacks
            }
        }
        if (props.customThemes) {
            props.customThemes.forEach(theme => {
                JSONEditor.defaults.themes[theme.name] = theme.theme;
            })
        }
        if (props.editorsArray) {
            JSONEditor.defaults.editors.array = props.editorsArray;
        }
        if (props.language) {
            JSONEditor.defaults.language = props.language;
        }
        if (props.languages) {
            JSONEditor.defaults.languages = {
                ...JSONEditor.defaults.languages,
                ...props.languages
            };
        }
        editor = new JSONEditor(editorElement, {
            ...props,
            // remove custom props
            onChange: undefined,
            templateCallbacks: undefined,
            customThemes: undefined,
            editorsArray: undefined
        })
        window[storageName][props.editorName] = editor
        handleOnChange()
    }
    useEffect(() => {
        if (props.schema) {
            if (window[storageName]?.[props.editorName] && JSON.stringify(window[storageName][props.editorName].schema) === JSON.stringify(props.schema)) {
                const editorElement = document.getElementById(HtmlEditorId)
                if (editorElement?.children?.length) {
                    window[storageName][props.editorName].didRunOnce = false
                    window[storageName][props.editorName].setValue(props.startval)
                } else {
                    createEditor(props);
                }
            } else {
                createEditor(props);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);
    return useMemo(() => (
        <div style={
                props.style
            }
            className="json-editor"
            id={HtmlEditorId}/>
    ), [HtmlEditorId, props.style])
}

JsonEditor.propTypes = {
    // A unique name id that will be used as an id for the parent div (dont use spaces)
    editorName: PropTypes.string.isRequired,

    // A name of the storge variable on window
    storageName: PropTypes.string,

    // Allows you to change the language  default: "en"
    language: PropTypes.string,

    // provide translated key values
    languages: PropTypes.object,

    // If true, JSON Editor will load external URLs in $ref via ajax. 	false
    ajax: PropTypes.bool,

    // Allows schema references to work either with or without cors; set to protocol://host:port when api is served by different host.
    ajaxBase: PropTypes.string,

    // If true, JSON Editor will make ajax call with [credentials](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials). 	false
    ajaxCredentials: PropTypes.bool,

    // If true, JSON Editor will cache external URLs' schemas in localStorage to avoid subsequent ajax calls. 	false
    ajax_cache_responses: PropTypes.bool,

    // If ajax_cache_responses is enabled, use this string to invalidate stale caches. E.g., this value should be changed when schemas are updated. 	Current date in simplied ISO-8601 format (e.g., "2011-10-05" for October 5, 2011).
    ajax_cache_buster: PropTypes.string,

    // If true, the label will not be displayed/added. 	false
    compact: PropTypes.bool,

    // If true, remove all "add row" buttons from arrays. 	false
    disable_array_add: PropTypes.bool,

    // If true, remove all "delete row" buttons from arrays. 	false
    disable_array_delete: PropTypes.bool,

    // If true, remove all "delete all rows" buttons from arrays. 	false
    disable_array_delete_all_rows: PropTypes.bool,

    // If true, remove all "delete last row" buttons from arrays. 	false
    disable_array_delete_last_row: PropTypes.bool,

    // If true, remove all "move up" and "move down" buttons from arrays. 	false
    disable_array_reorder: PropTypes.bool,

    // If true, add copy buttons to arrays. 	false
    enable_array_copy: PropTypes.bool,

    // If true, remove all collapse buttons from objects and arrays. 	false
    disable_collapse: PropTypes.bool,

    // If true, remove all Edit JSON buttons from objects. 	false
    disable_edit_json: PropTypes.bool,

    // If true, remove all Edit Properties buttons from objects. 	false
    disable_properties: PropTypes.bool,

    // If true, array controls (add, delete etc) will be displayed at top of list. 	false
    array_controls_top: PropTypes.bool,

    // The first part of the `name` attribute of form inputs in the editor. An full example name is `root[person][name]` where "root" is the form_name_root. 	root
    form_name_root: PropTypes.string,

    // The icon library to use for the editor. See the CSS Integration section below for more info. 	null
    iconlib: PropTypes.oneOf(
        [
            "jqueryui",
            "fontawesome3",
            "fontawesome4",
            "fontawesome5",
            "openiconic",
            "spectre"
        ]
    ),

    // Display only icons in buttons. This works only if iconlib is set. 	false
    remove_button_labels: PropTypes.bool,

    // If true, objects can only contain properties defined with the properties keyword unless the property additionalProperties: true is specified in the object schema 	false
    no_additional_properties: PropTypes.bool,

    // An object containing schema definitions for URLs. Allows you to pre-define external schemas. 	{}
    refs: PropTypes.object,

    // If true, all schemas that don't explicitly set the required property will be required. 	false
    required_by_default: PropTypes.bool,

    // If true, makes oneOf copy properties over when switching. 	true
    keep_oneof_values: PropTypes.bool,

    // A valid JSON Schema to use for the editor. Version 3 and Version 4 of the draft specification are supported. 	{}
    schema: PropTypes.object.isRequired,

    // When to show validation errors in the UI. Valid values are interaction, change, always, and never. 	"interaction"
    show_errors: PropTypes.oneOf(
        ["interaction", "change", "always", "never"]
    ),

    // Seed the editor with an initial value. This should be valid against the editor's schema. 	null
    startval: PropTypes.object,

    // The JS template engine to use. See the Templates and Variables section below for more info. 	default
    template: PropTypes.oneOf(
        [
            "default",
            "ejs",
            "handlebars",
            "hogan",
            "markup",
            "mustache",
            "swig",
            "underscore"
        ]
    ),

    // The CSS theme to use. See the CSS Integration section below for more info. 	html
    theme: PropTypes.oneOf(
        [
            "html",
            "barebones",
            "bootstrap4",
            "spectre",
            "tailwind",
            "octobot"
        ]
    ),

    // If true, only required properties will be included by default. 	false
    display_required_only: PropTypes.bool,

    // If true, NON required properties will have an extra toggable checkbox near the title that determines if the value must be included or not in the editor´s value 	false
    show_opt_in: PropTypes.bool,

    // Pass an object containing callback template function
    // "testCallbackFunction": (jseditor, e) => {
    //     return e.test * 1000;
    // }
    templateCallbacks: PropTypes.object,

    // If true, displays a dialog box with a confirmation message before node deletion. 	true
    prompt_before_delete: PropTypes.bool,

    // The default value of `format` for objects. If set to table for example, objects will use table layout if `format` is not specified. 	normal
    object_layout: PropTypes.oneOf(
        ["normal", "table", "grid"]
    ),

    // Pass a function that gets triggered when editor data changes
    onChange: PropTypes.func,

    // Preserve value at Move Up or Down.(No value is selected automatically upon deletion.) 	true
    enum_source_value_auto_select: PropTypes.bool,

    // Max depth of the nested properties to be rendered of provided json schema. The missing of this option could cause "maximum call stack size exceeded" in case of object properties with circular references. 0 value means "render all". 	0
    max_depth: PropTypes.number,

    // If true default values based on the "type" of the property will be used 	true
    use_default_values: PropTypes.bool,

    // A callback function to resolve an undefined Uniform Resource Name (URN) for $ref. The function receives a URN and callback to pass back a serialized JSON response. The function should return a boolean (true if the URN can be resolved; false otherwise). 	false
    urn_resolver: PropTypes.func,

    // use_name_attributes 	If true, control inputs name attributes will be set. 	true
    use_name_attributes: PropTypes.bool,

    // regular html style
    style: PropTypes.object

};

JsonEditor.defaultProps = {
    editorName: undefined,
    ajax: false,
    ajaxBase: undefined,
    ajaxCredentials: false,
    ajax_cache_responses: false,
    ajax_cache_buster: undefined,
    compact: false,
    disable_array_add: false,
    disable_array_delete: false,
    disable_array_delete_all_rows: false,
    disable_array_delete_last_row: false,
    disable_array_reorder: false,
    enable_array_copy: false,
    disable_collapse: false,
    disable_edit_json: false,
    disable_properties: false,
    array_controls_top: false,
    form_name_root: "root",
    iconlib: null,
    remove_button_labels: false,
    no_additional_properties: false,
    refs: {},
    required_by_default: false,
    keep_oneof_values: true,
    schema: {},
    show_errors: "interaction",
    startval: null,
    style: {},
    template: "default",
    language: "en",
    theme: "html",
    display_required_only: false,
    show_opt_in: false,
    prompt_before_delete: true,
    object_layout: "normal",
    onChange: undefined,
    enum_source_value_auto_select: true,
    max_depth: 0,
    use_default_values: true,
    urn_resolver: undefined,
    use_name_attributes: true
};
