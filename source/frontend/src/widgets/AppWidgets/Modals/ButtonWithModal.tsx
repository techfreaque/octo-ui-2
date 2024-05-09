import { CSSProperties, Dispatch, SetStateAction, useState } from "react";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";
import IconFromString from "../../../components/Icons/IconFromString";
import { Tooltip, Modal, Avatar } from "antd";
import AntButton, {
  ButtonSizeType,
  ButtonType,
  ButtonVariantType,
  buttonSizes,
  buttonTypes,
  buttonVariants,
} from "../../../components/Buttons/AntButton";
import { CloseOutlined } from "@ant-design/icons";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import { sizes } from "../../../constants/frontendConstants";
import { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";
import { AvatarSize } from "antd/es/avatar/AvatarContext";

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
}: {
  title: JSX.Element | string;
  content?: UiLayoutPageLayoutType[] | undefined;
  antIcon?: string;
  faIcon?: string;
  iconOnly?: boolean;
  displayAsAvatar?: boolean;
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
        margin: "auto",
        height: "100%",
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
