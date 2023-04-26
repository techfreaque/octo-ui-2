import React from "react";
import {
    useAppStoreDataContext,
    useFetchAppStoreData,
    useLoginToAppStore,
    useLogoutFromAppStore,
    useSignupToAppStore
} from "../../../context/data/AppStoreDataProvider";
import AppList from "./AppList";
import AntSidebar from "../../../components/Sidebars/AntSidebar/AntSidebar";
import TradingConfig from "../Configuration/TradingConfig";
import ProfileAvatar from "../Stats/ProfileAvatar";
import {useBotInfoContext} from "../../../context/data/BotInfoProvider";

const hiddenCategories = ["Legacy Strategy"]
export const strategyModeSettingsName = "Strategy Mode Settings"
export const strategyName = "Strategy"

export default function AppStore() {
    const appStoreData = useAppStoreDataContext();
    const botInfo = useBotInfoContext();
    const availableCategories = (Object.keys(appStoreData)?.filter(category => (! hiddenCategories.includes(category))) || [])

    const [selectedCategories, setSelectedCategories] = React.useState(strategyName);
    const [logInInfo, setLogInInfo] = React.useState({email: "test", password: "test"});
    const _useFetchAppStoreData = useFetchAppStoreData();
    React.useEffect(() => {
        _useFetchAppStoreData();
    }, [_useFetchAppStoreData]);

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
    const content = (
        <AppList selectedCategories={
            selectedCategories
                // ?.replace(/_/g, " ")
            }
            appStoreData={appStoreData}/>
    )
    const menuItems = [
        ...availableCategories.map(categoryName => {
            if (categoryName === strategyName) {
                return {
                    label: botInfo?.current_profile?.profile?.name,
                    key: categoryName,
                    content: content,
                    icon: (
                        <ProfileAvatar marginRight="5px"/>
                    )
                }
            } else {
                return {label: categoryName, content: content, key: categoryName}
            }
        }), {
            label: strategyModeSettingsName,
            key: strategyModeSettingsName,
            antIcon: "ControlOutlined",
            dontScroll: true,
            noPadding: true,
            content: (
                <TradingConfig/>)
        },
        // {
        //       label: "login",
        //       content: (
        //           <>
        //               <Button onClick={handleLoginToAppStore}>Login</Button>
        //               <Button onClick={handleLogoutFromppStore}>Logout</Button>
        //               <Button onClick={handleSignupToAppStore}>Signup</Button>
        //               <Space direction="vertical">
        //                   <Input name="email"
        //                       value={
        //                           logInInfo ?. email
        //                       }
        //                       onChange={
        //                           (event) => handleCredentialInput("email", event ?. target ?. value)
        //                       }
        //                       placeholder="Enter your email"/>
        //                   <Input.Password value={
        //                           logInInfo ?. password
        //                       }
        //                       onChange={
        //                           (event) => handleCredentialInput("password", event ?. target ?. value)
        //                       }
        //                       placeholder="Enter your password"/>
        //               </Space>
        //           </>
        //       )
        // }
    ]

    return Boolean(availableCategories.length) && (
        <AntSidebar menuItems={menuItems}
            currentlySelectedMenu={selectedCategories}
            setCurrentlySelectedMenu={setSelectedCategories}/>
    )
}
