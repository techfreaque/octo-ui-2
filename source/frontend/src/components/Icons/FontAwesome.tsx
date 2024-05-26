import type { IconProp, SizeProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { CSSProperties } from "react";
import { createElement } from "react";

import type { SizeType } from "../../constants/frontendConstants";
import { sizes } from "../../constants/frontendConstants";

const iconStyles: {
  [key in SizeType]: SizeProp | undefined;
} = {
  extraSmall: undefined,
  small: undefined,
  medium: "xl",
  large: "2x",
};

export function FaIconByReactFunc({
  icon,
  size = sizes.medium,
  spin = false,
  marginRight = "0px",
}: {
  icon: IconProp;
  size?: SizeType;
  spin?: boolean | undefined;
  marginRight?: string;
}) {
  const sizeProp = iconStyles[size];
  return (
    icon &&
    createElement(FontAwesomeIcon, {
      ...(sizeProp ? { size: sizeProp } : {}),
      icon,
      spin,
      style: {
        marginRight,
        marginTop: "auto",
        marginBottom: "auto",
      },
    })
  );
}

export default function FontAwesomeIconByString({
  faIcon,
  size = sizes.medium,
  marginRight = "7px",
  spin,
  style,
}: {
  faIcon: string;
  size?: SizeType;
  marginRight?: string;
  spin?: boolean | undefined;
  style?: CSSProperties | undefined;
}) {
  const className = spin
    ? `fa-spin fa-${iconStyles[size]} far fa-${faIcon}`
    : `fa-${iconStyles[size]} fas fa-${faIcon}`;
  return faIcon ? (
    <i
      className={className}
      style={{ marginRight, lineHeight: "normal", ...style }}
    />
  ) : (
    <></>
  );
}
