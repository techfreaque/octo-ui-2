/* eslint-disable react-hooks/exhaustive-deps */
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
    const isPremiumUser = false
    return useCallback((installedTentaclesInfo, notification) => {
        appStoreDomain && fetchAppStoreData(saveAppStoreData, appStoreDomain, installedTentaclesInfo, isPremiumUser, notification)
    }, [saveAppStoreData, appStoreDomain, isPremiumUser])
}

export const useFetchAppStoreData = () => {
    const botDomain = useBotDomainContext()
    const fetchAppStoreData = _useFetchAppStoreData()
    const logic = useCallback((notification = true) => {
        fetchPackagesData((newData) => fetchAppStoreData(newData, notification), botDomain, notification)
    }, [botDomain, fetchAppStoreData]);
    return logic;
}

export const useLoginToAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const updateAppStoreUser = useUpdateAppStoreUserContext()
    const logic = useCallback((userData) => {
        loginToAppStore(updateAppStoreUser, appStoreDomain, userData)
    }, [appStoreDomain, fetchAppStoreData]);
    return logic;
}

export const useLogoutFromAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const updateAppStoreUser = useUpdateAppStoreUserContext()
    const logic = useCallback(() => {
        logoutFromAppStore(updateAppStoreUser, appStoreDomain)
    }, [appStoreDomain, fetchAppStoreData]);
    return logic;
}

export const useSignupToAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const updateAppStoreUser = useUpdateAppStoreUserContext()
    const logic = useCallback((userData) => {
        signupToAppStore(updateAppStoreUser, appStoreDomain, userData)
    }, [appStoreDomain, fetchAppStoreData]);
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
