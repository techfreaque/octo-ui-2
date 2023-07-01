import {Grid} from "@mui/material";
import {Card, Tooltip, Typography} from "antd";
import AntButton from "../../../components/Buttons/AntButton";
import {CloudDownloadOutlined, CloudServerOutlined, RocketOutlined} from "@ant-design/icons";
import {projectDownloadUrl, projectName, sizes} from "../../../constants/frontendConstants";
import ButtonWithModal from "../Modals/ButtonWithModal";
import {useIsDemoMode, useProjectInfoOpenContext, useUpdateProjectInfoOpenContext} from "../../../context/data/BotInfoProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDocker, faLinux, faWindows} from "@fortawesome/free-brands-svg-icons";
import {RocketLaunchOutlined} from "@mui/icons-material";
import logo from "../other/octane-logo.png"
import CloudDeploymentModal from "./CloudDeployment";

export function ProjectHomePageModal() {
    const projectInfoOpen = useProjectInfoOpenContext()
    const setProjectInfoOpen = useUpdateProjectInfoOpenContext()
    return (
        <ButtonWithModal title={"About the Project"}
            content={
                [{
                        "component": "ProjectHomePage"
                    }]
            }
            antIcon={"BulbOutlined"}
            iconOnly={true}
            displayAsAvatar={false}
            width={"1500"}
            open={projectInfoOpen}
            setOpen={setProjectInfoOpen}/>
    )
}

export default function ProjectHomePage() {
    const isDemo = useIsDemoMode()
    const setProjectInfoOpen = useUpdateProjectInfoOpenContext()
    return (
        <Grid container
            style={
                {textAlign: "center"}
            }
            spacing={2}>
            <Grid item
                sm={12}>
                <Typography.Title level={1}
                    style={
                        {
                            marginTop: "150px",
                            marginBottom: "100px",
                            display: "flex"
                        }
                }>
                    <span style={
                        {marginLeft: "auto"}
                    }>
                        Welcome to the
                    </span>
                    <img height={"30px"}
                        style={
                            {margin: "auto 10px"}
                        }
                        alt="Octane Logo"
                        src={logo}/>
                    <span style={
                        {marginRight: "auto"}
                    }>
                        Project
                    </span>
                </Typography.Title>
                {
                isDemo && (
                    <AntButton style={
                            {margin: "auto"}
                        }
                        onClick={
                            () => setProjectInfoOpen(false)
                        }
                        antIconComponent={RocketOutlined}
                        size={
                            sizes.large
                    }>
                        Try the Demo Version
                    </AntButton>
                )
            }
                <Typography.Title level={2}
                    style={
                        {
                            marginTop: "150px",
                            // marginBottom: "100px"
                        }
                }>
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
                <Typography.Paragraph style={
                    {marginBottom: "100px"}
                }>
                    Say goodbye to manual execution and hello to streamlined efficiency.
                                                                                                                                                                                                                                                                Take the leap into the future of trading and unlock new possibilities for success.
                </Typography.Paragraph>
            </Grid>
            <Grid item
                xs={12}>
                <Typography.Title level={2}
                    style={
                        {display: "flex"}
                }>
                    <span style={
                        {marginLeft: "auto"}
                    }>
                        Get
                    </span>
                    <img height={"25px"}
                        style={
                            {margin: "auto 10px"}
                        }
                        alt="Octane Logo"
                        src={logo}/>
                    <span style={
                        {marginRight: "auto"}
                    }>
                        now!
                    </span>
                </Typography.Title>
            </Grid>
            <Grid item
                sm={12}
                md={4}>
                <Card style={
                    {height: "100%"}
                }>
                    <RocketLaunchOutlined style={
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
                    <AntButton target="blank"
                        href={"mailto:max@a42.ch?subject=Let's discuss my trading bot project!"}
                        style={
                            {margin: "auto"}
                        }
                        block={true}>
                        Transform Your Trading Today!
                    </AntButton>
                </Card>
            </Grid>
            <Grid item
                sm={12}
                md={4}>
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
                    <CloudDeploymentModal/>
                </Card>
            </Grid>
            <Grid item
                sm={12}
                md={4}>
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
                    <div style={
                        {marginBottom: "20px"}
                    }>
                        <FontAwesomeIcon size="5x"
                            icon={faDocker}/>
                        <FontAwesomeIcon style={
                                {
                                    marginLeft: "10px",
                                    marginRight: "10px"
                                }
                            }
                            size="5x"
                            icon={faWindows}/>
                        <FontAwesomeIcon size="5x"
                            icon={faLinux}/>
                    </div>
                    <AntButton block={true}
                        style={
                            {margin: "auto"}
                        }
                        href={projectDownloadUrl}
                        target="blank">
                        Get Your Free Trading Bot Today!
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
            <Grid item
                xs={12}
                style={
                    {marginTop: "150px"}
            }>
                <Typography.Title level={2}>
                    {
                    `A special thanks to all Open Source Projects that are used within ${projectName}`
                } </Typography.Title>
                <TitleSubTitleCombo subTitle={"The Kernel and Backend for the bot"}
                    title={"OctoBot"}
                    startLevel={3}/>
                <Typography.Paragraph>
                    Without OctoBot the project would be nothing
                    <AntButton style={
                            {
                                marginLeft: "auto",
                                marginRight: "auto"
                            }
                        }
                        href="https://octobot.online"
                        target="blank">
                        Check out and support the OctoBot Project
                    </AntButton>
                </Typography.Paragraph>
                <TitleSubTitleCombo subTitle={"Library used to build the frontend"}
                    title={"react.js"}
                    startLevel={3}/>
                <Typography.Paragraph>
                    We all hate FaceBook, but react is nice
                    <AntButton style={
                            {
                                marginLeft: "auto",
                                marginRight: "auto"
                            }
                        }
                        href="https://react.dev/"
                        target="blank">
                        Check out the react project
                    </AntButton>
                </Typography.Paragraph>
                <TitleSubTitleCombo subTitle={"Charting library"}
                    title={"Plotly"}
                    startLevel={3}/>
                <Typography.Paragraph>
                    <AntButton style={
                            {
                                marginLeft: "auto",
                                marginRight: "auto"
                            }
                        }
                        href="https://plotly.com/javascript/"
                        target="blank">
                        Check out the plotly project
                    </AntButton>
                </Typography.Paragraph>
                <TitleSubTitleCombo subTitle={"Flow chart library used for the Strategy Designer"}
                    title={"Reactflow"}
                    startLevel={3}/>
                <Typography.Paragraph>
                    <AntButton style={
                            {
                                marginLeft: "auto",
                                marginRight: "auto"
                            }
                        }
                        href="https://reactflow.dev"
                        target="blank">
                        Check out the Reactflow project
                    </AntButton>
                </Typography.Paragraph>
                <TitleSubTitleCombo subTitle={"Machine learning library used for the neural net evaluator"}
                    title={"tensorflow"}
                    startLevel={3}/>
                <Typography.Paragraph>
                    So simple to use and yet so powerful
                    <AntButton style={
                            {
                                marginLeft: "auto",
                                marginRight: "auto"
                            }
                        }
                        href="https://www.tensorflow.org"
                        target="blank">
                        Check out the tensorflow project
                    </AntButton>
                </Typography.Paragraph>
                <Typography.Title level={3}>
                    And many more that you can find in the requirements.txt
                </Typography.Title>
            </Grid>
        </Grid>

    )
}


export function TitleSubTitleCombo({
    title,
    subTitle,
    startLevel = 2, 
    center=false,
}) {
    return (
        <>
            <Typography.Title level={startLevel}
                style={
                    {marginBottom: "0px",
                    textAlign: center? "center" : "unset"}
            }>
                {title} </Typography.Title>
            <Typography.Title level={
                    startLevel + 1
                }
                style={
                    {marginTop: "0px",
                    textAlign: center? "center" : "unset"}
            }>
                {subTitle} </Typography.Title>
        </>
    )
}
