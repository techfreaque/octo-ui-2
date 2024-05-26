import type { Dispatch, SetStateAction} from "react";
import { useMemo, useState } from "react";

import type {
  errorResponseCallBackParams,
  successResponseCallBackParams,
} from "../../../api/fetchAndStoreFromBot";
import AntButton, {
  buttonTypes,
  buttonVariants,
} from "../../../components/Buttons/AntButton";
import type { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";
import type {
  TentaclesConfigByTentacleType} from "../../../context/config/TentaclesConfigProvider";
import {
  useSaveTentaclesConfigAndSendAction,
} from "../../../context/config/TentaclesConfigProvider";
import type {
  ApiActionsType} from "../../../context/data/BotInfoProvider";
import {
  useBotInfoContext,
  useIsDemoMode,
} from "../../../context/data/BotInfoProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import { saveUserInputs } from "../Configuration/TentaclesConfig";

export default function SendActionCommandToTradingMode({
  command,
  title,
  faIcon,
  antIcon,
}: UiLayoutPageLayoutType & {
  command?: ApiActionsType;
  title?: string;
}) {
  const isOnline = useIsBotOnlineContext();
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const saveTentaclesConfigAndSendAction = useSaveTentaclesConfigAndSendAction();
  const botInfo = useBotInfoContext();
  const isDemo = useIsDemoMode();
  return useMemo(() => {
    const availableApiActions = botInfo?.available_api_actions;
    const isAvailableApiAction =
      command && availableApiActions?.includes(command);
    return isAvailableApiAction ? (
      <AntButton
        disabled={!isOnline || isExecuting || isDemo}
        onClick={() =>
          sendActionCommandToTradingMode(
            command,
            saveTentaclesConfigAndSendAction,
            setIsExecuting
          )
        }
        buttonVariant={buttonVariants.outline}
        buttonType={buttonTypes.warning}
        faIcon={faIcon}
        antIcon={antIcon}
      >
        {title}
      </AntButton>
    ) : (
      <></>
    );
  }, [
    botInfo?.available_api_actions,
    command,
    isOnline,
    isExecuting,
    isDemo,
    faIcon,
    antIcon,
    title,
    saveTentaclesConfigAndSendAction,
  ]);
}

export function sendActionCommandToTradingMode(
  command: ApiActionsType,
  saveTentaclesConfigAndSendAction: (
    newConfigs: TentaclesConfigByTentacleType,
    actionType: ApiActionsType,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    reloadPlots?: boolean,
    successCallback?:
      | ((payload: successResponseCallBackParams) => void)
      | undefined,
    errorCallback?: ((payload: errorResponseCallBackParams) => void) | undefined
  ) => void,
  setIsExecuting: Dispatch<SetStateAction<boolean>>,
  successCallback?: (payload: successResponseCallBackParams) => void,
  errorCallback?: (payload: errorResponseCallBackParams) => void
) {
  saveUserInputs(
    (currentConfig: TentaclesConfigByTentacleType) =>
      saveTentaclesConfigAndSendAction(
        currentConfig,
        command,
        setIsExecuting,
        true,
        successCallback,
        errorCallback
      ),
    setIsExecuting
  );
}
