import ProfileAvatar from "../../Stats/ProfileAvatar"
import {Typography} from "antd";

export function ProfileTitle({newProfileSettings, setNewProfileSettings, currentProfile, setRequiresInstantRestart}) {
    function handleTitleChange(newName) {
        // TODO also change profile id
        setNewProfileSettings(prevSettings => {
            const newSettings = {
                ...prevSettings
            }
            newSettings.profile.name = newName
            setRequiresInstantRestart(JSON.stringify(currentProfile.profile.name) !== JSON.stringify(newSettings.profile.name))
            return newSettings
        })
    }
    return (
        <Typography.Title level={2}
            editable={
                !newProfileSettings.profile.read_only && {
                    onChange: handleTitleChange,
                    text: newProfileSettings?.profile?.name,

                    tooltip: 'Click to edit the profile name'
                }
        }>
            <ProfileAvatar size="40px"/> {
            newProfileSettings.profile.name
        }</Typography.Title>
    )
}
