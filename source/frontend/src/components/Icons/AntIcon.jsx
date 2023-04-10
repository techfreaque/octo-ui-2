import * as icons from '@ant-design/icons';
import {createElement} from 'react';
import {sizes} from '../../constants/frontendConstants';

export const iconStringNoIcon = "noIcon"
export const iconStringToComponent = {
    [iconStringNoIcon]: iconStringNoIcon
}
// TODO render at build time
for (const [_icon, iconModule] of Object.entries(icons)) {
    iconStringToComponent[_icon] = iconModule
}

const iconStyles = {
    size: {
        [sizes.small]: {
            fontSize: "20px"
        },
        [sizes.medium]: {
            fontSize: "22px"
        },
        [sizes.large]: {
            fontSize: "30px"
        }
    }

}

export function AntIconByReactFunc({
    AntReactIcon,
    size = sizes.medium,
    spin = false,
    marginRight= "0px"
}) {
    return AntReactIcon && createElement(AntReactIcon, {
        style: {
            ...iconStyles.size[size],
            marginTop: "auto",
            marginBottom: "auto",
            marginRight,
        },
        spin
    })
}

export function AntIconByString({
    iconString,
    size = sizes.medium,
    spin,
    marginRight
}) {
    return iconString && iconStringNoIcon !== iconString && createElement(iconStringToComponent[iconString], {
        style: {
            ...iconStyles.size[size],
            marginTop: "auto",
            marginBottom: "auto",
            marginRight,
        },
        spin
    })
}
