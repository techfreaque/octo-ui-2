import { Grid } from "@mui/material";
import { Card, Tooltip, Typography } from "antd";
import { useState } from "react";

import AntButton, {
  buttonSizes,
  buttonTypes,
  buttonVariants,
} from "../../../components/Buttons/AntButton";
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
      title={"Deploy Your Bot in the Cloud Now!"}
      content={[
        {
          title: "Cloud Deployment",
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
          title={"Cloud Trading Bot Servers"}
          subTitle={
            "Effortless and Fully Managed Solutions for Your Trading Strategies"
          }
        />
      </Grid>
      {cloudOptions.map((option) => (
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
          subTitle={`${option.price}$ / month`}
        />
        <Typography.Paragraph>
          Octane Instances: {option.instances}
        </Typography.Paragraph>
        <Typography.Paragraph> {option.description} </Typography.Paragraph>
        <Tooltip title={"Cloud Deployment will be available soon!"}>
          <div>
            <AntButton
              disabled
              target="blank"
              style={{ margin: "auto" }}
              size={buttonSizes.large}
            >
              Select and configure
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

const cloudOptions: CloudOptionType[] = [
  {
    key: "nano",
    title: "Sunny (Nano)",
    description:
      "The Nano server option provides a lightweight and cost-effective solution for running your trading bot. It offers a single instance, making it suitable for small-scale trading operations.",
    price: 6,
    instances: 1,
  },
  {
    key: "micro",
    title: "Foggy (Micro)",
    description:
      "The Micro server option is slightly more powerful than the Nano option, offering two instances for increased flexibility and performance. It is suitable for moderate trading volumes and strategies.",
    price: 12,
    instances: 2,
  },
  {
    key: "small",
    title: "Snow (Small)",
    description:
      "The Small server option provides scalability and cost-efficiency for your trading bot. With four instances, you can distribute workloads effectively and adapt to market changes with ease.",
    price: 20,
    instances: 4,
  },
  {
    key: "medium",
    title: "Ice (Medium)",
    description:
      "The Medium server option offers enhanced computing power and resources, making it suitable for demanding trading strategies and higher trading volumes. It provides a scalable solution with no instance limit.",
    price: 30,
    instances: "no limit",
  },
  {
    key: "large",
    title: "Wind (Large)",
    description:
      "The Large server option is optimized for high-performance trading. It provides ample computing power and resources, ensuring smooth execution of complex trading strategies. It offers a scalable solution with no limit on instances.",
    price: 60,
    instances: "no limit",
  },
  {
    key: "xlarge",
    title: "Storm (X Large)",
    description:
      "The X large server option is specifically designed for intensive trading operations. It offers significant computing power and resources, making it suitable for advanced trading strategies and high-frequency trading.",
    price: 90,
    instances: "no limit",
  },
  {
    key: "xxlarge",
    title: "Flash (XX Large)",
    description:
      "Unleash exceptional trading power with the Flash server option. Designed for intensive operations, it offers robust computing resources and unlimited instances. Execute advanced strategies and handle substantial trading volumes effortlessly, maximizing profitability.",
    price: 150,
    instances: "no limit",
  },
  {
    key: "xxxlarge",
    title: "Tornado (XXX Large)",
    description:
      "The XXX large server option is the most powerful and robust choice for running your trading bot. It provides unparalleled computing power and resources, enabling you to handle massive trading volumes and execute complex strategies with ease.",
    price: 250,
    instances: "no limit",
  },
];
