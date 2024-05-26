import type { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Button, ConfigProvider, Tag } from "antd";
import type {
  CSSProperties,
  ForwardRefExoticComponent,
  HTMLAttributeAnchorTarget,
  MouseEvent,
  RefAttributes,
} from "react";

import type { SizeType } from "../../constants/frontendConstants";
import { sizes } from "../../constants/frontendConstants";
import { useBotColorsContext } from "../../context/config/BotColorsProvider";
import { AntIconByReactFunc } from "../Icons/AntIcon";
import { FaIconByReactFunc } from "../Icons/FontAwesome";
import IconFromString from "../Icons/IconFromString";

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
  onClick?: ((event: MouseEvent) => void) | undefined;
  style?: CSSProperties | undefined;
  buttonVariant?: ButtonVariantType;
  size?: ButtonSizeType;
  block?: boolean;
  disabled?: boolean | undefined;
  iconSize?: SizeType;
  // icon components
  faIconComponent?: IconDefinition | undefined;
  antIconComponent?:
    | ForwardRefExoticComponent<
        Omit<AntdIconProps, "ref"> & RefAttributes<HTMLSpanElement>
      >
    | undefined;
  // string icons
  faIcon?: string | undefined;
  antIcon?: string | undefined;
  icon?: JSX.Element | undefined;
  selected?: boolean | undefined;

  spin?: boolean;

  marginRight?: string;

  href?: string | undefined;
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
  if (!block) {
    _style.display = "flex";
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
  if (href && !block) {
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
        {...(className ? { className } : {})}
        styles={{
          icon: {
            margin: "auto",
          },
        }}
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
            {icon && (
              <div style={children ? { paddingRight: "5px" } : {}}>{icon}</div>
            )}
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
        {...(href ? { href } : {})}
        size={size}
        target={target}
        style={{
          marginRight,
          marginTop: "auto",
          marginBottom: "auto",
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

export function TagButton({
  children,
  canCLick,
  onClick,
}: {
  children: JSX.Element | string;
  canCLick?: boolean;
  onClick?: () => void;
}) {
  const botColors = useBotColorsContext();

  return (
    <Tag
      style={{
        color: canCLick ? botColors.fontActive : botColors.font,
        fontSize: "130%",
        padding: "5px",
        cursor: canCLick ? "pointer" : undefined,
      }}
      bordered={false}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}
