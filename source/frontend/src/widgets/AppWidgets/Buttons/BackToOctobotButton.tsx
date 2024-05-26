import { ArrowLeftOutlined } from "@ant-design/icons";
import type { MouseEvent } from "react";
import { Trans } from "react-i18next";

import AntButton, {
  buttonVariants,
} from "../../../components/Buttons/AntButton";
import { backendRoutes } from "../../../constants/backendConstants";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { useIsDemoMode } from "../../../context/data/BotInfoProvider";

export default function BackToOctobotButton({
  onClick,
}: {
  onClick?: ((event: MouseEvent) => void) | undefined;
}) {
  const isDemo = useIsDemoMode();
  const botDomain = useBotDomainContext();
  return (
    <AntButton
      onClick={onClick}
      buttonVariant={buttonVariants.outline}
      block={true}
      target="blank"
      disabled={isDemo}
      icon={<ArrowLeftOutlined height="24px" width="24px" />}
      href={`${botDomain}${backendRoutes.octobotHome}`}
    >
      <Trans i18nKey="powerMenu.backToOctoBot" />
    </AntButton>
  );
}
