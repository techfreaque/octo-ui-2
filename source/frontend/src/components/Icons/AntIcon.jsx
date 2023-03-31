import * as icons from '@ant-design/icons';
import {createElement} from 'react';

const iconStringNoIcon = "noIcon"
export const iconStringToComponent = {
    iconStringNoIcon
}
for (const [_icon, iconModule] of Object.entries(icons)) {
    iconStringToComponent[_icon] = iconModule
}

export const buttonStyles = {
    size: {
        small: {fontSize: "20px",
                buttonSize: '35px'},
        medium: {fontSize: "22px",
                buttonSize: '40px'}, 
        large: {fontSize: "30px",
                buttonSize: '50px'}
    }

}


export function AntIconByString({iconString, size=buttonStyles.size.medium}) {
    return iconString && iconStringNoIcon !== iconString && createElement(iconStringToComponent[iconString], { style:{...size,} })
}
