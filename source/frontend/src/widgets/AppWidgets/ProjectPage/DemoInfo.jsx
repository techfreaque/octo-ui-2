import {useIsDemoMode, useUpdateProjectInfoOpenContext} from "../../../context/data/BotInfoProvider";
import AntButton from "../../../components/Buttons/AntButton";
import {RocketOutlined} from "@ant-design/icons";
import {sizes} from "../../../constants/frontendConstants";

export default function DemoInfo() {
    const isDemo = useIsDemoMode()
    const setProjectInfoOpen = useUpdateProjectInfoOpenContext()
    return isDemo && (
        <AntButton size={
                sizes.large
            }
            onClick={
                () => setProjectInfoOpen(true)
            }
            antIconComponent={RocketOutlined}
            style={
                {marginRight: "5px"}
        }>
            Get Octane Now
        </AntButton>
    )
}
