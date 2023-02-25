import JsonEditor from "@techfreaque/json-editor-react"
import defaultJsonEditorSettings from "../../../../components/Forms/JsonEditor/JsonEditorDefaults"
import { OPTIMIZER_INPUTS_KEY } from "../../../../constants/backendConstants"
import { useTentaclesConfigContext } from "../../../../context/config/TentaclesConfigProvider"
import { useUiConfigContext } from "../../../../context/config/UiConfigProvider"

export default function OptimizerConfigForm2() {
    const currentTentaclesConfig = useTentaclesConfigContext()
    const uiConfig = useUiConfigContext()
    const optimizerConfig = uiConfig[OPTIMIZER_INPUTS_KEY] || {}
    return currentTentaclesConfig && (
        <div>
            <JsonEditor
                {...defaultJsonEditorSettings()}
                schema={generateOptimizerConfigFormSchema(currentTentaclesConfig)}
                startval={optimizerConfig}
                editorName="Optimizer configurator"
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
    const configSchema = {}
    Object.values(userInputs).forEach(inputElement => {
        configSchema[inputElement.tentacle] = {
            type: "object",
            title: inputElement.schema.title,
            properties: generateConfigElements(inputElement.schema.properties),
            options: { collapsed: true },

        }
    })
    return {
        type: "object",
        title: "Optimizer run configurator",
        properties: configSchema,
        options: { collapsed: true },

    }
}

function generateConfigElements(inputElements) {
    const configSchema = {}
    Object.entries(inputElements).forEach(([inputKey, inputElement]) => {
        if (inputElement.type === "object") {
            configSchema[inputKey] = generateObjectConfigElement(inputElement)
        } else if (inputElement.type === "int") {
            configSchema[inputKey] = generateIntegerConfigElement(inputElement)
        } else if (inputElement.type === "boolean") {
            configSchema[inputKey] = generateBoolConfigElement(inputElement)
        } else if (inputElement.type === "number") {
            configSchema[inputKey] = generateFloatConfigElement(inputElement)
        } else if (inputElement.type === "array") {
            configSchema[inputKey] = generateArrayConfigElement(inputElement)
        }

    })
    return configSchema
}
function generateBoolConfigElement(inputElement) {
    return generateInputConfigElement(
        inputElement,
        {
            value: {
                "type": "array",
                "uniqueItems": true,
                "format": "selectize",
                "options": {
                    "grid_columns": 12,
                    "selectize": {
                        "create": true
                    }
                },
                "enum_titles": [
                    "True",
                    "False",
                ],
                "items": {
                    "type": "string",
                    "enum": [
                        true,
                        false
                    ]
                }
            }
        }
    )
}
function generateFloatConfigElement(inputElement) {
    return generateNumberConfigElement(inputElement, "number")
}
function generateIntegerConfigElement(inputElement) {
    return generateNumberConfigElement(inputElement, "integer")
}
function generateNumberConfigElement(inputElement, numType) {
    // numType = "number" || "integer"
    return generateInputConfigElement(
        inputElement,
        {
            value: {
                title: "",
                type: "object",
                properties: {
                    min: {
                        type: numType,
                        title: "Min",
                        options: { collapsed: true },
                        default: 0
                    },
                    max: {
                        type: numType,
                        title: "Max",
                        options: { collapsed: true },
                        default: 0
                    },
                    step: {
                        type: numType,
                        title: "Step",
                        options: { collapsed: true },
                        default: 1
                    },
                },
                options: { collapsed: true }
            }
        }
    )
}
function generateArrayConfigElement(inputElement) {
    // return generateInputConfigElement(
    //     inputElement,
    //     {
    //         [inputElement.name]: {
    //             type: "array",
    //             title: inputElement.title,
    //             properties: generateConfigElement(inputElement.properties),
    //             options: { collapsed: true }
    //         }
    //     }
    // )
}
function generateObjectConfigElement(inputElement) {
    return {
        type: "object",
        title: inputElement.title,
        properties: generateConfigElements(inputElement.properties),
        options: { collapsed: true }

    }
}

export function generateInputConfigElement(inputElement, configuratorElements) {
    return {
        type: "object",
        title: inputElement.title,
        properties: {
            ...configuratorElements,
            enabled: {
                type: "boolean",
                title: "",
                format: "checkbox",
                fieldType: "boolean"
            },
        },
        options: {
            grid_columns: 12,
            compact: true
        },
    }
    
}

