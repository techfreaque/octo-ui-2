import { Button, ConfigProvider } from "antd";
import { useBotColorsContext } from "../../context/config/BotColorsProvider";
import IconFromString from "../Icons/IconFromString";
import { SizeType, sizes } from "../../constants/frontendConstants";
import { AntIconByReactFunc } from "../Icons/AntIcon";
import { FaIconByReactFunc, MuiIconByReactFunc } from "../Icons/FontAwesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";

import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";
import {
  CSSProperties,
  ForwardRefExoticComponent,
  HTMLAttributeAnchorTarget,
  RefAttributes,
} from "react";

export type ButtonType =
  | "success"
  | "black"
  | "warning"
  | "error"
  | "primary"
  | "white"
  | "font"
  | "fontActive"
  | "fontSecondary";

export const buttonTypes: { [key in ButtonType]: ButtonType } = {
  success: "success",
  black: "black",
  warning: "warning",
  error: "error",
  primary: "primary",
  white: "white",
  font: "font",
  fontActive: "fontActive",
  fontSecondary: "fontSecondary",
};

export type ButtonVariantType = "primary" | "outline" | "text";

export const buttonVariants: {
  [key in ButtonVariantType]: ButtonVariantType;
} = {
  primary: "primary",
  outline: "outline",
  text: "text",
};

export type ButtonSizeType = "small" | "middle" | "large";

export const buttonSizes: { [key in ButtonSizeType]: ButtonSizeType } = {
  small: "small",
  middle: "middle",
  large: "large",
};

export default function AntButton({
  buttonType = buttonTypes.success,
  colorType = buttonTypes.font,
  onClick,
  style,
  buttonVariant = buttonVariants.outline,
  size = buttonSizes.middle,
  block = false,
  disabled = false,
  iconSize = sizes.small,
  // icon components
  faIconComponent,
  antIconComponent,
  muiIconComponent,
  // string icons
  faIcon,
  antIcon,
  icon,
  selected,

  spin,

  marginRight = "0px",

  href,
  children,
  noIconMargin = false,
  spanStyle = {},
  target,
  className,
}: {
  buttonType?: ButtonType;
  colorType?: ButtonType;
  onClick?: () => void;
  style?: CSSProperties | undefined;
  buttonVariant?: ButtonVariantType;
  size?: ButtonSizeType;
  block?: boolean;
  disabled?: boolean;
  iconSize?: SizeType;
  // icon components
  faIconComponent?: IconDefinition;
  muiIconComponent?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  antIconComponent?: ForwardRefExoticComponent<
    Omit<AntdIconProps, "ref"> & RefAttributes<HTMLSpanElement>
  >;
  // string icons
  faIcon?: string;
  antIcon?: string;
  icon?: JSX.Element;
  selected?: boolean;

  spin?: boolean;

  marginRight?: string;

  href?: string;
  children?: JSX.Element | string;
  noIconMargin?: boolean;
  spanStyle?: CSSProperties | undefined;
  target?: HTMLAttributeAnchorTarget | undefined;
  className?: string | undefined;
}) {
  const botColors = useBotColorsContext();
  const _style: CSSProperties = block
    ? {
        // justifyContent: "center"
      }
    : {};
  if (buttonType === buttonTypes.black) {
    _style.color = botColors?.white;
  }
  const theme = {
    token: {
      colorError: botColors[buttonType],
      colorPrimary: botColors[buttonType],
      colorText: botColors[colorType],
    },
  };
  if (buttonVariant === buttonVariants.text) {
    _style.padding = "0px 8px";
  }

  if (selected) {
    _style.color = botColors?.fontActive;
  }
  if (href) {
    _style.width = "fit-content";
  }

  const _spanStyle = spanStyle;
  if (buttonVariant === buttonVariants.text) {
    _spanStyle.display = "flex";
  } else {
    _spanStyle.height = "6px";
    _spanStyle.lineHeight = "5px";
  }

  const iconMargin = !noIconMargin && children ? "5px" : "0px";
  return (
    <ConfigProvider theme={theme}>
      <Button
        className={className}
        icon={
          <>
            {(faIcon || antIcon) && (
              <IconFromString
                faIcon={faIcon}
                antIcon={antIcon}
                size={iconSize}
                marginRight={iconMargin}
                spin={spin}
              />
            )}
            {antIconComponent && (
              <AntIconByReactFunc
                AntReactIcon={antIconComponent}
                size={iconSize}
                marginRight={iconMargin}
                spin={spin}
              />
            )}
            {faIconComponent && (
              <FaIconByReactFunc
                icon={faIconComponent}
                size={iconSize}
                marginRight={iconMargin}
                spin={spin}
              />
            )}
            {muiIconComponent && (
              <MuiIconByReactFunc
                icon={muiIconComponent}
                size={iconSize}
                marginRight={iconMargin}
                spin={spin}
              />
            )}
            {icon}
          </>
        }
        danger={buttonVariant === buttonVariants.outline}
        type={
          buttonVariant === buttonVariants.outline
            ? "default"
            : (buttonVariant as "text" | "primary")
        }
        block={block}
        disabled={disabled}
        onClick={onClick}
        href={href}
        size={size}
        target={target}
        style={{
          marginRight,
          marginTop: "auto",
          marginBottom: "auto",
          display: "flex",
          textDecoration: "none",
          ..._style,
          ...style,
        }}
      >
        <span
          style={{
            margin: "auto",
            ..._spanStyle,
          }}
        >
          {children}
        </span>
      </Button>
    </ConfigProvider>
  );
}
