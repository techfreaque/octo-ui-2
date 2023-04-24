import {faSave, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button} from "@mui/material";
import {Modal, Button as AntButton, Tooltip} from "antd";
import {useEffect, useMemo, useState} from "react";
import {updateConfig, updateProfileInfo} from "../../../../api/actions";
import {useBotDomainContext} from "../../../../context/config/BotDomainProvider";
import {useBotInfoContext, useFetchBotInfo} from "../../../../context/data/BotInfoProvider";
import {useIsBotOnlineContext, useRestartBot} from "../../../../context/data/IsBotOnlineProvider";
import ProfileAvatar from "../../Stats/ProfileAvatar";
import {ProfileSettings} from "./ProfileSettings";
import {ProfileTitle} from "./ProfileTitle";
import {Trans} from "react-i18next";


export default function ProfileModal() {
    const [open, setOpen] = useState(false);
    const fetchBotInfo = useFetchBotInfo()
    const [loading, setIsloading] = useState(false);
    const [requiresInstantRestart, setRequiresInstantRestart] = useState(false);
    const botInfo = useBotInfoContext()
    const isOnline = useIsBotOnlineContext()
    const restartBot = useRestartBot()
    const botDomain = useBotDomainContext()
    const currentProfileTitle = (botInfo?.current_profile || {})?.profile?.name
    const [newProfileSettings, setNewProfileSettings] = useState(JSON.parse(JSON.stringify(botInfo?.current_profile || {})))
    const hasChanged = JSON.stringify(botInfo?.current_profile || {}) !== JSON.stringify(newProfileSettings)

    useEffect(() => {
        setNewProfileSettings(JSON.parse(JSON.stringify(botInfo?.current_profile || {})))
    }, [botInfo?.current_profile])

    async function saveProfile(event, restart = false) {
        setIsloading(true)
        const infoHasChanged = JSON.stringify((botInfo?.current_profile || {}).profile) !== JSON.stringify(newProfileSettings.profile)
        const configHasChanged = JSON.stringify((botInfo?.current_profile || {}).config) !== JSON.stringify(newProfileSettings.config)
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
                    (botInfo?.current_profile || {}).config["trader-simulator"]["starting-portfolio"]
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
        setNewProfileSettings(JSON.parse(JSON.stringify(botInfo?.current_profile)))
    }

    const handleClose = () => {
        resetUnsavedConfig()
        setIsloading(false)
        setOpen(false)
    };

    return useMemo(() => (
        <Tooltip title={
            (
                <Trans i18nKey="profile.profileInfoButtonToolTip"/>
            )
        }>
            
            
            {isOnline ? (<div></div>): (<div></div>)}

            <div style={
                {
                    margin: "auto",
                    height: "100%"
                }
            }>
                <Button onClick={
                        () => setOpen(true)
                    }
                    disabled={
                        ! isOnline
                    }
                    style={
                        {
                            fontSize: "9px",
                            height: "100%",
                            textTransform: "none",
                            maxWidth: "150px",
                            maxHeight: "40px",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }
                }>
                    <ProfileAvatar marginRight="5px"/> {currentProfileTitle} </Button>
                {
                open && <ProfileModalElement open={open}
                    setIsloading={setIsloading}
                    handleClose={handleClose}
                    newProfileSettings={newProfileSettings}
                    setNewProfileSettings={setNewProfileSettings}
                    botInfo={botInfo}
                    setRequiresInstantRestart={setRequiresInstantRestart}
                    requiresInstantRestart={requiresInstantRestart}
                    loading={loading}
                    saveProfile={saveProfile}
                    hasChanged={hasChanged}
                    saveProfileAndRestart={saveProfileAndRestart}/>
            } </div>
        </Tooltip>
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [
        currentProfileTitle,
        botInfo?.current_profile,
        hasChanged,
        loading,
        newProfileSettings,
        open
    ])
}


function ProfileModalElement({
    open,
    setIsloading,
    handleClose,
    newProfileSettings,
    setNewProfileSettings,
    botInfo,
    setRequiresInstantRestart,
    requiresInstantRestart,
    loading,
    saveProfile,
    hasChanged,
    saveProfileAndRestart
}) {
    return (
        <Modal open={open}
            onCancel={handleClose}
            title={
                (
                    <ProfileTitle newProfileSettings={newProfileSettings}
                        setNewProfileSettings={setNewProfileSettings}
                        currentProfile={
                            botInfo?.current_profile || {}
                        }
                        setRequiresInstantRestart={setRequiresInstantRestart}/>
                )
            }
            centered
            width="700px"
            footer={
                [
                    // hasChanged&& (
                    //     <AntButton key="reset"
                    //         icon={
                    //             (
                    //                 <FontAwesomeIcon style={
                    //                         {marginRight: "5px"}
                    //                     }
                    //                     icon={faXmark}/>
                    //             )
                    //         }
                    //         size="large"
                    //         onClick={resetUnsavedConfig}>
                    //         Reset unsaved changes
                    //     </AntButton>
                    // ),
                    (
                        <AntButton key="back"
                            icon={
                                (
                                    <FontAwesomeIcon style={
                                            {marginRight: "5px"}
                                        }
                                        icon={faXmark}/>
                                )
                            }
                            size="large"
                            onClick={handleClose}>
                            Cancel
                        </AntButton>
                    ),
                    !requiresInstantRestart && (
                        <AntButton disabled={
                                !hasChanged || loading
                            }
                            key="save2"
                            type="primary"
                            icon={
                                (
                                    <FontAwesomeIcon style={
                                            {marginRight: "5px"}
                                        }
                                        icon={faSave}/>
                                )
                            }
                            size="large"
                            onClick={saveProfile}>
                            Save And Restart Later
                        </AntButton>
                    ),
                    (
                        <AntButton disabled={
                                !hasChanged || loading
                            }
                            key="saveAndRestart"
                            type="primary"
                            danger
                            icon={
                                (
                                    <FontAwesomeIcon style={
                                            {marginRight: "5px"}
                                        }
                                        icon={faSave}/>
                                )
                            }
                            size="large"
                            onClick={saveProfileAndRestart}>
                            Save And Restart Now
                        </AntButton>
                    ),
                ]
        }>
            <ProfileSettings newProfileSettings={newProfileSettings}
                setNewProfileSettings={setNewProfileSettings}
                setIsloading={setIsloading}
                handleClose={handleClose}
                loading={loading}/>
        </Modal>
    )
}
