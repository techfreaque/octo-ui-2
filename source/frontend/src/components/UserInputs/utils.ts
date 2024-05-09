import { JsonEditorType } from "@techfreaque/json-editor-react/dist/components/JsonEditor";
import { TENTACLE_SEPARATOR } from "../../constants/backendConstants";

export function userInputKey(userInput: string, tentacle: string[] | string) {
  return `${userInput}${TENTACLE_SEPARATOR}${tentacle}`;
}

export function validateJSONEditor(editor: JsonEditorType<any>) {
  const errors = editor.validate();
  let errorsDesc: string | undefined;
  if (!errors.length) {
    return;
  }
  window.console && console.error("Errors when validating editor:", errors);
  errors.forEach((error) => {
    errorsDesc = `${errorsDesc}${error.path.split("root.")[1]} ${
      error.message
    }\n`;
  });
  return errorsDesc;
}
