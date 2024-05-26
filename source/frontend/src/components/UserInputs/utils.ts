import { JsonEditorType } from "@techfreaque/json-editor-react/dist/components/JsonEditor";

import { TENTACLE_SEPARATOR } from "../../constants/backendConstants";
import { TentaclesConfigsRootType } from "../../context/config/TentaclesConfigProvider";

export function userInputKey(userInput: string, tentacle: string[] | string) {
  return `${userInput}${TENTACLE_SEPARATOR}${tentacle}`;
}

export function splitUserInputKey(
  userInputKey: string
): {
  userInput: string;
  tetacles: string[];
} {
  const splitKey = userInputKey.split(TENTACLE_SEPARATOR);
  const userInput = String(splitKey[0]);
  const tentacleStr = String(splitKey[1]);
  const tetacles = tentacleStr.split(",");
  return {
    userInput,
    tetacles,
  };
}

export function findUserInputAndTentacleLabel(
  currentTentaclesTradingConfig: TentaclesConfigsRootType | undefined,
  userInputName: string,
  tentacleNames: string[]
) {
  const rootTentacleName = tentacleNames[0];
  let nestedTitle: string = rootTentacleName || "";
  try {
    if (!rootTentacleName) {
      throw new Error();
    }
    let nestedObject: any =
      currentTentaclesTradingConfig?.[rootTentacleName]?.schema.properties;
    let tentacleLabel = rootTentacleName;
    const nestedTentacleName = tentacleNames.slice(1);
    for (const key of nestedTentacleName) {
      if (nestedObject?.[key]) {
        nestedTitle = `${
          nestedObject[key].title || nestedObject[key].options?.name
        }`;
        if (!tentacleLabel.endsWith(nestedTitle)) {
          tentacleLabel += ` > ${nestedTitle}`;
        }
        nestedObject = nestedObject[key].properties; // Access the nested object using each key
      } else {
        throw new Error();
      }
    }
    let userInputLabel: string;
    try {
      userInputLabel =
        nestedObject[userInputName].title ||
        nestedObject[userInputName].options?.name ||
        userInputName;
    } catch (e) {
      userInputLabel = userInputName;
    }
    return {
      userInputLabel,
      tentacleLabel,
      lastTentacleTitle: nestedTitle,
    };
  } catch (e) {
    return {
      userInputLabel: userInputName,
      tentacleLabel: `${tentacleNames}`,
      lastTentacleTitle: nestedTitle,
    };
  }
}

export function validateJSONEditor<TStartValueType>(
  editor: JsonEditorType<TStartValueType>
): string | undefined {
  const errors = editor.validate();
  let errorsDesc: string | undefined;
  if (!errors.length) {
    return undefined;
  }
  console.error("Errors when validating editor:", errors);
  errors.forEach((error) => {
    errorsDesc = `${errorsDesc}${error.path.split("root.")[1]} ${
      error.message
    }\n`;
  });
  return errorsDesc;
}
