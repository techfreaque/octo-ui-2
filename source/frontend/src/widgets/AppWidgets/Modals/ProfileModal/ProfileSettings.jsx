import { faCopy, faDownload, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Space } from "antd"
import { deleteProfile, duplicateProfile } from "../../../../api/actions"
import { backendRoutes } from "../../../../constants/backendConstants"
import { useBotDomainContext } from "../../../../context/config/BotDomainProvider"
import { useFetchBotInfo } from "../../../../context/data/BotInfoProvider"
import { ProfileDescription } from "./ProfileDescription"
import { ProfileTradingSettings } from "./ProfileTradingSettings"

export function ProfileSettings({
    newProfileSettings,
    setNewProfileSettings,
    setIsloading,
    handleClose,
    isCurrentProfile,
    loading
}) {
    const botDomain = useBotDomainContext()
    const fetchBotInfo = useFetchBotInfo()
    function onSuccess() {
        setIsloading(false)
        handleClose()
        fetchBotInfo(true)
    }
    async function handleDeleteProfile() {
        setIsloading(true)
        await deleteProfile(botDomain, newProfileSettings.profile.id, newProfileSettings.profile.name, onSuccess, () => setIsloading(false))
    }
    async function handleProfileDuplication() {
        setIsloading(true)
        await duplicateProfile(botDomain, newProfileSettings.profile.id, newProfileSettings.profile.name, onSuccess, () => setIsloading(false))
    }
    return <div>
        <Space wrap
            style={
                {marginBottom: "15px"}
        }>
            <Button key="duplicate" type="primary" 
                icon={
                    (
                        <FontAwesomeIcon style={
                                {marginRight: "5px"}
                            }
                            icon={faCopy}/>
                    )
                }
                disabled={loading}
                onClick={handleProfileDuplication}>
                Duplicate Profile
            </Button>
            <Button key="downloadProfile" type="primary" 
                icon={
                    (
                        <FontAwesomeIcon style={
                                {marginRight: "5px"}
                            }
                            icon={faDownload}/>
                    )
                }
                disabled={loading}
                href={
                    botDomain + backendRoutes.exportProfile + newProfileSettings?.profile?.id
                }
                // onClick={handleProfileExport}
            >
                Download Profile
            </Button>
            <Button key="deleteProfile" type="primary" 
                icon={
                    (
                        <FontAwesomeIcon style={
                                {marginRight: "5px"}
                            }
                            icon={faXmark}/>
                    )
                }
                danger
                disabled={loading}
                onClick={handleDeleteProfile}>
                Delete Profile
            </Button>
        </Space>
        <ProfileDescription newProfileSettings={newProfileSettings} isCurrentProfile={isCurrentProfile}
            setNewProfileSettings={setNewProfileSettings}/>
        <ProfileTradingSettings newProfileSettings={newProfileSettings}
            isCurrentProfile={isCurrentProfile}
            setNewProfileSettings={setNewProfileSettings}
        />
    </div>
}
