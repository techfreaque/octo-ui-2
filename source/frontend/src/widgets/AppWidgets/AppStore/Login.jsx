import {Button, Input, Space, Typography} from "antd";
import {useAppStoreUserContext, useLoginToAppStore, useLogoutFromAppStore, useSignupToAppStore} from "../../../context/data/AppStoreDataProvider";
import {useState} from "react";

export default function LoginManager() {
    const appStoreUser = useAppStoreUserContext()
    const isLoggedIn = Boolean(appStoreUser?.token)
    return (<>
        <Space direction="vertical"
            style={
                {
                    marginBottom: "20px",
                    margin: "auto",
                    maxWidth: "350px"
                }
        }> {
            isLoggedIn ? (<ManageAccount/>) : (<LoginSignup/>)
        } </Space>
    </>)

}


function ManageAccount({logInInfo}) {
    const logoutFromAppStore = useLogoutFromAppStore()
    function handleLogoutFromppStore() {
        logoutFromAppStore();
    }
    return (<>
        <Typography.Title>
            Manage your O UI account
        </Typography.Title>
        <Button onClick={handleLogoutFromppStore}>Logout</Button>
    </>)
}

function LoginSignup() {
    const [logInInfo, setLogInInfo] = useState({email: "", password: ""});
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
    return (<>
        <Typography.Title>
            Log into O UI or create an account
        </Typography.Title>
        <Input name="email"
            value={
                logInInfo?.email
            }
            onChange={
                (event) => handleCredentialInput("email", event?.target?.value)
            }
            placeholder="Enter your email"/>
        <Input.Password value={
                logInInfo?.password
            }
            onChange={
                (event) => handleCredentialInput("password", event?.target?.value)
            }
            placeholder="Enter your password"/>
        <Space wrap>
            <Button onClick={handleLoginToAppStore}>Login</Button>
            <Button onClick={handleSignupToAppStore}>Create Account</Button>
        </Space>
    </>)
}
