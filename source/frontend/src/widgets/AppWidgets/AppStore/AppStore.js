import {Grid} from "@mui/material";
import React from "react";
import {
    useAppStoreDataContext,
    useFetchAppStoreData,
    useLoginToAppStore,
    useLogoutFromAppStore,
    useSignupToAppStore
} from "../../../context/data/AppStoreDataProvider";
import AppList from "./AppList";
import Categories from "./Categories";
import {Button, Input, Space} from "antd";
import AntSidebar from "../../../components/Sidebars/AntSidebar/AntSidebar";
import TradingConfig from "../Configuration/TradingConfig";

const hiddenCategories = ["Legacy Strategy"]
export const strategyModeSettings = "Strategy Mode Settings"

export default function AppStore() {
    const appStoreData = useAppStoreDataContext();
    const availableCategories = [
        ...(Object.keys(appStoreData) ?. filter(category => (! hiddenCategories.includes(category))) || []),
        strategyModeSettings
    ]


    const [selectedCategories, setSelectedCategories] = React.useState(["Strategy"]);
    const [logInInfo, setLogInInfo] = React.useState({email: "test", password: "test"});
    function handleCredentialInput(inputName, value) {
        setLogInInfo(prevInfo => ({
            ...prevInfo,
            [inputName]: value
        }))
    }
    const handleCategoryClick = (event, index) => {
        setSelectedCategories(index)
        // if (index !== "all" && index !== "installed" && !selectedCategories.includes(index) && !selectedCategories.includes("all") && !selectedCategories.includes("installed")) {
        //     setSelectedCategories((prevIndex) => {
        //         const newCategories = prevIndex.concat(index);
        //         return newCategories;
        //     });
        // } else if (!selectedCategories.includes(index)) {
        //     setSelectedCategories([index]);
        // } else {
        //     setSelectedCategories((prevIndex) => {
        //         const newCategories = prevIndex.filter((item) => item !== index);
        //         return newCategories;
        //     });
        // }
    };
    const _useFetchAppStoreData = useFetchAppStoreData();
    React.useEffect(() => {
        _useFetchAppStoreData();
    }, [_useFetchAppStoreData]);

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
    return(Boolean(availableCategories.length) && (
        <Grid container
            spacing={0}>
            <Grid item
                xs={12}
                md={4}
                lg={3}>
                {/* <Button onClick={handleLoginToAppStore}>Login</Button>
                <Button onClick={handleLogoutFromppStore}>Logout</Button>
                <Button onClick={handleSignupToAppStore}>Signup</Button> */}
                {/* <Space direction="vertical">
                    <Input name="email"
                        value={
                            logInInfo ?. email
                        }
                        onChange={
                            (event) => handleCredentialInput("email", event ?. target ?. value)
                        }
                        placeholder="Enter your email"/>
                    <Input.Password value={
                            logInInfo ?. password
                        }
                        onChange={
                            (event) => handleCredentialInput("password", event ?. target ?. value)
                        }
                        placeholder="Enter your password"/>
                </Space> */}
                <Categories categories={availableCategories}
                    handleCategoryClick={handleCategoryClick}
                    selectedCategories={selectedCategories}/>
                <AntSidebar/>
            </Grid>
            <Grid item
                xs={12}
                md={8}
                lg={9}>
                <div style={
                    {marginTop: "10px"}
                }>
                    {
                    selectedCategories === strategyModeSettings ? (
                        <TradingConfig/>) : (
                        <AppList selectedCategories={selectedCategories}
                            appStoreData={appStoreData}/>
                    )
                } </div>
            </Grid>
        </Grid>
    ));
}
