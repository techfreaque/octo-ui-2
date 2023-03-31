import * as icons from '@ant-design/icons';
import {createElement} from 'react';

export const iconStringNoIcon = "noIcon"
export const iconStringToComponent = {
    [iconStringNoIcon]: iconStringNoIcon
}
for (const [_icon, iconModule] of Object.entries(icons)) {
    iconStringToComponent[_icon] = iconModule
}

const iconSizes = {
    small: "small",
    medium: "medium",
    large: "large"
}

export const iconStyles = {
    size: {
        [iconSizes.small]: {
            fontSize: "20px",
            buttonSize: '35px'
        },
        [iconSizes.medium]: {
            fontSize: "22px",
            buttonSize: '40px'
        },
        [iconSizes.large]: {
            fontSize: "30px",
            buttonSize: '50px'
        }

    }

}


export function AntIconByString({
    iconString,
    size = iconStyles.size.medium
}) {
    return iconString && iconStringNoIcon !== iconString && createElement(iconStringToComponent[iconString], {
        style: {
            ...size
        }
    })
}
