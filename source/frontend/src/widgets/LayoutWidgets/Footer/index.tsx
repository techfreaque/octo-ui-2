import { useMemo, useState } from "react";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import {
  useBotInfoContext,
  useUpdateProjectInfoOpenContext,
} from "../../../context/data/BotInfoProvider";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";
import { Alert, Modal, Typography } from "antd";
import {
  projectDiscord,
  projectGithubUrl,
  projectName,
  projectYouTube,
  supportedOctoBotDistributions,
} from "../../../constants/frontendConstants";
import AntButton, { buttonSizes } from "../../../components/Buttons/AntButton";
import { RocketLaunchOutlined } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord,
  faGithub,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { useMediaQuery } from "@mui/material";
import { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";

export default function Footer({ rightContent }: UiLayoutPageLayoutType) {
  const botColors = useBotColorsContext();
  const botInfo = useBotInfoContext();
  const isSmallScreen = useMediaQuery("(max-width:950px)");
  return useMemo(
    () => (
      <div
        style={{
          borderTop: `solid 2px ${botColors?.border}`,
          backgroundColor: botColors?.background,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
          }}
        >
          <span style={{ margin: "auto 15px" }}>
            {`${botInfo?.octobot_project} ${botInfo?.octobot_version}`}
          </span>
          <UnsupportedWarning
            isSmallScreen={isSmallScreen}
            octobotProject={botInfo?.octobot_project}
          />
          {!isSmallScreen && (
            <div style={{ margin: "auto 15px" }}>
              <a href={projectGithubUrl} target="blank">
                <FontAwesomeIcon style={{ margin: "0 3px" }} icon={faGithub} />
                <span className="d-none d-md-inline">GitHub</span>
              </a>
              <a href={projectDiscord} target="blank">
                <FontAwesomeIcon style={{ margin: "0 3px" }} icon={faDiscord} />
                <span className="d-none d-md-inline">Discord</span>
              </a>
              <a href={projectYouTube} target="blank">
                <FontAwesomeIcon style={{ margin: "0 3px" }} icon={faYoutube} />
                <span className="d-none d-md-inline">YouTube</span>
              </a>
            </div>
          )}
          <span
            style={{
              marginLeft: "auto",
              marginBottom: "auto",
              marginTop: "auto",
              display: "flex",
            }}
          >
            {rightContent && <AppWidgets layout={rightContent} />}
          </span>
        </div>
      </div>
    ),
    [
      botColors.background,
      botColors.border,
      botInfo?.octobot_project,
      botInfo?.octobot_version,
      isSmallScreen,
      rightContent,
    ]
  );
}

function UnsupportedWarning({
  octobotProject,
  isSmallScreen,
}: {
  octobotProject: string | undefined;
  isSmallScreen: boolean;
}) {
  const [open, setOpen] = useState(false);
  const setProjectInfoOpen = useUpdateProjectInfoOpenContext();
  return useMemo(
    () =>
      octobotProject &&
      !supportedOctoBotDistributions.includes(octobotProject) ? (
        <>
          <Alert
            style={{
              cursor: "pointer",
              display: "flex",
            }}
            onClick={() => setOpen(true)}
            type="warning"
            showIcon={!isSmallScreen}
            message="This distribution isn't officially supported"
          />
          <Modal
            open={open}
            onCancel={() => setOpen(false)}
            title={"Get Octane today!"}
            centered
            width="800px"
            bodyStyle={{ display: "flex" }}
            footer={<></>}
          >
            <div>
              <Typography.Title level={2}>
                {`${octobotProject} is not officially supported yet by ${projectName}`}
              </Typography.Title>
              <Alert
                style={{ marginBottom: "20px" }}
                message={`${projectName} wont work as intended!`}
                type="warning"
                description={
                  <Typography.Paragraph>
                    For some features to work properly, {projectName} requires
                    modifications to the core of OctoBot which are not ported
                    back yet. It is recommended to use Octane, which is a
                    distribution of OctoBot.
                  </Typography.Paragraph>
                }
                showIcon={true}
              />
              <AntButton
                size={buttonSizes.large}
                style={{ margin: "auto" }}
                onClick={() => setProjectInfoOpen(true)}
                muiIconComponent={RocketLaunchOutlined}
              >
                Switch To Octane For Free
              </AntButton>
            </div>
          </Modal>
        </>
      ) : (
        <></>
      ),
    [isSmallScreen, octobotProject, open, setProjectInfoOpen]
  );
}
