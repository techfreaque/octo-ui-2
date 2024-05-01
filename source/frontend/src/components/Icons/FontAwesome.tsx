import { CSSProperties, createElement } from "react";
import { SizeType, sizes } from "../../constants/frontendConstants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp, SizeProp } from "@fortawesome/fontawesome-svg-core";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";

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
  spin?: boolean;
  marginRight?: string;
}) {
  return (
    icon &&
    createElement(FontAwesomeIcon, {
      ...(iconStyles[size] && { size: iconStyles[size] }),
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
export function MuiIconByReactFunc({
  icon,
  size = sizes.medium,
  spin = false,
  marginRight = "0px",
}: {
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  size?: SizeType;
  spin?: boolean;
  marginRight?: string;
}) {
  return createElement(icon, {
    ...(iconStyles[size] && { size: iconStyles[size] }),
    style: {
      marginRight,
      marginTop: "auto",
      marginBottom: "auto",
    },
  });
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
  spin?: boolean;
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
