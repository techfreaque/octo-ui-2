import {Grid} from "@mui/material";
import {Card, Typography} from "antd";
import AntButton from "../../../components/Buttons/AntButton";
import {buttonVariants} from "../../../components/Buttons/AntButton";
import {buttonTypes} from "../../../components/Buttons/AntButton";
import {CloudDownloadOutlined, CloudServerOutlined, RocketOutlined, ThunderboltOutlined} from "@ant-design/icons";
import {projectDownloadUrl} from "../../../constants/frontendConstants";

export default function ProjectHomePage() {
    return (
        <Grid container
            style={
                {textAlign: "center"}
            }
            spacing={2}>
            <Grid item
                sm={12}>
                <Typography.Title level={2}>
                    Revolutionize Your Trading Strategy with Cutting-Edge Automation Solutions
                </Typography.Title>
                <Typography.Paragraph>
                    Are you tired of outdated trading strategies that fail to keep up with the fast-paced market?
                </Typography.Paragraph>
                <Typography.Paragraph>
                    It's time to revolutionize your approach with our advanced automation solutions.
                </Typography.Paragraph>
                <Typography.Paragraph>
                    By harnessing cutting-edge technology, our custom trading bot empowers you to stay ahead of the curve and optimize your trading strategy like never before.
                </Typography.Paragraph>
                <Typography.Paragraph>
                    Say goodbye to manual execution and hello to streamlined efficiency.
                                    Take the leap into the future of trading and unlock new possibilities for success.
                </Typography.Paragraph>
            </Grid>
            <Grid item
                sm={12}
                md={6}>
                <Card style={
                    {height: "100%"}
                }>
                    <RocketOutlined style={
                        {fontSize: "60px"}
                    }/>
                    <TitleSubTitleCombo title="Get Your Custom Trading Bot" subTitle="Automate Your Strategy and Boost Your Trading Success"/>
                    <Typography.Paragraph>
                        Unlock the power of automation with your own custom trading bot.
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        Designed for both traders seeking to streamline their strategy and startups looking to provide cutting-edge trading solutions to their customers.
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        Get in touch with a strategy developer today!
                    </Typography.Paragraph>
                    <AntButton buttonVariant={
                            buttonVariants.primary
                        }
                        style={
                            {margin: "auto"}
                        }
                        block={true}
                        buttonType={
                            buttonTypes.success
                    }>
                        Transform Your Trading Today!
                    </AntButton>
                </Card>
            </Grid>
            <Grid item
                sm={12}
                md={6}>
                <Card style={
                    {
                        height: "100%",
                        textAlign: "center"
                    }
                }>
                    <CloudServerOutlined style={
                        {fontSize: "60px"}
                    }/>
                    <TitleSubTitleCombo title="Cloud-Based Trading Bot Deployment" subTitle="Streamline Your Strategy with Ease"/>
                    <Typography.Paragraph>
                        Experience seamless deployment of your trading bot in the cloud.
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        Leave maintenance and updates to our team of experts while you focus on maximizing your profits.
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        With hassle-free management, you can unleash the full potential of your trading strategy.
                    </Typography.Paragraph>
                    <AntButton buttonVariant={
                            buttonVariants.primary
                        }
                        style={
                            {margin: "auto"}
                        }
                        block={true}
                        buttonType={
                            buttonTypes.success
                    }>
                        Deploy Your Bot in the Cloud Now!
                    </AntButton>
                </Card>
            </Grid>
            <Grid item
                sm={12}
                md={6}>
                <Card style={
                    {height: "100%"}
                }>
                    <CloudDownloadOutlined style={
                        {fontSize: "60px"}
                    }/>
                    <TitleSubTitleCombo title="Download Your Free Trading Bot" subTitle="Empower Your Trading Journey"/>
                    <Typography.Paragraph>
                        Gain a competitive edge with our powerful trading bot, available for free.
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        Take control of your trading decisions and unlock new possibilities.
                    </Typography.Paragraph>
                    <AntButton buttonVariant={
                            buttonVariants.primary
                        }
                        block={true}
                        style={
                            {margin: "auto"}
                        }
                        href={projectDownloadUrl}
                        target="blank"
                        buttonType={
                            buttonTypes.success
                    }>
                        Get Your Free Trading Bot Today!
                    </AntButton>
                </Card>
            </Grid>
            <Grid item
                sm={12}
                md={6}>
                <Card style={
                    {height: "100%"}
                }>
                    <ThunderboltOutlined style={
                        {fontSize: "60px"}
                    }/>
                    <TitleSubTitleCombo title="Join the community" subTitle="Access Premium Strategies and Exclusive Support"/>
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
            </Grid>
        </Grid>
    )
}


function TitleSubTitleCombo({title, subTitle}) {
    return (
        <>
            <Typography.Title level={2}
                style={
                    {marginBottom: "0px"}
            }>
                {title} </Typography.Title>
            <Typography.Title level={3}
                style={
                    {marginTop: "0px"}
            }>
                {subTitle} </Typography.Title>
        </>
    )
}
