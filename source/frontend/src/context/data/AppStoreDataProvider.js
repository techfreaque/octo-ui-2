import React, {useState, useContext, createContext, useEffect} from "react";
import {useCallback} from "react";
import {installAppPackage, installProfile} from "../../api/actions";
import {
    fetchAppStoreData,
    fetchPackagesData,
    loginToAppStore,
    logoutFromAppStore,
    signupToAppStore
} from "../../api/data";
import {useBotDomainContext} from "../config/BotDomainProvider";
import {appStoreDomainProduction, isProduction} from "../../constants/frontendConstants";
import {useBotInfoContext} from "./BotInfoProvider";


const AppStoreDataContext = createContext();
const UpdateAppStoreDataContext = createContext();

const AppStoreDomainContext = createContext();
const UpdateAppStoreDomainContext = createContext();

export const useAppStoreDomainContext = () => {
    return useContext(AppStoreDomainContext);
};

export const useUpdateAppStoreDomainContext = () => {
    return useContext(UpdateAppStoreDomainContext);
};
const AppStoreUserContext = createContext();
const UpdateAppStoreUserContext = createContext();

export const useAppStoreUserContext = () => {
    return useContext(AppStoreUserContext);
};

export const useUpdateAppStoreUserContext = () => {
    return useContext(UpdateAppStoreUserContext);
};

export const useSaveAppStoreDataContext = () => {
    return useContext(UpdateAppStoreDataContext);
};

export const useAppStoreDataContext = () => {
    return useContext(AppStoreDataContext);
};

const _useFetchAppStoreData = () => {
    const saveAppStoreData = useSaveAppStoreDataContext()
    const appStoreDomain = useAppStoreDomainContext()
    const botInfo = useBotInfoContext()
    return useCallback((installedTentaclesInfo, notification, appStoreUser) => {
        appStoreDomain && fetchAppStoreData(saveAppStoreData, appStoreDomain, {installedTentaclesInfo, botInfo}, notification, appStoreUser)
    }, [appStoreDomain, saveAppStoreData, botInfo])
}

export const useFetchAppStoreData = () => {
    const botDomain = useBotDomainContext()
    const fetchAppStoreData = _useFetchAppStoreData()
    const appStoreUser = useAppStoreUserContext()
    const logic = useCallback((notification = true) => {
        fetchPackagesData((newData) => fetchAppStoreData(newData, notification, appStoreUser), botDomain, notification)
    }, [appStoreUser, botDomain, fetchAppStoreData]);
    return logic;
}

export const useLoginToAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const updateAppStoreUser = useUpdateAppStoreUserContext()
    const appStoreUser = useAppStoreUserContext()
    const logic = useCallback((userData, onLoggedIn) => {
        loginToAppStore(updateAppStoreUser, appStoreDomain, userData, appStoreUser, onLoggedIn)
    }, [updateAppStoreUser, appStoreDomain, appStoreUser]);
    return logic;
}

export const useLogoutFromAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const updateAppStoreUser = useUpdateAppStoreUserContext()
    const appStoreUser = useAppStoreUserContext()
    const logic = useCallback(() => {
        logoutFromAppStore(updateAppStoreUser, appStoreDomain, appStoreUser)
    }, [updateAppStoreUser, appStoreDomain, appStoreUser]);
    return logic;
}

export const useSignupToAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const updateAppStoreUser = useUpdateAppStoreUserContext()
    const logic = useCallback((userData, onLoggedIn) => {
        signupToAppStore(updateAppStoreUser, appStoreDomain, userData, onLoggedIn)
    }, [appStoreDomain, updateAppStoreUser]);
    return logic;
}

export const useInstallAppPackage = () => {
    const botDomain = useBotDomainContext()
    const logic = useCallback((packageUrl, packageNameAndVersion, token) => {
        installAppPackage(packageUrl, packageNameAndVersion, botDomain, token)
    }, [botDomain]);
    return logic;
}

export const useInstallProfile = () => {
    const botDomain = useBotDomainContext()
    const logic = useCallback((profileUrl, profileTitle, profileName) => {
        installProfile(profileUrl, profileTitle, profileName, botDomain)
    }, [botDomain]);
    return logic;
}

export const AppStoreDataProvider = ({children}) => {
    const [appStoreData, setAppStoreData] = useState({});
    const [appStoreUserData, setAppStoreUserData] = useState({});
    const [appStoreDomain, setAppStoreDomain] = useState(isProduction ? appStoreDomainProduction : process.env.REACT_APP_STORE_DOMAIN);
    const fetchAppStoreData = useFetchAppStoreData()
    const botInfo = useBotInfoContext()
    useEffect(() => {
        appStoreDomain && fetchAppStoreData(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appStoreDomain, botInfo])
    return (
        <AppStoreDataContext.Provider value={appStoreData}>
            <UpdateAppStoreDataContext.Provider value={setAppStoreData}>
                <AppStoreDomainContext.Provider value={appStoreDomain}>
                    <UpdateAppStoreUserContext.Provider value={setAppStoreUserData}>
                        <AppStoreUserContext.Provider value={appStoreUserData}>
                            <UpdateAppStoreDomainContext.Provider value={setAppStoreDomain}>
                                {children} </UpdateAppStoreDomainContext.Provider>
                        </AppStoreUserContext.Provider>
                    </UpdateAppStoreUserContext.Provider>
                </AppStoreDomainContext.Provider>
            </UpdateAppStoreDataContext.Provider>
        </AppStoreDataContext.Provider>
    );
};
