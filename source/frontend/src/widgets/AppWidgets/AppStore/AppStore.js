import { Grid } from "@mui/material";
import React from "react";
import {
  useAppStoreDataContext,
  useFetchAppStoreData,
  useLoginToAppStore,
  useLogoutFromAppStore,
  useSignupToAppStore,
} from "../../../context/data/AppStoreDataProvider";
import AppList from "./AppList";
import Categories from "./Categories";
import { Button } from "antd";
import AntSidebar from "../../../components/Sidebars/AntSidebar/AntSidebar";

export default function AppStore() {
  const appStoreData = useAppStoreDataContext();

  const [selectedCategories, setSelectedCategories] = React.useState(["all"]);
  const [logInInfo, setLogInInfo] = React.useState({email: "test", password: "test"});

  const handleCategoryClick = (event, index) => {
    if (
      index !== "all" &&
      index !== "installed" &&
      !selectedCategories.includes(index) &&
      !selectedCategories.includes("all") &&
      !selectedCategories.includes("installed")
    ) {
      setSelectedCategories((prevIndex) => {
        const newCategories = prevIndex.concat(index);
        return newCategories;
      });
    } else if (!selectedCategories.includes(index)) {
      setSelectedCategories([index]);
    } else {
      setSelectedCategories((prevIndex) => {
        const newCategories = prevIndex.filter((item) => item !== index);
        return newCategories;
      });
    }
  };
  const _useFetchAppStoreData = useFetchAppStoreData();
  React.useEffect(() => {
    _useFetchAppStoreData();
  }, [_useFetchAppStoreData]);
  
  const loginToAppStore = useLoginToAppStore()
  function handleLoginToAppStore() { 
    logInInfo && loginToAppStore(logInInfo);
  }
  const logoutFromAppStore = useLogoutFromAppStore()
  function handleLogoutFromppStore() { 
    logInInfo && logoutFromAppStore();
  }
  
  const signupToAppStore = useSignupToAppStore()
  function handleSignupToAppStore() { 
    logInInfo && signupToAppStore(logInInfo);
  }

  return (
    appStoreData &&
    appStoreData.available_apps && (
      <Grid container spacing={0}>
        <Grid item xs={12} md={4} lg={3}>
          <Button onClick={handleLoginToAppStore} >Login</Button>
          <Button onClick={handleLogoutFromppStore} >Logout</Button>
          <Button onClick={handleSignupToAppStore} >Signup</Button>
          <Categories
            categories={appStoreData.available_apps.categories}
            handleCategoryClick={handleCategoryClick}
            selectedCategories={selectedCategories}
          />
          <AntSidebar />
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <div style={{marginTop: "10px"}}>
            <AppList 
              selectedCategories={selectedCategories}
              appStoreData={appStoreData}
            />
          </div>
        </Grid>
      </Grid>
    )
  );
}
