import { TENTACLE_SEPARATOR } from "../../constants/backendConstants";

export function userInputKey(userInput, tentacle) {
  return `${userInput}${TENTACLE_SEPARATOR}${tentacle}`;
}

export function validateJSONEditor(editor) {
  const errors = editor.validate();
  let errorsDesc;
  if (errors.length) {
    window.console && console.error("Errors when validating editor:", errors);
    errors.forEach((error) => {
      errorsDesc = `${errorsDesc}${error.path.split("root.")[1]} ${
        error.message
      }\n`;
    });
    return errorsDesc;
  }
}
