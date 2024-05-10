import { BankOutlined } from "@ant-design/icons";
import AppIconButton from "../../../../components/Buttons/AppIconButton";
import { useEffect, useMemo, useState } from "react";
import {
  ProfileType,
  useFetchBotInfo,
} from "../../../../context/data/BotInfoProvider";
import {
  useIsBotOnlineContext,
  useRestartBot,
} from "../../../../context/data/IsBotOnlineProvider";
import { useBotDomainContext } from "../../../../context/config/BotDomainProvider";
import { updateConfig, updateProfileInfo } from "../../../../api/actions";
import ProfileModal from "./ProfileModal";
import {
  ExchangeConfigUpdateType,
  getProfileCurrencyUpdate,
  useCurrentCurrencyListContext,
  useExchangeConfigUpdateContext,
  useExchangeInfoContext,
  useUnsavedCurrencyListContext,
} from "../../../../context/data/BotExchangeInfoProvider";
import createNotification from "../../../../components/Notifications/Notification";

export default function ProfileModalButton({
  profile,
  isCurrentProfile,
}: {
  profile: ProfileType;
  isCurrentProfile: boolean | undefined;
}) {
  const [open, setOpen] = useState(false);
  const fetchBotInfo = useFetchBotInfo();
  const [loading, setIsloading] = useState(false);
  const [requiresInstantRestart, setRequiresInstantRestart] = useState(true);
  const isOnline = useIsBotOnlineContext();
  const restartBot = useRestartBot();
  const botDomain = useBotDomainContext();
  const currentProfileTitle = profile?.profile?.name;
  const [newProfileSettings, setNewProfileSettings] = useState<ProfileType>(
    JSON.parse(JSON.stringify(profile))
  );
  const currentCurrencyList = useCurrentCurrencyListContext();
  const unsavedCurrencyList = useUnsavedCurrencyListContext();
  const currencyListChanged =
    unsavedCurrencyList &&
    currentCurrencyList &&
    JSON.stringify(unsavedCurrencyList) !== JSON.stringify(currentCurrencyList);
  const exchangeConfigUpdate = useExchangeConfigUpdateContext();
  const exchangeConfigUpdateHasChanged = Boolean(
    exchangeConfigUpdate.global_config &&
      Object.keys(exchangeConfigUpdate.global_config).length
  );
  const hasChanged =
    JSON.stringify(profile || {}) !== JSON.stringify(newProfileSettings) ||
    currencyListChanged ||
    exchangeConfigUpdateHasChanged;
  const exchangeInfo = useExchangeInfoContext();
  const currencySettings = profile?.config?.["crypto-currencies"];

  useEffect(() => {
    setNewProfileSettings(JSON.parse(JSON.stringify(profile || {})));
  }, [profile]);

  useEffect(() => {
    currencyListChanged && setRequiresInstantRestart(true);
  }, [currencyListChanged]);

  async function saveProfile(restart = false) {
    setIsloading(true);
    const infoHasChanged =
      JSON.stringify(profile?.profile) !==
      JSON.stringify(newProfileSettings?.profile);
    const configHasChanged =
      JSON.stringify(profile?.config) !==
      JSON.stringify(newProfileSettings?.config);
    function onFail() {
      createNotification({ title: "Successfully updated profile info" });
      setIsloading(false);
    }
    const configUpdate: ExchangeConfigUpdateType = {
      ...exchangeConfigUpdate,
      restart_after_save: true,
    };
    if (currencyListChanged && currencySettings) {
      getProfileCurrencyUpdate({
        configUpdate,
        currentCurrencyList,
        currencySettings,
        unsavedCurrencyList,
        exchangeInfo,
      });
    }
    if (configHasChanged && newProfileSettings) {
      configUpdate.global_config["trading_reference-market"] =
        newProfileSettings.config.trading["reference-market"];
      configUpdate.global_config["trader_enabled"] =
        newProfileSettings.config.trader.enabled;
      configUpdate.global_config["trader_load-trade-history"] =
        newProfileSettings.config.trader["load-trade-history"];
      configUpdate.global_config["trader-simulator_enabled"] =
        newProfileSettings.config["trader-simulator"].enabled;
      configUpdate.global_config["trader-simulator_fees_maker"] =
        newProfileSettings.config["trader-simulator"].fees.maker;
      configUpdate.global_config["trader-simulator_fees_taker"] =
        newProfileSettings.config["trader-simulator"].fees.maker;
      const newPortfolio =
        newProfileSettings.config["trader-simulator"]["starting-portfolio"];
      const portfolioCoins = new Set([
        ...Object.keys(
          newProfileSettings.config["trader-simulator"]["starting-portfolio"]
        ),
        ...Object.keys(
          profile?.config["trader-simulator"]["starting-portfolio"]
        ),
      ]);
      portfolioCoins.forEach((coin) => {
        const coinKey = `trader-simulator_starting-portfolio_${coin}`;
        if (newPortfolio[coin]) {
          configUpdate.global_config[coinKey] = newPortfolio[coin];
        } else {
          configUpdate.removed_elements.push(coinKey);
        }
      });
    }
    if (
      currencyListChanged ||
      exchangeConfigUpdateHasChanged ||
      configHasChanged
    ) {
      await updateConfig(
        botDomain,
        configUpdate,
        newProfileSettings.profile.name,
        () => setIsloading(false)
      );
    }
    if (infoHasChanged) {
      await updateProfileInfo(
        botDomain,
        {
          id: newProfileSettings.profile.id,
          name: newProfileSettings.profile.name,
          description: newProfileSettings.profile.description,
        },
        onFail
      );
    }
    setIsloading(false);
    if (restart) {
      restartBot(false);
    } else {
      fetchBotInfo(false);
    }
    handleClose();
  }
  function saveProfileAndRestart() {
    saveProfile(true);
  }
  function resetUnsavedConfig() {
    setNewProfileSettings(JSON.parse(JSON.stringify(profile)));
  }

  const handleClose = () => {
    resetUnsavedConfig();
    setIsloading(false);
    setOpen(false);
  };
  // <Tooltip   title={
  //     (
  //         <Trans i18nKey="profile.profileSettingsButtonToolTip"/>
  //     )
  // }
  // // trigger={["hover","focus"]}
  // >
  return useMemo(
    () => (
      <>
        <AppIconButton
          isSelected={isCurrentProfile}
          disabled={!isOnline}
          spanStyle={{ margin: "auto" }}
          buttonTitle={"Exchange Settings"}
          antIconComponent={BankOutlined}
          onClick={() => setOpen(true)}
        />
        {open && (
          <ProfileModal
            handleClose={handleClose}
            isCurrentProfile={isCurrentProfile}
            newProfileSettings={newProfileSettings}
            setNewProfileSettings={setNewProfileSettings}
            profile={profile}
            setRequiresInstantRestart={setRequiresInstantRestart}
            requiresInstantRestart={requiresInstantRestart}
            loading={loading}
            saveProfile={saveProfile}
            hasChanged={hasChanged}
            saveProfileAndRestart={saveProfileAndRestart}
          />
        )}
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      currentProfileTitle,
      profile,
      hasChanged,
      loading,
      newProfileSettings,
      open,
    ]
  );
}

export interface ProfileInfoUpdateType {
  id: string;
  name?: string;
  description?: string;
  required_trading_tentacles?: string[];
}
