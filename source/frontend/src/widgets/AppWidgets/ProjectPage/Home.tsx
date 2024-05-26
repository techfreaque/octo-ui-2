import {
  CloudDownloadOutlined,
  CloudServerOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import {
  faDocker,
  faLinux,
  faWindows,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid } from "@mui/material";
import { Card, Typography } from "antd";
import { t } from "i18next";
import { Trans } from "react-i18next";

import AntButton, { buttonSizes } from "../../../components/Buttons/AntButton";
import {
  projectDownloadUrl,
  projectName,
} from "../../../constants/frontendConstants";
import {
  useIsDemoMode,
  useProjectInfoOpenContext,
  useUpdateProjectInfoOpenContext,
} from "../../../context/data/BotInfoProvider";
import ButtonWithModal from "../Modals/ButtonWithModal";
import logo from "../other/octane-logo.png";
import CloudDeploymentModal from "./CloudDeployment";

export function ProjectHomePageModal() {
  const projectInfoOpen = useProjectInfoOpenContext();
  const setProjectInfoOpen = useUpdateProjectInfoOpenContext();
  return (
    <ButtonWithModal
      title={t("projectInfoPage.about-the-project")}
      content={[
        {
          title: t("projectInfoPage.about-the-project"),
          component: "ProjectHomePage",
        },
      ]}
      antIcon={"BulbOutlined"}
      iconOnly={true}
      displayAsAvatar={false}
      width={"1500"}
      open={projectInfoOpen}
      setOpen={setProjectInfoOpen}
    />
  );
}

export default function ProjectHomePage() {
  const isDemo = useIsDemoMode();
  const setProjectInfoOpen = useUpdateProjectInfoOpenContext();
  return (
    <Grid container style={{ textAlign: "center" }} spacing={2}>
      <Grid item sm={12}>
        <Typography.Title
          level={1}
          style={{
            marginTop: "150px",
            marginBottom: "100px",
            display: "flex",
          }}
        >
          <span style={{ marginLeft: "auto" }}>
            <Trans i18nKey="projectInfoPage.welcomeMessage.welcome-to-the" />
          </span>
          <img
            height={"30px"}
            style={{ margin: "auto 10px" }}
            alt={t("projectInfoPage.welcomeMessage.projectname-logo", {
              projectName,
            })}
            src={logo}
          />
          <span style={{ marginRight: "auto" }}>
            <Trans i18nKey="projectInfoPage.welcomeMessage.project" />
          </span>
        </Typography.Title>
        {isDemo && (
          <AntButton
            style={{ margin: "auto" }}
            onClick={() => setProjectInfoOpen(false)}
            antIconComponent={RocketOutlined}
            size={buttonSizes.large}
          >
            <Trans i18nKey="projectInfoPage.try-the-demo-version" />
          </AntButton>
        )}
        <Typography.Title
          level={2}
          style={{
            marginTop: "150px",
            // marginBottom: "100px"
          }}
        >
          <Trans i18nKey="projectInfoPage.revolutionize-your-trading-strategy-with-cutting-edge-automation-solutions" />
        </Typography.Title>
        <Typography.Paragraph>
          <Trans i18nKey="projectInfoPage.are-you-tired-of-outdated-trading-strategies-that-fail-to-keep-up-with-the-fast-paced-market" />
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Trans i18nKey="projectInfoPage.it-and-apos-s-time-to-revolutionize-your-approach-with-our-advanced-automation-solutions" />
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Trans i18nKey="projectInfoPage.by-harnessing-cutting-edge-technology-our-custom-trading-bot-empowers-you-to-stay-ahead-of-the-curve-and-optimize-your-trading-strategy-like-never-before" />
        </Typography.Paragraph>
        <Typography.Paragraph style={{ marginBottom: "100px" }}>
          <Trans i18nKey="projectInfoPage.say-goodbye-to-manual-execution-and-hello-to-streamlined-efficiency-take-the-leap-into-the-future-of-trading-and-unlock-new-possibilities-for-success" />
        </Typography.Paragraph>
      </Grid>
      <Grid item xs={12}>
        <Typography.Title level={2} style={{ display: "flex" }}>
          <span style={{ marginLeft: "auto" }}>
            <Trans i18nKey="projectInfoPage.get-project-logo-now-message.get" />
          </span>
          <img
            height={"25px"}
            style={{ margin: "auto 10px" }}
            alt={t("projectInfoPage.welcomeMessage.projectname-logo", {
              projectName,
            })}
            src={logo}
          />
          <span style={{ marginRight: "auto" }}>
            <Trans i18nKey="projectInfoPage.get-project-logo-now-message.now" />
          </span>
        </Typography.Title>
      </Grid>
      <Grid item sm={12} md={4}>
        <Card style={{ height: "100%" }}>
          <RocketOutlined style={{ fontSize: "60px" }} />
          <TitleSubTitleCombo
            title={t("projectInfoPage.get-your-custom-trading-bot")}
            subTitle={t(
              "projectInfoPage.automate-your-strategy-and-boost-your-trading-success"
            )}
          />
          <Typography.Paragraph>
            <Trans i18nKey="projectInfoPage.unlock-the-power-of-automation-with-your-own-custom-trading-bot" />
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Trans i18nKey="projectInfoPage.designed-for-both-traders-seeking-to-streamline-their-strategy-and-startups-looking-to-provide-cutting-edge-trading-solutions-to-their-customers" />
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Trans i18nKey="projectInfoPage.get-in-touch-with-a-strategy-developer-today" />
          </Typography.Paragraph>
          <AntButton
            target="blank"
            href={`mailto:max@a42.ch?subject=${t(
              "projectInfoPage.lets-discuss-my-trading-bot-project"
            )}`}
            style={{ margin: "auto" }}
            block={true}
          >
            <Trans i18nKey="projectInfoPage.transform-your-trading-today" />
          </AntButton>
        </Card>
      </Grid>
      <Grid item sm={12} md={4}>
        <Card
          style={{
            height: "100%",
            textAlign: "center",
          }}
        >
          <CloudServerOutlined style={{ fontSize: "60px" }} />
          <TitleSubTitleCombo
            title={t("projectInfoPage.cloud-based-trading-bot-deployment")}
            subTitle={t("projectInfoPage.streamline-your-strategy-with-ease")}
          />
          <Typography.Paragraph>
            <Trans i18nKey="projectInfoPage.experience-seamless-deployment-of-your-trading-bot-in-the-cloud" />
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Trans i18nKey="projectInfoPage.leave-maintenance-and-updates-to-our-team-of-experts-while-you-focus-on-maximizing-your-profits" />
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Trans i18nKey="projectInfoPage.with-hassle-free-management-you-can-unleash-the-full-potential-of-your-trading-strategy" />
          </Typography.Paragraph>
          <CloudDeploymentModal />
        </Card>
      </Grid>
      <Grid item sm={12} md={4}>
        <Card style={{ height: "100%" }}>
          <CloudDownloadOutlined style={{ fontSize: "60px" }} />
          <TitleSubTitleCombo
            title={t('projectInfoPage.download-your-free-trading-bot')}
            subTitle={t('projectInfoPage.empower-your-trading-journey')}
          />
          <Typography.Paragraph>
            <Trans i18nKey="projectInfoPage.gain-a-competitive-edge-with-our-powerful-trading-bot-available-for-free" />
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Trans i18nKey="projectInfoPage.take-control-of-your-trading-decisions-and-unlock-new-possibilities" />
          </Typography.Paragraph>
          <div style={{ marginBottom: "20px" }}>
            <FontAwesomeIcon size="5x" icon={faDocker} />
            <FontAwesomeIcon
              style={{
                marginLeft: "10px",
                marginRight: "10px",
              }}
              size="5x"
              icon={faWindows}
            />
            <FontAwesomeIcon size="5x" icon={faLinux} />
          </div>
          <AntButton
            block={true}
            style={{ margin: "auto" }}
            href={projectDownloadUrl}
            target="blank"
          >
            <Trans i18nKey="projectInfoPage.get-your-free-trading-bot-today" />
          </AntButton>
        </Card>
      </Grid>
      {/* <Grid item
                sm={12}
                md={6}>
                <Card style={
                    {height: "100%"}
                }>
                    <ThunderboltOutlined style={
                        {fontSize: "60px"}
                    }/>
                    <TitleSubTitleCombo title="Get The Ultimate Edition" subTitle="Access Premium Strategies and Exclusive Support"/>
                    <Typography.Paragraph>
                        Unlock a wealth of premium strategies, apps, and our exclusive OctoBot distribution, all while becoming part of a thriving community.
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        Join now and receive top-tier support to enhance your trading experience.
                    </Typography.Paragraph>
                    <AntButton buttonVariant={
                            buttonVariants.primary
                        }
                        style={
                            {margin: "auto"}
                        }
                        buttonType={
                            buttonTypes.success
                        }
                        block={true}>

                        Get the ultimate version today!
                    </AntButton>
                </Card>
            </Grid> */}
      <Grid item xs={12} style={{ marginTop: "150px" }}>
        <Typography.Title level={2}>
          {t('projectInfoPage.a-special-thanks-to-all-open-source-projects-that-are-used-within-projectname', {projectName})}
        </Typography.Title>
        <TitleSubTitleCombo
          subTitle={t('projectInfoPage.the-kernel-and-backend-for-the-bot')}
          title={"OctoBot"}
          startLevel={3}
        />
        <Typography.Paragraph>
          <Trans i18nKey="projectInfoPage.without-octobot-the-project-would-be-nothing" />
          <AntButton
            style={{
              marginLeft: "auto",
              marginRight: "auto",
            }}
            href="https://octobot.online"
            target="blank"
          >
            <Trans i18nKey="projectInfoPage.check-out-and-support-the-octobot-project" />
          </AntButton>
        </Typography.Paragraph>
        <TitleSubTitleCombo
          subTitle={t('projectInfoPage.library-used-to-build-the-frontend')}
          title={"react.js"}
          startLevel={3}
        />
        <Typography.Paragraph>
          <Trans i18nKey="projectInfoPage.we-all-hate-facebook-but-react-is-nice" />
          <AntButton
            style={{
              marginLeft: "auto",
              marginRight: "auto",
            }}
            href="https://react.dev/"
            target="blank"
          >
            <Trans i18nKey="projectInfoPage.check-out-the-react-project" />
          </AntButton>
        </Typography.Paragraph>
        <TitleSubTitleCombo
          subTitle={t('projectInfoPage.charting-library')}
          title={t('projectInfoPage.plotly')}
          startLevel={3}
        />
        <Typography.Paragraph>
          <AntButton
            style={{
              marginLeft: "auto",
              marginRight: "auto",
            }}
            href="https://plotly.com/javascript/"
            target="blank"
          >
            <Trans i18nKey="projectInfoPage.check-out-the-plotly-project" />
          </AntButton>
        </Typography.Paragraph>
        <TitleSubTitleCombo
          subTitle={t('projectInfoPage.flow-chart-library-used-for-the-strategy-designer')}
          title={t('projectInfoPage.reactflow')}
          startLevel={3}
        />
        <Typography.Paragraph>
          <AntButton
            style={{
              marginLeft: "auto",
              marginRight: "auto",
            }}
            href="https://reactflow.dev"
            target="blank"
          >
            <Trans i18nKey="projectInfoPage.check-out-the-reactflow-project" />
          </AntButton>
        </Typography.Paragraph>
        <TitleSubTitleCombo
          subTitle={
            t('projectInfoPage.machine-learning-library-used-for-the-neural-net-evaluator')
          }
          title={"tensorflow"}
          startLevel={3}
        />
        <Typography.Paragraph>
          <Trans i18nKey="projectInfoPage.so-simple-to-use-and-yet-so-powerful" />
          <AntButton
            style={{
              marginLeft: "auto",
              marginRight: "auto",
            }}
            href="https://www.tensorflow.org"
            target="blank"
          >
            <Trans i18nKey="projectInfoPage.check-out-the-tensorflow-project" />
          </AntButton>
        </Typography.Paragraph>
        <Typography.Title level={3}>
          <Trans i18nKey="projectInfoPage.and-many-more-that-you-can-find-in-the-requirements-txt" />
        </Typography.Title>
      </Grid>
    </Grid>
  );
}

export function TitleSubTitleCombo({
  title,
  subTitle,
  startLevel = 2,
  center = false,
}: {
  title: JSX.Element | string;
  subTitle: JSX.Element | string;
  startLevel?: 2 | 1 | 3 | 4;
  center?: boolean;
}) {
  return (
    <>
      <Typography.Title
        level={startLevel}
        style={{ marginBottom: "0px", textAlign: center ? "center" : "unset" }}
      >
        {title}
      </Typography.Title>
      <Typography.Title
        level={(startLevel + 1) as 1 | 2 | 3 | 4 | 5}
        style={{ marginTop: "0px", textAlign: center ? "center" : "unset" }}
      >
        {subTitle}
      </Typography.Title>
    </>
  );
}
