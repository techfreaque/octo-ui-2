import JsonEditor from "@techfreaque/json-editor-react"
import defaultJsonEditorSettings from "../../../../components/Forms/JsonEditor/JsonEditorDefaults"

export default function OptimizerConfigForm() {

    return (
        <div>
            <JsonEditor
                {...defaultJsonEditorSettings()}
                schema={pageBuilderSchema()}
                startval={botLayout}
                editorName={editorName}
                disable_properties={false}
                disable_array_add={false}
                no_additional_properties={false}
                use_name_attributes={true}
                display_required_only={true}
            />
        </div>
    )
}

function generateOptimizerConfigFormSchema(userInputs) {
    return {
        type: "object",
        title: "Optimizer run configurator",
        properties: generateConfigElement(userInputs),
        options: { collapsed: true },

    }
}

function generateConfigElement(inputElements) {
    const configSchema = {}
    inputElements?.forEach(inputElement => {
        if (inputElement.type === "object") {
            configSchema[inputElement.name] = generateObjectConfigElement(inputElement)
        } else if (inputElement.type === "int") {
            configSchema[inputElement.name] = generateIntConfigElement(inputElement)
        } else if (inputElement.type === "boolean") {
            configSchema[inputElement.name] = generateBoolConfigElement(inputElement)
        } else if (inputElement.type === "float") {
            configSchema[inputElement.name] = generateFloatConfigElement(inputElement)
        } else if (inputElement.type === "array") {
            configSchema[inputElement.name] = generateArrayConfigElement(inputElement)
        }

    })
    return {
        title: inputElements.title,
        type: "object",
        properties: configSchema,
        options: { collapsed: true }
    }
}
function generateBoolConfigElement(inputElement) {
    return {
        [inputElement.name]: {
            type: "array",
            title: inputElement.title,
            properties: generateConfigElement(inputElement.properties),
            options: { collapsed: true }
        }
    }
}
function generateFloatConfigElement(inputElement) {
    return {
        [inputElement.name]: {
            type: "float",
            title: inputElement.title,
            properties: generateConfigElement(inputElement.properties),
            options: { collapsed: true }
        }
    }
}
function generateArrayConfigElement(inputElement) {
    return {
        [inputElement.name]: {
            type: "array",
            title: inputElement.title,
            properties: generateConfigElement(inputElement.properties),
            options: { collapsed: true }
        }
    }
}
function generateObjectConfigElement(inputElement) {
    return {
        [inputElement.name]: {
            type: "object",
            title: inputElement.title,
            properties: generateConfigElement(inputElement.properties),
            options: { collapsed: true }
        }
    }
}
function generateIntConfigElement(inputElement) {
    return {
        [inputElement.name]: {
            type: "number",
            title: inputElement.title,
            properties: generateConfigElement(inputElement.properties),
            options: { collapsed: true }
        }
    }
}