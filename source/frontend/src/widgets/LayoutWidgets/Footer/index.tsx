import { RocketOutlined } from "@ant-design/icons";
import {
  faDiscord,
  faGithub,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMediaQuery } from "@mui/material";
import { Alert, Modal, Typography } from "antd";
import { t } from "i18next";
import { useMemo, useState } from "react";
import { Trans } from "react-i18next";

import AntButton, { buttonSizes } from "../../../components/Buttons/AntButton";
import {
  projectDiscord,
  projectGithubUrl,
  projectName,
  projectYouTube,
  supportedOctoBotDistributions,
} from "../../../constants/frontendConstants";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import type { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";
import {
  useBotInfoContext,
  useUpdateProjectInfoOpenContext,
} from "../../../context/data/BotInfoProvider";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";

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
              <a
                href={projectGithubUrl}
                target="blank"
                style={{ textDecoration: "none" }}
              >
                <FontAwesomeIcon style={{ margin: "0 3px" }} icon={faGithub} />
                <span className="d-none d-md-inline">
                  <Trans i18nKey="footer.github" />
                </span>
              </a>
              <a
                href={projectDiscord}
                target="blank"
                style={{ textDecoration: "none" }}
              >
                <FontAwesomeIcon style={{ margin: "0 3px" }} icon={faDiscord} />
                <span className="d-none d-md-inline">
                  <Trans i18nKey="footer.discord" />
                </span>
              </a>
              <a
                href={projectYouTube}
                target="blank"
                style={{ textDecoration: "none" }}
              >
                <FontAwesomeIcon style={{ margin: "0 3px" }} icon={faYoutube} />
                <span className="d-none d-md-inline">
                  <Trans i18nKey="footer.youtube" />
                </span>
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
            message={t(
              "footer.notSupportedOctoBotDistroWarning.this-distribution-isnt-officially-supported"
            )}
          />
          <Modal
            open={open}
            onCancel={() => setOpen(false)}
            title={t(
              "footer.notSupportedOctoBotDistroWarning.get-octane-today"
            )}
            centered
            width="800px"
            bodyStyle={{ display: "flex" }}
            footer={<></>}
          >
            <div>
              <Typography.Title level={2}>
                {t(
                  "footer.notSupportedOctoBotDistroWarning.octobotproject-is-not-officially-supported-yet-by-projectname",
                  { octobotProject, projectName }
                )}
              </Typography.Title>
              <Alert
                style={{ marginBottom: "20px" }}
                message={t(
                  "footer.notSupportedOctoBotDistroWarning.warning-title",
                  { projectName }
                )}
                type="warning"
                description={
                  <Typography.Paragraph>
                    {t(
                      "footer.notSupportedOctoBotDistroWarning.warningMessage",
                      { projectName }
                    )}
                  </Typography.Paragraph>
                }
                showIcon={true}
              />
              <AntButton
                size={buttonSizes.large}
                style={{ margin: "auto" }}
                onClick={() => setProjectInfoOpen(true)}
                antIconComponent={RocketOutlined}
              >
                {t(
                  "footer.notSupportedOctoBotDistroWarning.switch-to-projectname-for-free",
                  { projectName }
                )}
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
