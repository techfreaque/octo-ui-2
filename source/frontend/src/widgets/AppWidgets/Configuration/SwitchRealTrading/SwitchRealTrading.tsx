import {
  DollarOutlined,
  PauseOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import { Alert, Space, Tooltip, Typography } from "antd";
import { t } from "i18next";
import { useMemo, useState } from "react";
import { Trans } from "react-i18next";

import { realTradingSwitch } from "../../../../api/actions";
import AntButton, {
  buttonTypes,
} from "../../../../components/Buttons/AntButton";
import { AntIconByReactFunc } from "../../../../components/Icons/AntIcon";
import { projectName, sizes } from "../../../../constants/frontendConstants";
import { useBotDomainContext } from "../../../../context/config/BotDomainProvider";
import { useBotInfoContext } from "../../../../context/data/BotInfoProvider";

const { Paragraph, Title } = Typography;

export default function RealTradingSwitch() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const botDomain = useBotDomainContext();
  const botInfo = useBotInfoContext();
  const isRealTrading =
    botInfo?.current_profile?.config.trader.enabled || false;
  const isSimulatedTrading =
    botInfo?.current_profile?.config["trader-simulator"].enabled;
  const title = isRealTrading
    ? t("realTradingSwitch.real-trading")
    : isSimulatedTrading
      ? t("realTradingSwitch.simulated-trading")
      : t("realTradingSwitch.trading-paused");
  return useMemo(() => {
    const icon = isRealTrading ? (
      <AntIconByReactFunc AntReactIcon={DollarOutlined} size={sizes.medium} />
    ) : isSimulatedTrading ? (
      <AntIconByReactFunc AntReactIcon={RobotOutlined} size={sizes.medium} />
    ) : (
      <AntIconByReactFunc AntReactIcon={PauseOutlined} size={sizes.medium} />
    );
    return (
      <div
        style={{
          margin: "auto",
          height: "100%",
        }}
      >
        <Tooltip placement="top" title={title} arrow={false}>
          <div>
            <AntButton onClick={handleOpen} buttonVariant="text">
              {icon}
            </AntButton>
          </div>
        </Tooltip>
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Title level={3}>
              {t("realTradingSwitch.currently-using-tradingType", {
                tradingType: title,
              })}
            </Title>
            {isRealTrading ? (
              <>
                <Paragraph>
                  {t(
                    "realTradingSwitch.by-switching-to-simulated-trading-projectName-will-only-use-its-simulation-mode-on-real-market-conditions",
                    { projectName },
                  )}
                </Paragraph>
                <Paragraph>
                  {t(
                    "realTradingSwitch.it-will-no-longer-create-trades-with-your-exchange-account-it-will-use-a-simulated-portfolio-managed-by-projectName",
                    { projectName },
                  )}
                </Paragraph>
              </>
            ) : (
              <Paragraph>
                {t(
                  "realTradingSwitch.by-switching-to-real-trading-projectName-will-use-your-real-funds",
                  { projectName },
                )}
              </Paragraph>
            )}
            <Alert
              banner
              style={{ margin: "20px 0 30px 0" }}
              message={t(
                "realTradingSwitch.warning-the-switch-button-will-also-restart-projectName",
                { projectName },
              )}
            />
            <div style={{ float: "right" }}>
              <Space>
                <AntButton
                  onClick={handleClose}
                  style={{ marginRight: "5px" }}
                  buttonType={buttonTypes.primary}
                >
                  <Trans i18nKey="realTradingSwitch.cancel" />
                </AntButton>
                <AntButton
                  onClick={() => realTradingSwitch(botDomain, isRealTrading)}
                  buttonType={buttonTypes.primary}
                  buttonVariant="primary"
                >
                  {isRealTrading
                    ? t("realTradingSwitch.switch-to-simulated-trading")
                    : t("realTradingSwitch.switch-to-real-trading")}
                </AntButton>
              </Space>
            </div>
          </Box>
        </Modal>
      </div>
    );
  }, [botDomain, isRealTrading, isSimulatedTrading, open, title]);
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 550,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  color: "white",
  p: 4,
};
