import {sizes} from "../../constants/frontendConstants";
import {AntIconByString, iconStringNoIcon} from "./AntIcon";
import FontAwesomeIconByString from "./FontAwesome";

export default function IconFromString({
    faIcon,
    antIcon,
    size = sizes.medium,
    marginRight = "5px"
}) {
    if (antIcon && antIcon !== iconStringNoIcon) {
        return (
            <AntIconByString iconString={antIcon}
                size={size}/>
        )
    } else if (faIcon) {
        return (
            <FontAwesomeIconByString faIcon={faIcon}
                marginRight={marginRight}/>
        )
    }
}
