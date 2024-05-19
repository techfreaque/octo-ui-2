import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import {
  ApiActionsType,
  useBotInfoContext,
  useIsDemoMode,
} from "../../../context/data/BotInfoProvider";
import {
  TentaclesConfigByTentacleType,
  useSaveTentaclesConfigAndSendAction,
} from "../../../context/config/TentaclesConfigProvider";
import { saveUserInputs } from "../Configuration/TentaclesConfig";
import AntButton, {
  buttonTypes,
  buttonVariants,
} from "../../../components/Buttons/AntButton";
import {
  errorResponseCallBackParams,
  successResponseCallBackParams,
} from "../../../api/fetchAndStoreFromBot";

export default function SendActionCommandToTradingMode({
  command,
  title,
  faIcon,
  antIcon,
}: {
  command: ApiActionsType;
  title: string;
  faIcon?: string;
  antIcon?: string;
}) {
  const isOnline = useIsBotOnlineContext();
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const saveTentaclesConfigAndSendAction = useSaveTentaclesConfigAndSendAction();
  const botInfo = useBotInfoContext();
  const isDemo = useIsDemoMode();
  return useMemo(() => {
    const availableApiActions = botInfo?.available_api_actions;
    const isAvailableApiAction = availableApiActions?.includes(command);
    return (
      isAvailableApiAction && (
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
      )
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
