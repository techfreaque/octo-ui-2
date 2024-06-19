import { EditOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useState } from "react";

import AntButton, {
  buttonSizes,
  buttonTypes,
  buttonVariants,
} from "../../../../components/Buttons/AntButton";
import { sizes } from "../../../../constants/frontendConstants";
import type { ProfileType } from "../../../../context/data/BotInfoProvider";
import { CleanDescription } from "../../StrategyConfigurator/AppCards/AppDescription";

export function ProfileDescription({
  newProfileSettings,
  setNewProfileSettings,
}: {
  newProfileSettings: ProfileType;
  setNewProfileSettings: Dispatch<SetStateAction<ProfileType>>;
}) {
  const [changeStarted, setChangeStarted] = useState(false);
  function handleDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setNewProfileSettings((prevSettings) => {
      const newSettings = {
        ...prevSettings,
      };
      newSettings.profile.description = event.target.value;
      return newSettings;
    });
    // TODO handle api
  }
  // return <Typography.Paragraph editable={
  //     (!newProfileSettings.profile.read_only && isCurrentProfile) && {
  //         onChange: handleDescriptionChange,
  //         text: newProfileSettings?.profile?.description,
  //         tooltip: 'Click to edit the profile description'

  //     }
  // }>
  //     {
  //     newProfileSettings?.profile?.description
  // } </Typography.Paragraph>
  return changeStarted ? (
    <TextArea
      value={newProfileSettings?.profile?.description?.replace(/<br>/g, "\n")}
      rows={8}
      onChange={handleDescriptionChange}
    />
  ) : (
    <CleanDescription
      description={newProfileSettings?.profile?.description}
      endComponent={
        <Tooltip placement="left" title={"Click to edit the description"}>
          <div>
            <AntButton
              onClick={() => setChangeStarted(true)}
              antIconComponent={EditOutlined}
              colorType={buttonTypes.fontActive}
              buttonVariant={buttonVariants.text}
              size={buttonSizes.large}
              iconSize={sizes.large}
            />
          </div>
        </Tooltip>
      }
    />
  );
}
