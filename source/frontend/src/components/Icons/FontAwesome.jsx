import {createElement} from "react"
import {sizes} from "../../constants/frontendConstants"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

const iconStyles = {
    size: {
        [sizes.small]: "lg",
        [sizes.medium]: "xl",
        [sizes.large]: "2x"
    }
}

export function FaIconByReactFunc({
    icon,
    size = sizes.medium,
    spin = false,
    marginRight = "0px"

}) {
    return icon && createElement(FontAwesomeIcon, {
        size: iconStyles.size[size],
        icon,
        spin,
        style: {
            marginRight,
            marginTop: "auto",
            marginBottom: "auto",
        }
    })
}

export default function FontAwesomeIconByString({
    faIcon,
    size = sizes.medium,
    marginRight = "7px"
}) {
    return faIcon && (<i className={
            `fa-${
                iconStyles.size[size]
            } fas fa-${faIcon}`
        }
        style={
            {marginRight, lineHeight: "normal"}
        }/>)
}
