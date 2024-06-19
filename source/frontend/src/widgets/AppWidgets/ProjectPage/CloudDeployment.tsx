import { Grid } from "@mui/material";
import { Card, Tooltip, Typography } from "antd";
import { t } from "i18next";
import { useState } from "react";
import { Trans } from "react-i18next";

import AntButton, {
  buttonSizes,
  buttonTypes,
  buttonVariants,
} from "../../../components/Buttons/AntButton";
import { projectName } from "../../../constants/frontendConstants";
import ButtonWithModal from "../Modals/ButtonWithModal";
import { TitleSubTitleCombo } from "./Home";

export default function CloudDeploymentModal() {
  const [isOpen, setIsOpen] = useState(false);
  // return (<Tooltip title={"Cloud Deployment will be available soon!"}>
  //     <div>
  //         <AntButton style={
  //                 {margin: "auto"}
  //             }
  //             disabled={true}>
  //             Deploy Your Bot in the Cloud Now!
  //         </AntButton>
  //     </div>
  // </Tooltip>)
  return (
    <ButtonWithModal
      title={t(
        "projectInfoPage.cloudDeployment.deploy-your-bot-in-the-cloud-now",
      )}
      content={[
        {
          title: t("projectInfoPage.cloudDeployment.cloud-deployment"),
          component: "CloudDeployment",
        },
      ]}
      iconOnly={false}
      displayAsAvatar={false}
      buttonVariant={buttonVariants.outline}
      size={buttonSizes.middle}
      buttonStyle={{ margin: "auto" }}
      buttonType={buttonTypes.success}
      width={"1500"}
      open={isOpen}
      setOpen={setIsOpen}
    />
  );
}

export function CloudDeployment() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TitleSubTitleCombo
          center
          startLevel={1}
          title={t("projectInfoPage.cloudDeployment.cloud-trading-bot-servers")}
          subTitle={t(
            "projectInfoPage.cloudDeployment.effortless-and-fully-managed-solutions-for-your-trading-strategies",
          )}
        />
      </Grid>
      {getCloudOptions().map((option) => (
        <CloudOption option={option} key={option.key} />
      ))}
    </Grid>
  );
}

function CloudOption({ option }: { option: CloudOptionType }) {
  return (
    <Grid item sm={12} md={6} lg={4}>
      <Card style={{ height: "100%" }}>
        <TitleSubTitleCombo
          title={option.title}
          subTitle={t("projectInfoPage.cloudDeployment.instancePrice-month", {
            instancePrice: option.price,
          })}
        />
        <Typography.Paragraph>
          {t(
            "projectInfoPage.cloudDeployment.projectName-instances-instanceLimit",
            { projectName, instanceLimit: option.instances },
          )}
        </Typography.Paragraph>
        <Typography.Paragraph> {option.description} </Typography.Paragraph>
        <Tooltip
          title={t(
            "projectInfoPage.cloudDeployment.cloud-deployment-will-be-available-soon",
          )}
        >
          <div>
            <AntButton
              disabled
              target="blank"
              style={{ margin: "auto" }}
              size={buttonSizes.large}
            >
              <Trans i18nKey="projectInfoPage.cloudDeployment.select-and-configure" />
            </AntButton>
          </div>
        </Tooltip>
      </Card>
    </Grid>
  );
}

interface CloudOptionType {
  key: string;
  title: string;
  description: string;
  price: number;
  instances: string | number;
}

function getCloudOptions(): CloudOptionType[] {
  return [
    {
      key: "nano",
      title: t("projectInfoPage.cloudDeployment.sunny-nano"),
      description: t("projectInfoPage.cloudDeployment.sunny-nano-description"),
      price: 6,
      instances: 1,
    },
    {
      key: "micro",
      title: t("projectInfoPage.cloudDeployment.foggy-micro"),
      description: t("projectInfoPage.cloudDeployment.foggy-micro-description"),
      price: 12,
      instances: 2,
    },
    {
      key: "small",
      title: t("projectInfoPage.cloudDeployment.snow-small"),
      description: t("projectInfoPage.cloudDeployment.snow-small-description"),
      price: 20,
      instances: 4,
    },
    {
      key: "medium",
      title: t("projectInfoPage.cloudDeployment.ice-medium"),
      description: t("projectInfoPage.cloudDeployment.ice-medium-description"),
      price: 30,
      instances: t("projectInfoPage.cloudDeployment.no-limit"),
    },
    {
      key: "large",
      title: t("projectInfoPage.cloudDeployment.wind-large"),
      description: t("projectInfoPage.cloudDeployment.wind-large-description"),
      price: 60,
      instances: t("projectInfoPage.cloudDeployment.no-limit"),
    },
    {
      key: "xlarge",
      title: t("projectInfoPage.cloudDeployment.storm-x-large"),
      description: t(
        "projectInfoPage.cloudDeployment.storm-x-large-description",
      ),
      price: 90,
      instances: t("projectInfoPage.cloudDeployment.no-limit"),
    },
    {
      key: "xxlarge",
      title: t("projectInfoPage.cloudDeployment.flash-xx-large"),
      description: t(
        "projectInfoPage.cloudDeployment.flash-xx-large-description",
      ),
      price: 150,
      instances: t("projectInfoPage.cloudDeployment.no-limit"),
    },
    {
      key: "xxxlarge",
      title: t("projectInfoPage.cloudDeployment.tornado-xxx-large"),
      description: t(
        "projectInfoPage.cloudDeployment.tornado-xxx-large-description",
      ),
      price: 250,
      instances: t("projectInfoPage.cloudDeployment.no-limit"),
    },
  ];
}
