import { BankOutlined } from "@ant-design/icons";
import AppIconButton from "../../../../components/Buttons/AppIconButton";
import { useEffect, useMemo, useState } from "react";
import { useFetchBotInfo } from "../../../../context/data/BotInfoProvider";
import { useIsBotOnlineContext, useRestartBot } from "../../../../context/data/IsBotOnlineProvider";
import { useBotDomainContext } from "../../../../context/config/BotDomainProvider";
import { updateConfig, updateProfileInfo } from "../../../../api/actions";
import ProfileModal from "./ProfileModal";

export default function ProfileModalButton({profile, isCurrentProfile}) {
    const [open, setOpen] = useState(false);
    const fetchBotInfo = useFetchBotInfo()
    const [loading, setIsloading] = useState(false);
    const [requiresInstantRestart, setRequiresInstantRestart] = useState(false);
    // const botInfo = useBotInfoContext()
    const isOnline = useIsBotOnlineContext()
    const restartBot = useRestartBot()
    const botDomain = useBotDomainContext()
    const currentProfileTitle = (profile || {})?.profile?.name
    const [newProfileSettings, setNewProfileSettings] = useState(JSON.parse(JSON.stringify(profile || {})))
    const hasChanged = JSON.stringify(profile || {}) !== JSON.stringify(newProfileSettings)

    useEffect(() => {
        setNewProfileSettings(JSON.parse(JSON.stringify(profile || {})))
    }, [profile])

    async function saveProfile(event, restart = false) {
        setIsloading(true)
        const infoHasChanged = JSON.stringify((profile || {}).profile) !== JSON.stringify(newProfileSettings.profile)
        const configHasChanged = JSON.stringify((profile || {}).config) !== JSON.stringify(newProfileSettings.config)
        function onFail() {
            setIsloading(false)
        }
        if (configHasChanged) {
            const configUpdate = {
                global_config: {
                    'trading_reference-market': newProfileSettings.config.trading["reference-market"],
                    'trader_enabled': newProfileSettings.config.trader.enabled,
                    'trader_load-trade-history': newProfileSettings.config.trader["load-trade-history"],
                    'trader-simulator_enabled': newProfileSettings.config["trader-simulator"].enabled,
                    'trader-simulator_fees_maker': newProfileSettings.config["trader-simulator"].fees.maker,
                    'trader-simulator_fees_taker': newProfileSettings.config["trader-simulator"].fees.maker
                },
                removed_elements: [],
                restart_after_save: false
            }
            const newPortfolio = newProfileSettings.config["trader-simulator"]["starting-portfolio"]
            const portfolioCoins = new Set([
                ...Object.keys(newProfileSettings.config["trader-simulator"]["starting-portfolio"]),
                ...Object.keys(
                    (profile || {}).config["trader-simulator"]["starting-portfolio"]
                )
            ])
            portfolioCoins.forEach(coin => {
                const coinKey = `trader-simulator_starting-portfolio_${coin}`
                if (newPortfolio[coin]) {
                    configUpdate.global_config[coinKey] = newPortfolio[coin]
                } else {
                    configUpdate.removed_elements.push(coinKey)
                }
            })
            await updateConfig(botDomain, configUpdate, newProfileSettings.profile.name, onFail)
        }

        if (infoHasChanged) {
            await updateProfileInfo(botDomain, {
                id: newProfileSettings.profile.id,
                name: newProfileSettings.profile.name,
                description: newProfileSettings.profile.description
            }, onFail)
        }
        setIsloading(false)
        if (restart) {
            restartBot(false)
        } else {
            fetchBotInfo(false)
        } handleClose()
    }
    function saveProfileAndRestart() {
        saveProfile(undefined, true)
    }
    function resetUnsavedConfig() {
        setNewProfileSettings(JSON.parse(JSON.stringify(profile)))
    }

    const handleClose = () => {
        resetUnsavedConfig()
        setIsloading(false)
        setOpen(false)
    };
        // <Tooltip   title={
        //     (
        //         <Trans i18nKey="profile.profileSettingsButtonToolTip"/>
        //     )
        // }
        // // trigger={["hover","focus"]}
        // >
    return useMemo(() => (
        <>
            <AppIconButton isSelected={isCurrentProfile}
                disabled={
                    ! isOnline
                }
                spanStyle={
                    {margin: 'auto'}
                }
                buttonTitle={"Exchange Settings"}
                antIconComponent={BankOutlined}
                onClick={
                    () => setOpen(true)
                }/> {
            open && (
                <ProfileModal open={open}
                    setIsloading={setIsloading}
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
                    saveProfileAndRestart={saveProfileAndRestart}/>
            )
            }
            </>
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [
        currentProfileTitle,
        profile,
        hasChanged,
        loading,
        newProfileSettings,
        open
    ])
}

