import {
    Button,
    Input,
    Radio,
    Space,
    Typography
} from "antd";
import {
    useAppStoreUserContext,
    useLoginToAppStore,
    useLogoutFromAppStore,
    useSignupToAppStore
} from "../../../../context/data/AppStoreDataProvider";
import {useState} from "react";
import BackendDashboard from "./Backend";
import AffiliateDashboard from "./AffiliateDashboard";

export default function LoginManager() {
    const appStoreUser = useAppStoreUserContext()
    const isLoggedIn = Boolean(appStoreUser ?. token)
    return (
        <>
            <Space direction="vertical"
                style={
                    {
                        marginBottom: "20px",
                        margin: "auto",
                        maxWidth: "500px"
                    }
            }>
                {
                isLoggedIn ? (
                    <ManageAccount/>) : (
                    <LoginSignup/>)
            } </Space>
        </>
    )

}


function ManageAccount({logInInfo}) {
    const logoutFromAppStore = useLogoutFromAppStore()
    function handleLogoutFromppStore() {
        logoutFromAppStore();
    }
    return (
        <>
            <Typography.Title>
                Manage your Octane account
            </Typography.Title>
            <Button onClick={handleLogoutFromppStore}>Logout</Button>
            <AffiliateDashboard/>
            <BackendDashboard/>
        </>
    )
}

const signUptTypes = {
    signUp: "signUp",
    login: "login"
}

function LoginSignup() {
    const [logInInfo, setLogInInfo] = useState({email: "", password: ""});
    const [formType, setFormType] = useState("signUp")
    function handleCredentialInput(inputName, value) {
        setLogInInfo(prevInfo => ({
            ...prevInfo,
            [inputName]: value
        }))
    }
    const loginToAppStore = useLoginToAppStore()
    function handleLoginToAppStore() {
        logInInfo && loginToAppStore(logInInfo, () => setLogInInfo({}));
    }
    const signupToAppStore = useSignupToAppStore()
    function handleSignupToAppStore() {
        logInInfo && signupToAppStore(logInInfo, () => setLogInInfo({}));
    }
    return (
        <>
            <Typography.Title> {
                formType === signUptTypes.signUp ? "Create an Octane account now" : " Log into Octane now"
            } </Typography.Title>
            <div style={
                {margin: "10px 0"}
            }>
                <Radio.Group onChange={
                        (event) => setFormType(event.target.value)
                    }
                    defaultValue={
                        signUptTypes.signUp
                }>
                    <Radio.Button value={
                        signUptTypes.signUp
                    }>Sign Up</Radio.Button>
                    <Radio.Button value={
                        signUptTypes.login
                    }>Log In</Radio.Button>
                </Radio.Group>
            </div>
            <Input name="email"
                value={
                    logInInfo ?. email
                }
                onChange={
                    (event) => handleCredentialInput("email", event ?. target ?. value)
                }
                placeholder="Enter your email"/>
            <div style={
                {margin: "10px 0"}
            }>
                <Input.Password value={
                        logInInfo ?. password
                    }
                    onChange={
                        (event) => handleCredentialInput("password", event ?. target ?. value)
                    }
                    placeholder="Enter your password"/>
            </div>
            {
                formType === signUptTypes.signUp && (<div style={
                    { margin: "10px 0" }
                }>
                    <Input value={
                        logInInfo?.referral_user_id
                    }
                        onChange={
                            (event) => handleCredentialInput("referral_user_id", event?.target?.value)
                        }
                        placeholder="Enter a referral code if you have one" />
                </div>)}
            <Space wrap>
                {
                formType === signUptTypes.signUp ? (
                    <Button onClick={handleSignupToAppStore}>Create Account Now</Button>
                ) : (
                    <Button onClick={handleLoginToAppStore}>Login Now</Button>
                )
            } </Space>
        </>
    )
}
