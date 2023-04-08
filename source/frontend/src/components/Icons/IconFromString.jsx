import {sizes} from "../../constants/frontendConstants";
import {AntIconByString, iconStringNoIcon} from "./AntIcon";
import FontAwesomeIconByString from "./FontAwesome";

export default function IconFromString({
    faIcon,
    antIcon,
    size = sizes.medium,
    marginRight = "0px",
    spin
}) {
    if (antIcon && antIcon !== iconStringNoIcon) {
        return (
            <AntIconByString iconString={antIcon}
                size={size} spin={spin} marginRight={marginRight} />
        )
    } else if (faIcon) {
        return (
            <FontAwesomeIconByString faIcon={faIcon}
                marginRight={marginRight} spin={spin}/>
        )
    }
}
