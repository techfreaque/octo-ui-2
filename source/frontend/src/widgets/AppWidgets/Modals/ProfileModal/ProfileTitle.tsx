import { Dispatch, SetStateAction } from "react";
import ProfileAvatar from "../../Stats/ProfileAvatar";
import { Typography } from "antd";
import { ProfileType } from "../../../../context/data/BotInfoProvider";

export function ProfileTitle({
  newProfileSettings,
  setNewProfileSettings,
  currentProfile,
  setRequiresInstantRestart,
  isCurrentProfile,
}: {
  newProfileSettings: ProfileType;
  setNewProfileSettings: Dispatch<SetStateAction<ProfileType>>;
  currentProfile: ProfileType;
  setRequiresInstantRestart: Dispatch<SetStateAction<boolean>>;
  isCurrentProfile: boolean | undefined;
}) {
  function handleTitleChange(newName: string) {
    // TODO also change profile id
    setNewProfileSettings((prevSettings) => {
      const newSettings = {
        ...prevSettings,
      };
      newSettings.profile.name = newName;
      setRequiresInstantRestart(
        JSON.stringify(currentProfile.profile.name) !==
          JSON.stringify(newSettings.profile.name)
      );
      return newSettings;
    });
  }
  return (
    <Typography.Title
      level={2}
      editable={
        !newProfileSettings.profile.read_only && isCurrentProfile
          ? {
              onChange: handleTitleChange,
              text: newProfileSettings?.profile?.name,

              tooltip: "Click to edit the profile name",
            }
          : false
      }
    >
      <ProfileAvatar size="40px" /> {newProfileSettings.profile.name}
    </Typography.Title>
  );
}
