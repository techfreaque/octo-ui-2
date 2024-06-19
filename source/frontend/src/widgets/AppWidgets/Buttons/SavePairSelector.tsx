import { SaveOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { Trans } from "react-i18next";

import AntButton, {
  buttonTypes,
  buttonVariants,
} from "../../../components/Buttons/AntButton";
import {
  useCurrentCurrencyListContext,
  useExchangeConfigUpdateContext,
  useHandleProfileUpdate,
  usePairSelectorMenuOpenContext,
  useUnsavedCurrencyListContext,
  useUpdatePairSelectorMenuOpenContext,
} from "../../../context/data/BotExchangeInfoProvider";
import { useIsDemoMode } from "../../../context/data/BotInfoProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";

export default function SavePairSelector() {
  const setPairSelectorMenuOpen = useUpdatePairSelectorMenuOpenContext();
  const pairSelectorMenuOpen = usePairSelectorMenuOpenContext();
  const currentCurrencyList = useCurrentCurrencyListContext();
  const unsavedCurrencyList = useUnsavedCurrencyListContext();
  const handleProfileUpdate = useHandleProfileUpdate();
  const exchangeConfigUpdate = useExchangeConfigUpdateContext();
  const isDemo = useIsDemoMode();
  const isOnline = useIsBotOnlineContext();
  return useMemo(() => {
    const exchangeConfigUpdateHasChanged = Boolean(
      exchangeConfigUpdate.global_config &&
        Object.keys(exchangeConfigUpdate.global_config).length,
    );
    const hasUnsavedChanges =
      JSON.stringify(unsavedCurrencyList) !==
      JSON.stringify(currentCurrencyList);
    function handleSave(restartAfterSave = true) {
      handleProfileUpdate(restartAfterSave);
      setPairSelectorMenuOpen({ open: false, wantsClose: false });
    }
    return pairSelectorMenuOpen?.open &&
      (exchangeConfigUpdateHasChanged || hasUnsavedChanges) ? (
      <span
        style={{
          margin: "auto",
          display: "flex",
          marginRight: "5px",
        }}
      >
        <AntButton
          onClick={() => handleSave(true)}
          disabled={isDemo || !isOnline}
          antIconComponent={SaveOutlined}
          buttonType={buttonTypes.error}
          buttonVariant={buttonVariants.primary}
        >
          <Trans i18nKey="pairSelector.SaveAndRestart" />
        </AntButton>
      </span>
    ) : (
      <></>
    );
  }, [
    currentCurrencyList,
    exchangeConfigUpdate.global_config,
    handleProfileUpdate,
    isDemo,
    isOnline,
    pairSelectorMenuOpen?.open,
    setPairSelectorMenuOpen,
    unsavedCurrencyList,
  ]);
}
