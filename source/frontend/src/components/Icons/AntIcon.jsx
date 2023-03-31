import * as icons from '@ant-design/icons';
import {createElement} from 'react';
import { sizes } from '../../constants/frontendConstants';

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
            fontSize: "20px",
            buttonSize: '35px'
        },
        [sizes.medium]: {
            fontSize: "22px",
            buttonSize: '40px'
        },
        [sizes.large]: {
            fontSize: "30px",
            buttonSize: '50px'
        }

    }

}

export function AntIconByString({
    iconString,
    size = sizes.medium,
    marginRight = "5px"
}) {
    return iconString && iconStringNoIcon !== iconString && createElement(iconStringToComponent[iconString], {
        style: {
            ... iconStyles.size[size],
            marginRight
        }
    })
}
