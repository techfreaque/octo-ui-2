import {Tooltip} from "antd"
import {CleanDescription} from "../../StrategyConfigurator/AppCards/AppDescription"
import AntButton, {buttonSizes, buttonTypes, buttonVariants} from "../../../../components/Buttons/AntButton"
import {EditOutlined} from "@ant-design/icons"
import {sizes} from "../../../../constants/frontendConstants"
import {useState} from "react"
import TextArea from "antd/es/input/TextArea"

export function ProfileDescription({newProfileSettings, setNewProfileSettings, isCurrentProfile}) {
    const [changeStarted, setChangeStarted] = useState(false)
    function handleDescriptionChange(event) {
        setNewProfileSettings(prevSettings => {
            const newSettings = {
                ...prevSettings
            }
            newSettings.profile.description = event.target.value
            return newSettings
        })
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
        <TextArea value={
                newProfileSettings?.profile?.description?.replace(/<br>/g, "\n")
            }
            rows={8}
            onChange={handleDescriptionChange}/>
    ) : (
        <CleanDescription description={
                newProfileSettings?.profile?.description
            }
            endComponent={
                (
                    <Tooltip placement="left" title={"Click to edit the description"}>
                        <div>
                            <AntButton onClick={
                                    () => setChangeStarted(true)
                                }
                                antIconComponent={EditOutlined}
                                colorType={
                                    buttonTypes.fontActive
                                }
                                buttonVariant={
                                    buttonVariants.text
                                }
                                size={
                                    buttonSizes.large
                                }
                                iconSize={
                                    sizes.large
                                }/>
                        </div>
                    </Tooltip>
                )
            }/>

    )
}
