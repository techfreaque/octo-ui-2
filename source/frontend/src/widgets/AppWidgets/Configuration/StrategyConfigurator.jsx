import {useBotInfoContext} from "../../../context/data/BotInfoProvider"

export default function StraegyConfigurator() {
    const botInfo = useBotInfoContext()

    return (
        <>{
            JSON.stringify(botInfo)
        }</>
    )
}
