import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import { useMemo, useState } from "react";
import { realTradingSwitch } from "../../../../api/actions";
import { useBotDomainContext } from "../../../../context/config/BotDomainProvider";
import { Space, Tooltip, Alert, Typography } from "antd";
import { sizes } from "../../../../constants/frontendConstants";
import {
  DollarOutlined,
  PauseOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { AntIconByReactFunc } from "../../../../components/Icons/AntIcon";
import AntButton, {
  buttonTypes,
} from "../../../../components/Buttons/AntButton";
import { useBotInfoContext } from "../../../../context/data/BotInfoProvider";

const { Paragraph, Title } = Typography;

export default function RealTradingSwitch() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const botDomain = useBotDomainContext();
  const botInfo = useBotInfoContext();
  const isRealTrading = botInfo?.current_profile?.config.trader.enabled;
  const isSimulatedTrading =
    botInfo?.current_profile?.config["trader-simulator"].enabled;
  const title = isRealTrading
    ? "Real trading"
    : isSimulatedTrading
    ? "Simulated trading"
    : "Trading paused";
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
              {}
            </AntButton>
          </div>
        </Tooltip>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby={"real-trading-switch-modal-title"}
        >
          <Box sx={style}>
            <Title level={3}>Currently using: {title}</Title>
            {isRealTrading ? (
              <>
                <Paragraph>
                  By switching to simulated trading, OctoBot will only use its
                  simulation mode on real market conditions.
                </Paragraph>
                <Paragraph>
                  It will no longer create trades with your exchange account, it
                  will use a simulated portfolio managed by OctoBot.
                </Paragraph>
              </>
            ) : (
              <Paragraph>
                By switching to real trading, OctoBot will use your real funds
              </Paragraph>
            )}
            <Alert
              banner
              style={{ margin: "20px 0 30px 0" }}
              message="Warning! The switch button will also restart OctoBot"
            />
            <div style={{ float: "right" }}>
              <Space>
                <AntButton
                  onClick={handleClose}
                  style={{ marginRight: "5px" }}
                  buttonType={buttonTypes.primary}
                >
                  Cancel
                </AntButton>
                <AntButton
                  onClick={() => realTradingSwitch(botDomain, isRealTrading)}
                  buttonType={buttonTypes.primary}
                  buttonVariant="primary"
                >
                  <>
                    Switch to
                    {isRealTrading ? " Simulated trading" : " Real trading"}
                  </>
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
