import RestartBotButton from "../../Buttons/RestartBotButton";
import UpdateBotButton from "../../Buttons/UpdateBotButton";
import StopBotButton from "../../Buttons/StopBotButton";
import LogoutButton from "../../Buttons/LogoutButton";
import { Dropdown, Tooltip, Button } from "antd";
import { useBotDomainContext } from "../../../../context/config/BotDomainProvider";
import { useState } from "react";
import {
  useBotInfoContext,
  useIsDemoMode,
} from "../../../../context/data/BotInfoProvider";
import { PoweroffOutlined } from "@ant-design/icons";
import { Trans } from "react-i18next";
import AntButton, {
  buttonVariants,
} from "../../../../components/Buttons/AntButton";
import ColorModeSwitch from "../../Buttons/ColorModeSwitcher";
import LoginButton from "../../Buttons/LoginButton";
import { ItemType } from "antd/es/menu/hooks/useItems";

export default function PowerMenu() {
  const botDomain = useBotDomainContext();
  const [open, setOpen] = useState<boolean>(false);
  const botInfo = useBotInfoContext();
  const handleClose = () => setOpen(false);
  const isDemo = useIsDemoMode();
  const items: ItemType[] = [
    {
      key: "login",
      label: <LoginButton />,
    },
    {
      key: "restart",
      label: <RestartBotButton onClick={handleClose} />,
    },
    {
      key: "update",
      label: <UpdateBotButton onClick={handleClose} />,
    },
    {
      key: "stop",
      label: <StopBotButton onClick={handleClose} />,
    },
    {
      key: "colorMode",
      label: <ColorModeSwitch onClick={handleClose} />,
    },
    {
      key: "back",
      label: (
        <AntButton
          onClick={handleClose}
          buttonVariant={buttonVariants.outline}
          block={true}
          target="blank"
          disabled={isDemo}
          href={`${botDomain}/home`}
        >
          <Trans i18nKey="buttons.backToOctoBot" />
        </AntButton>
      ),
    },
  ];
  if (botInfo?.can_logout) {
    items.unshift({
      key: "logout",
      label: <LogoutButton onClick={handleClose} />,
    });
  }
  return (
    <Dropdown
      onOpenChange={(state) => setOpen(state)}
      open={open}
      menu={{
        items,
      }}
      overlayStyle={{
        // minWidth: "150px",
        // width: "150px",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: botColors?.background
      }}
      trigger={["click"]}
      placement="topRight"
      arrow
    >
      <Tooltip
        placement="topRight"
        title={<Trans i18nKey="modal.powerMenuTooltip" />}
        arrow={false}
      >
        <div>
          <AntButton buttonVariant="text">
            <PoweroffOutlined style={{ fontSize: "22px" }} />
          </AntButton>
        </div>
      </Tooltip>
    </Dropdown>
  );
}
