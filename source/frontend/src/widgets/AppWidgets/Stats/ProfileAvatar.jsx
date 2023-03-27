import { backendRoutes } from "../../../constants/backendConstants"
import { useBotDomainContext } from "../../../context/config/BotDomainProvider"
import { useCurrentProfile } from "../../../context/data/BotInfoProvider"

export default function ProfileAvatar({
    size = "20px",
    marginRight = "0"
}) {
    const currentProfile = useCurrentProfile()
    const botDomain = useBotDomainContext()
    const currentAvatar = currentProfile?.profile?.avatar
    const avatarUrl = currentAvatar === "default_profile.png" ? `${
        botDomain + backendRoutes.staticImg
    }/${currentAvatar}` : `${
        botDomain + backendRoutes.profileMedia
    }/${
        currentProfile?.profile?.name
    }/${currentAvatar}`
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img style={
            {
                margin: "auto",
                marginRight: {marginRight},
                height: size,
                width: "auto"
            }
        }
        src={avatarUrl}      
        />
}