import { PoweroffOutlined } from "@ant-design/icons";
import { Dropdown, Tooltip } from "antd";
import type { ItemType } from "antd/es/menu/interface";
import { useState } from "react";
import { Trans } from "react-i18next";

import AntButton, {
  buttonVariants,
} from "../../../../components/Buttons/AntButton";
import { useBotDomainContext } from "../../../../context/config/BotDomainProvider";
import {
  useBotInfoContext,
  useIsDemoMode,
} from "../../../../context/data/BotInfoProvider";
import ColorModeSwitch from "../../Buttons/ColorModeSwitcher";
import LanguageSwitch from "../../Buttons/LanguageSwitch";
import LoginButton from "../../Buttons/LoginButton";
import LogoutButton from "../../Buttons/LogoutButton";
import RestartBotButton from "../../Buttons/RestartBotButton";
import StopBotButton from "../../Buttons/StopBotButton";
import UpdateBotButton from "../../Buttons/UpdateBotButton";

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
    { key: "language", label: <LanguageSwitch /> },
  ];
  if (botInfo?.can_logout) {
    items.unshift({
      key: "logout",
      label: <LogoutButton onClick={handleClose} />,
    });
  }
  return (
    <Dropdown
      onOpenChange={(state) => {
        setOpen(state);
      }}
      open={open}
      destroyPopupOnHide={true}
      menu={{
        items,
      }}
      overlayStyle={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
