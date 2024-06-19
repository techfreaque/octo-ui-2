import { CloseOutlined } from "@ant-design/icons";
import { Avatar, Modal, Tooltip } from "antd";
import type { AvatarSize } from "antd/es/avatar/AvatarContext";
import type { CSSProperties, Dispatch, SetStateAction } from "react";
import { useState } from "react";

import type {
  ButtonSizeType,
  ButtonType,
  ButtonVariantType,
} from "../../../components/Buttons/AntButton";
import AntButton, {
  buttonSizes,
  buttonTypes,
  buttonVariants,
} from "../../../components/Buttons/AntButton";
import IconFromString from "../../../components/Icons/IconFromString";
import { sizes } from "../../../constants/frontendConstants";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import type { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";

export default function ButtonWithModal({
  title,
  content,
  antIcon,
  faIcon,
  iconOnly,
  displayAsAvatar,
  width,
  open,
  setOpen,
  iconStyle,
  buttonVariant = buttonVariants.text,
  size = buttonSizes.small,
  buttonType = buttonTypes.success,
  buttonStyle,
}: UiLayoutPageLayoutType & {
  content?: UiLayoutPageLayoutType[] | undefined;
  width?: number | string;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  iconStyle?: CSSProperties;
  buttonVariant?: ButtonVariantType;
  size?: ButtonSizeType;
  buttonType?: ButtonType;
  buttonStyle?: CSSProperties;
}) {
  const [_open, _setOpen] = useState<boolean>(false);
  const actualOpen = open || _open;
  const actualSetOpen = setOpen || _setOpen;
  const handleOpen = () => actualSetOpen(true);
  const handleClose = () => actualSetOpen(false);
  return (
    <div
      style={{
        marginTop: "auto",
        marginBottom: "auto",
      }}
    >
      <Tooltip placement="top" title={title} arrow={false}>
        <div>
          <AntButton
            onClick={handleOpen}
            buttonType={buttonType}
            buttonVariant={buttonVariant}
            style={buttonStyle}
            size={size}
          >
            <>
              {displayAsAvatar ? (
                <>
                  <Avatar
                    onClick={handleOpen}
                    style={{ margin: "auto" }}
                    size={sizes.small as AvatarSize}
                    icon={
                      <IconFromString
                        faIcon={faIcon}
                        antIcon={antIcon}
                        style={iconStyle}
                        marginRight={"0px"}
                      />
                    }
                  />
                  {!iconOnly && title}
                </>
              ) : (
                <IconFromString
                  faIcon={faIcon}
                  style={iconStyle}
                  antIcon={antIcon}
                  marginRight={"0px"}
                />
              )}
              {!iconOnly && title}
            </>
          </AntButton>
        </div>
      </Tooltip>
      {actualOpen && (
        <ModalContent
          open={actualOpen}
          width={width}
          handleClose={handleClose}
          content={content}
        />
      )}
    </div>
  );
}

function ModalContent({
  open,
  handleClose,
  content,
  width = 1000,
}: {
  open: boolean;
  handleClose: () => void;
  content: UiLayoutPageLayoutType[] | undefined;
  width: number | string | undefined;
}) {
  const botColors = useBotColorsContext();
  return (
    <Modal
      open={open}
      onCancel={handleClose}
      width={width}
      centered
      footer={null}
      closable={true}
      closeIcon={
        <CloseOutlined
          style={{
            fontSize: "40px",
            height: "40px",
            color: botColors?.warning,
          }}
        />
      }
      // closable={false}
      keyboard
      zIndex={1000}
    >
      <div style={{ padding: "20px 32px 0 32px" }}>
        {content && <AppWidgets layout={content} />}
      </div>
    </Modal>
  );
}
