import * as icons from "@ant-design/icons";
import type { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import type {
  CSSProperties,
  ForwardRefExoticComponent,
  RefAttributes} from "react";
import {
  createElement
} from "react";

import type {SizeType } from "../../constants/frontendConstants";
import { sizes } from "../../constants/frontendConstants";

export const iconStringNoIcon = "noIcon";
export const iconStringToComponent: {
  [key: string]:
    | ForwardRefExoticComponent<
        Omit<AntdIconProps, "ref"> & RefAttributes<HTMLSpanElement>
      >
    | string;
} = {
  [iconStringNoIcon]: iconStringNoIcon,
};
// TODO render at build time
for (const [_icon, iconModule] of Object.entries(icons) as [
  string,
  ForwardRefExoticComponent<
    Omit<AntdIconProps, "ref"> & RefAttributes<HTMLSpanElement>
  >
][]) {
  iconStringToComponent[_icon] = iconModule;
}

const iconStyles: {
  [key in SizeType]: {
    fontSize: string;
  };
} = {
  extraSmall: {
    fontSize: "14px",
  },
  small: {
    fontSize: "20px",
  },
  medium: {
    fontSize: "22px",
  },
  large: {
    fontSize: "30px",
  },
};

export function AntIconByReactFunc({
  AntReactIcon,
  size = sizes.medium,
  spin,
  marginRight = "0px",
}: {
  AntReactIcon: ForwardRefExoticComponent<
    Omit<AntdIconProps, "ref"> & RefAttributes<HTMLSpanElement>
  >;
  size?: SizeType;
  spin?: boolean | undefined;
  marginRight?: string;
}) {
  return (
    AntReactIcon &&
    createElement(AntReactIcon, {
      style: {
        ...iconStyles[size],
        marginTop: "auto",
        marginBottom: "auto",
        marginRight,
        marginLeft: "unset",
      },
      ...(spin ? { spin } : {}),
    })
  );
}

export function AntIconByString({
  iconString,
  size = sizes.medium,
  spin,
  marginRight,
  style,
}: {
  iconString: string;
  size?: SizeType;
  spin?: boolean | undefined;
  marginRight?: string;
  style?: CSSProperties | undefined;
}) {
  const iconComponent = iconStringToComponent[iconString];
  if (!iconComponent || typeof iconComponent === "string") {
    return <></>;
  }
  return createElement(iconComponent, {
    style: {
      ...iconStyles[size],
      marginTop: "auto",
      marginBottom: "auto",
      marginRight,
      ...style,
    },
    ...(spin ? { spin } : {}),
  });
}
