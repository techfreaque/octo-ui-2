import { TENTACLE_SEPARATOR } from "../../constants/backendConstants";

export function userInputKey(userInput, tentacle) {
    return `${userInput}${TENTACLE_SEPARATOR}${tentacle}`;
}