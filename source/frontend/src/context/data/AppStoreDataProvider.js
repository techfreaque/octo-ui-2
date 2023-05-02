import React, {useState, useContext, createContext, useEffect} from "react";
import {useCallback} from "react";
import {installAppPackage, selectProfile} from "../../api/actions";
import {
    fetchAppStoreData,
    fetchPackagesData,
    loginToAppStore,
    logoutFromAppStore,
    rateApp,
    signupToAppStore,
    uploadApp
} from "../../api/data";
import {useBotDomainContext} from "../config/BotDomainProvider";
import {appStoreDomainProduction, isProduction} from "../../constants/frontendConstants";
import {useBotInfoContext} from "./BotInfoProvider";
import {getFile, sendAndInterpretBotUpdate} from "../../api/fetchAndStoreFromBot";
import createNotification from "../../components/Notifications/Notification";
import {backendRoutes} from "../../constants/backendConstants";


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

const useUpdateAppStoreUserContext = () => {
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
        appStoreDomain && fetchAppStoreData(saveAppStoreData, appStoreDomain, {
            installedTentaclesInfo,
            botInfo
        }, notification, appStoreUser)
    }, [appStoreDomain, saveAppStoreData, botInfo])
}

export const useFetchAppStoreData = () => {
    const botDomain = useBotDomainContext()
    const fetchAppStoreData = _useFetchAppStoreData()
    const appStoreUser = useAppStoreUserContext()
    const logic = useCallback((notification = false) => {
        fetchPackagesData((newData) => fetchAppStoreData(newData, notification, appStoreUser), botDomain, notification)
    }, [appStoreUser, botDomain, fetchAppStoreData]);
    return logic;
}

export const useLoginToAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const updateAppStoreUser = useUpdateLoginToken()
    const appStoreUser = useAppStoreUserContext()
    const logic = useCallback((userData, onLoggedIn) => {
        loginToAppStore(updateAppStoreUser, appStoreDomain, userData, appStoreUser, onLoggedIn)
    }, [updateAppStoreUser, appStoreDomain, appStoreUser]);
    return logic;
}

export const useLogoutFromAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const updateAppStoreUser = useUpdateLoginToken()
    const appStoreUser = useAppStoreUserContext()
    const logic = useCallback(() => {
        logoutFromAppStore(updateAppStoreUser, appStoreDomain, appStoreUser)
    }, [updateAppStoreUser, appStoreDomain, appStoreUser]);
    return logic;
}

export const useUploadToAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const appStoreUser = useAppStoreUserContext()
    const logic = useCallback((app, uploadInfo, appDownloadUrl, setIsloading, setOpen) => {
        setIsloading(true)
        function handleAppUpload(appFile) {
            uploadApp({
                storeDomain: appStoreDomain,
                appFile: appFile,
                appDetails: {
                    ...app,
                    ...(uploadInfo || {})
                },
                appStoreUser,
                onSuccess: () => setIsloading(false)
            })
            setOpen(false)
        }
        getFile(appDownloadUrl, handleAppUpload)

    }, [appStoreDomain, appStoreUser]);
    return logic;
}

export const useRateAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const appStoreUser = useAppStoreUserContext()
    const logic = useCallback((rateInfo, setIsloading) => {
        setIsloading(true)
        rateApp(appStoreDomain, rateInfo, appStoreUser, () => setIsloading(false))
    }, [appStoreDomain, appStoreUser]);
    return logic;
}

export const useSignupToAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const updateAppStoreUser = useUpdateLoginToken()
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
    const appStoreDomain = useAppStoreDomainContext()
    const botDomain = useBotDomainContext()
    const appStoreUser = useAppStoreUserContext()
    const logic = useCallback((downloadInfo, setIsloading, setOpen) => {
        setIsloading(true)
        const onFailInstall = (updated_data, update_url, result, msg, status) => {
            setIsloading(false)
            createNotification(`Failed to install ${downloadInfo.title}`, "danger")
        }
        const onSuccessInstall = (updated_data, update_url, result, msg, status) => {
            if (msg.success) {
                
                createNotification(`Successfully installed ${downloadInfo.title}`)
                if (downloadInfo.should_select_profile) { 
                    const onSelectSuccess = () => {
                        setIsloading(false)
                        createNotification(`Successfully selected ${downloadInfo.title}`)
                        setOpen(false)
                    }
                    const onSelectFail = () => {
                        createNotification(`Failed to select ${downloadInfo.title}`, "danger")
                        setOpen(false)
                    }
                    selectProfile(botDomain, downloadInfo.package_id, downloadInfo.title, onSelectSuccess, onSelectFail)
                }
                else {
                    setIsloading(false)
                    setOpen(false)
                }
            } else {
                onFailInstall(updated_data, update_url, result, msg, status)
            }
        }
        sendAndInterpretBotUpdate({
            url: `${appStoreDomain}/download_app/${
                appStoreUser?.downloadToken
            }/${downloadInfo.major_version}/${downloadInfo.minor_version}/${downloadInfo.bug_fix_version}/${downloadInfo.package_id}.zip`,
            name: downloadInfo.title
        }, botDomain + backendRoutes.importProfileFromUrl, onSuccessInstall, onFailInstall)
    }, [appStoreUser?.downloadToken, botDomain, appStoreDomain]);
    return logic;
}
function useUpdateLoginToken() {
    const updateAppStoreUser = useUpdateAppStoreUserContext()
    const logic = useCallback((tokens) => {
        localStorage.setItem('storeSession', JSON.stringify(tokens));
        updateAppStoreUser(tokens)
    }, [updateAppStoreUser]);
    return logic;
}

export const AppStoreDataProvider = ({children}) => {
    const [appStoreData, setAppStoreData] = useState({});
    const [appStoreUserData, setAppStoreUserData] = useState({});
    const [appStoreDomain, setAppStoreDomain] = useState(isProduction ? appStoreDomainProduction : process.env.REACT_APP_STORE_DOMAIN);
    const fetchAppStoreData = useFetchAppStoreData()
    const botInfo = useBotInfoContext()
    useEffect(() => {
        const cookie = localStorage.getItem('storeSession')
        if (cookie && cookie !== 'undefined') {
            setAppStoreUserData(JSON.parse(cookie));
        }
    }, []);
    useEffect(() => {
        appStoreDomain && fetchAppStoreData(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appStoreDomain, botInfo])
    return (<AppStoreDataContext.Provider value={appStoreData}>
        <UpdateAppStoreDataContext.Provider value={setAppStoreData}>
            <AppStoreDomainContext.Provider value={appStoreDomain}>
                <UpdateAppStoreUserContext.Provider value={setAppStoreUserData}>
                    <AppStoreUserContext.Provider value={appStoreUserData}>
                        <UpdateAppStoreDomainContext.Provider value={setAppStoreDomain}> {children} </UpdateAppStoreDomainContext.Provider>
                    </AppStoreUserContext.Provider>
                </UpdateAppStoreUserContext.Provider>
            </AppStoreDomainContext.Provider>
        </UpdateAppStoreDataContext.Provider>
    </AppStoreDataContext.Provider>);
};
