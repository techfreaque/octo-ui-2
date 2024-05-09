import { CSSProperties } from "react";
import { SizeType, sizes } from "../../constants/frontendConstants";
import { AntIconByString, iconStringNoIcon } from "./AntIcon";
import FontAwesomeIconByString from "./FontAwesome";

export default function IconFromString({
  faIcon,
  antIcon,
  size = sizes.medium,
  marginRight = "0px",
  spin,
  style,
}: {
  style?: CSSProperties | undefined;
  size?: SizeType;
  faIcon?: string | undefined;
  antIcon?: string | undefined;
  spin?: boolean | undefined;
  marginRight?: string;
}): JSX.Element {
  if (antIcon && antIcon !== iconStringNoIcon) {
    return (
      <AntIconByString
        iconString={antIcon}
        style={style}
        size={size}
        spin={spin}
        marginRight={marginRight}
      />
    );
  } else if (faIcon) {
    return (
      <FontAwesomeIconByString
        faIcon={faIcon}
        style={style}
        marginRight={marginRight}
        spin={spin}
      />
    );
  } else return <></>;
}
