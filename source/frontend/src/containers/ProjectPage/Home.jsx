import {Grid} from "@mui/material";
import {Card, Typography} from "antd";
import AntButton from "../../components/Buttons/AntButton";
import {buttonVariants} from "../../components/Buttons/AntButton";
import {buttonTypes} from "../../components/Buttons/AntButton";

export default function ProjectHomePage() {
    return (<Grid container>
        <Grid item
            sm={12}>
            <Typography.Title level={2}>
                Revolutionize Your Trading Strategy with Cutting-Edge Automation Solutions
            </Typography.Title>
        </Grid>
        <Grid item
            sm={12}
            md={4}>
            <Card>
                <Typography.Title level={2}>
                    Custom Trading Bot: Automate Your Strategy and Boost Your Trading Success
                </Typography.Title>
                <Typography.Paragraph>
                    Unlock the power of automation with our custom trading bot.
                                                                                                                        Designed for both traders seeking to streamline their strategy and startups looking
                                                                                                                        to provide cutting-edge trading solutions to their customers.
                </Typography.Paragraph>
                <AntButton buttonVariant={
                        buttonVariants.primary
                    }
                    buttonType={
                        buttonTypes.success
                }>
                    Transform Your Trading Today!
                </AntButton>
            </Card>
        </Grid>
        <Grid item
            sm={12}
            md={4}>
            <Card>
                <Typography.Title level={2}>
                    Cloud-Based Trading Bot Deployment: Hassle-Free Automation for Your Strategy
                </Typography.Title>
                <Typography.Paragraph>
                    Experience seamless trading bot deployment in the cloud.
                                                                                                                                            Let our experts handle maintenance and updates, while you focus on maximizing your profits.
                </Typography.Paragraph>
                <AntButton buttonVariant={
                        buttonVariants.primary
                    }
                    buttonType={
                        buttonTypes.success
                }>
                    Deploy Your Bot in the Cloud Now!
                </AntButton>
            </Card>
        </Grid>
        <Grid item
            sm={12}
            md={4}>
            <Card>
                Download Your Free Trading Bot: Empower Your Trading Journey
            </Card>
            <Typography.Paragraph>
                Gain a competitive edge with our powerful trading bot, available for free.
                                Take control of your trading decisions and unlock new possibilities.
            </Typography.Paragraph>
            <AntButton buttonVariant={
                    buttonVariants.primary
                }
                buttonType={
                    buttonTypes.success
            }>
                Get Your Free Trading Bot Today!
            </AntButton>
        </Grid>
    </Grid>)
}
