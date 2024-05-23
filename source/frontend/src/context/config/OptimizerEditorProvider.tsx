import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { saveProConfig } from "../../api/configs";
import {
  errorResponseCallBackParams,
  sendAndInterpretBotUpdate,
  successResponseCallBackParams,
} from "../../api/fetchAndStoreFromBot";
import createNotification from "../../components/Notifications/Notification";
import {
  backendRoutes,
  OPTIMIZER_INPUTS_KEY,
} from "../../constants/backendConstants";
import { emptyValueFunction } from "../../helpers/helpers";
import { useBotDomainContext } from "./BotDomainProvider";

const OptimizerEditorCounterContext = createContext<number>(0);
const UpdateOptimizerEditorCounterContext = createContext<
  Dispatch<SetStateAction<number>>
>(emptyValueFunction);

export type OptimizerEditorInputNumberType = {
  min: number;
  max: number;
  step: number;
};
export type OptimizerEditorInputArrayType = string[] | number[] | boolean[];

export type OptimizerEditorInputType = {
  [settingsKey: string]: {
    enabled: boolean;
    tentacle: string;
    type: SchemaValueType;
    user_input: string;
    value: OptimizerEditorInputArrayType | OptimizerEditorInputNumberType;
  };
};

export type SchemaNestedValueType = "nested_config";
export type SchemaOptionsValueType = "options" | "multiple-options";
export type SchemaOptionsSimpleType = "number" | "boolean";
export type SchemaValueType =
  | SchemaOptionsValueType
  | SchemaNestedValueType
  | SchemaOptionsSimpleType;

export interface OptimizerFilterPartType {
  role: string;
  type: string;
  value: string;
}

export interface OptimizerFiltersValuesType {
  user_input_left_operand: OptimizerFilterPartType;
  operator: OptimizerFilterPartType;
  user_input_right_operand: OptimizerFilterPartType;
  text_right_operand: OptimizerFilterPartType;
}

export interface OptimizerEditorInputsType {
  user_inputs?: OptimizerEditorInputType;
  filters_settings?: OptimizerFiltersValuesType[];
}
export interface OptimizerEditorType {
  [OPTIMIZER_INPUTS_KEY]?: OptimizerEditorInputsType;
}

const OptimizerEditorContext = createContext<OptimizerEditorType | undefined>(
  undefined
);
const UpdateOptimizerEditorContext = createContext<
  Dispatch<SetStateAction<OptimizerEditorType | undefined>>
>(emptyValueFunction);

export const useOptimizerEditorCounterContext = () => {
  return useContext(OptimizerEditorCounterContext);
};

export const useUpdateOptimizerEditorCounterContext = () => {
  return useContext(UpdateOptimizerEditorCounterContext);
};

export const useOptimizerEditorContext = () => {
  return useContext(OptimizerEditorContext);
};

export const useUpdateOptimizerEditorContext = () => {
  return useContext(UpdateOptimizerEditorContext);
};

export const useFetchProConfig = () => {
  const setOptimizerEditor = useUpdateOptimizerEditorContext();
  const botDomain = useBotDomainContext();
  return useCallback(
    (onFinished?: (proConfig: OptimizerEditorType) => void) => {
      function successCallback(payload: successResponseCallBackParams) {
        setOptimizerEditor(payload.data);
        onFinished?.(payload.data);
      }
      sendAndInterpretBotUpdate({
        updateUrl: botDomain + backendRoutes.proConfig,
        method: "GET",
        successCallback,
      });
    },
    [setOptimizerEditor, botDomain]
  );
};

export const useSaveOptimizerForm = () => {
  const botDomain = useBotDomainContext();
  const optimizerForm = useOptimizerEditorContext();
  return useCallback(() => {
    if (!optimizerForm) {
      createNotification({
        title: "Optimizer form not ready yet",
        type: "danger",
      });
      return;
    }
    function errorCallback(payload: errorResponseCallBackParams) {
      createNotification({
        title: "Failed to save the optimizer run form",
        type: "danger",
        message: `Error: ${payload.data.message}` || payload.data,
      });
    }
    if (optimizerForm)
      saveProConfig(botDomain, optimizerForm, undefined, errorCallback);
    return optimizerForm;
  }, [botDomain, optimizerForm]);
};

export const OptimizerEditorProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [optimizerEditorCounter, setOptimizerEditorCounter] = useState(0);
  const [optimizerEditor, setOptimizerEditor] = useState<OptimizerEditorType>();
  useEffect(() => {
    const inputs = optimizerEditor?.optimizer_inputs?.user_inputs;
    inputs && setOptimizerEditorCounter(getOptimizerEditorCounter(inputs));
  }, [optimizerEditor]);

  return (
    <OptimizerEditorCounterContext.Provider value={optimizerEditorCounter}>
      <UpdateOptimizerEditorCounterContext.Provider
        value={setOptimizerEditorCounter}
      >
        <OptimizerEditorContext.Provider value={optimizerEditor}>
          <UpdateOptimizerEditorContext.Provider value={setOptimizerEditor}>
            {children}
          </UpdateOptimizerEditorContext.Provider>
        </OptimizerEditorContext.Provider>
      </UpdateOptimizerEditorCounterContext.Provider>
    </OptimizerEditorCounterContext.Provider>
  );
};

function getOptimizerEditorCounter(userInputs: OptimizerEditorInputType) {
  let runsCount = 0;
  Object.values(userInputs).forEach((userInput) => {
    if (userInput.enabled) {
      if (runsCount === 0) {
        runsCount = 1;
      }
      const value = userInput.value;
      if (value instanceof Array) {
        runsCount *= value.length;
      } else if (typeof value.step !== "undefined") {
        if (value.step > 0) {
          const window = value.max - value.min;
          runsCount *= Math.floor(window / value.step + 1);
        }
      } else {
        console.error(
          "Unhandled user input type to compute optimizer runs count: ",
          value
        );
      }
    }
  });
  return runsCount;
}
