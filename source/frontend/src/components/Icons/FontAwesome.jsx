import { sizes } from "../../constants/frontendConstants"

const iconStyles = {
    size: {
        [sizes.small]: undefined,
        [sizes.medium]: "1x",
        [sizes.large]: "2x"
    },
    margin: {
        [sizes.small]: undefined,
        [sizes.medium]: "1x",
        [sizes.large]: "2x"
    }

}

export default function FontAwesomeIconByString({
    faIcon,
    size = sizes.medium,
    marginRight = "7px"
}) {
    return faIcon && (
        <i className={
                `fa-${
                    iconStyles.size[size]
                } fas fa-${faIcon}`
            }
            style={
                {marginRight}
            }/>
    )
}
