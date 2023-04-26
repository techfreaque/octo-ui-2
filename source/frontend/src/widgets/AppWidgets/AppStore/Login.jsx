import {Button, Input, Space, Typography} from "antd";
import {useAppStoreUserContext, useLoginToAppStore, useLogoutFromAppStore, useSignupToAppStore} from "../../../context/data/AppStoreDataProvider";
import {useState} from "react";

export default function LoginManager() {
    const [logInInfo, setLogInInfo] = useState({email: "test", password: "test"});
    const appStoreUser = useAppStoreUserContext()
    const isLoggedIn = Boolean(appStoreUser?.token)
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
    const logoutFromAppStore = useLogoutFromAppStore()
    function handleLogoutFromppStore() {
        logInInfo && logoutFromAppStore();
    }
    const signupToAppStore = useSignupToAppStore()
    function handleSignupToAppStore() {
        logInInfo && signupToAppStore(logInInfo, () => setLogInInfo({}));
    }
    if (isLoggedIn) {
        return (
            <Space direction="vertical"
                style={
                    {marginBottom: "20px"}
            }>
                <Typography.Title>
                    Manage your O UI account
                </Typography.Title>
                <Button onClick={handleLogoutFromppStore}>Logout</Button>
            </Space>
        )
    } else {
        return (
            <>
                <Space direction="vertical"
                    style={
                        {marginBottom: "20px"}
                }>
                    <Typography.Title>
                        Log into O UI
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
                </Space>
            </>
        )
    }
}
