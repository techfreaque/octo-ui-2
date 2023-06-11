import {Button, Input, Space, Typography} from "antd";
import {
    useAppStoreUserContext,
    useGetUsers,
    useLoginToAppStore,
    useLogoutFromAppStore,
    useSignupToAppStore
} from "../../../context/data/AppStoreDataProvider";
import {useEffect, useState} from "react";

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
    const [storeUsers, setStoreUsers] = useState()
    const getStoreUsers = useGetUsers()
    function handleLogoutFromppStore() {
        logoutFromAppStore();
    }
    useEffect(() => {
        getStoreUsers(setStoreUsers)
    }, [])

    return (<>
        <Typography.Title>
            Manage your O UI account
        </Typography.Title>
        <Button onClick={handleLogoutFromppStore}>Logout</Button>
        {
        storeUsers?.users && (<ul>
            <Typography.Title level={4}>Users</Typography.Title>
            {
            storeUsers.users.map(user => {
                return (<li> {
                    `${
                        user.email
                    } (${
                        user.referral_user_id
                    })`
                } </li>)
            })
        } </ul>)
    }
        {
        storeUsers?.visits && (<ul>
            <Typography.Title level={4}>Visits</Typography.Title>
            {
            storeUsers.visits.map(visit => {
                return (<li> {
                    `count: ${
                        visit.visit_counter
                    } - ${
                        visit.origin
                    } (${
                        visit.user_id
                    })`
                } </li>)
            })
        } </ul>)
    } </>)
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
        <div style={
            {margin: "10px 0"}
        }>
            <Input.Password value={
                    logInInfo?.password
                }
                onChange={
                    (event) => handleCredentialInput("password", event?.target?.value)
                }
                placeholder="Enter your password"/>
        </div>
        <Space wrap>
            <Button onClick={handleLoginToAppStore}>Login</Button>
            <Button onClick={handleSignupToAppStore}>Create Account</Button>
        </Space>
    </>)
}
