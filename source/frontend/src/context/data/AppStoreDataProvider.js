import React, {useState, useContext, createContext, useEffect} from "react";
import {useCallback} from "react";
import {selectProfile} from "../../api/actions";
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
import { apiFields, minReleaseNotesLength } from "../../widgets/AppWidgets/AppStore/AppCards/AppActions/UpDownloadApp/UploadAppForm";


const AppStoreDataContext = createContext();
const UpdateAppStoreDataContext = createContext();

const AppStoreDomainContext = createContext();
const UpdateAppStoreDomainContext = createContext();
const AppStoreCartContext = createContext();
const UpdateAppStoreCartContext = createContext();

export const useAppStoreCartContext = () => {
    return useContext(AppStoreCartContext);
};

export const useUpdateAppStoreCartContext = () => {
    return useContext(UpdateAppStoreCartContext);
};
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
        if (appStoreDomain) fetchAppStoreData(saveAppStoreData, appStoreDomain, {
            installedTentaclesInfo,
            botInfo
        }, notification, appStoreUser);
    }, [appStoreDomain, saveAppStoreData, botInfo])
}

export const useFetchAppStoreData = () => {
    const botDomain = useBotDomainContext()
    const fetchAppStoreData = _useFetchAppStoreData()
    const appStoreUser = useAppStoreUserContext()
    return useCallback((notification = false) => {
        fetchPackagesData((newData) => fetchAppStoreData(newData, notification, appStoreUser), botDomain, notification)
    }, [appStoreUser, botDomain, fetchAppStoreData]);
}

export const useLoginToAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const updateAppStoreUser = useUpdateLoginToken()
    const appStoreUser = useAppStoreUserContext()
    return useCallback((userData, onLoggedIn) => {
        loginToAppStore(updateAppStoreUser, appStoreDomain, userData, appStoreUser, onLoggedIn)
    }, [updateAppStoreUser, appStoreDomain, appStoreUser]);
}

export const useLogoutFromAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const updateAppStoreUser = useUpdateLoginToken()
    const appStoreUser = useAppStoreUserContext()
    return useCallback(() => {
        logoutFromAppStore(updateAppStoreUser, appStoreDomain, appStoreUser)
    }, [updateAppStoreUser, appStoreDomain, appStoreUser]);
}

export function validateUploadIndo(uploadInfo) {
    return uploadInfo?.[apiFields.releaseNotes]?.length > minReleaseNotesLength
}

export const useUploadToAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const appStoreUser = useAppStoreUserContext()
    return useCallback((app, uploadInfo, appDownloadUrl, setIsloading, setOpen) => {
        setIsloading(true)
        if (validateUploadIndo(uploadInfo)) {
            function handleAppUpload(appFile) {
                uploadApp({
                    storeDomain: appStoreDomain,
                    appFile,
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
        } else {
            setIsloading(false)
            createNotification("Enter release notes before you upload", "danger")
        }
    }, [appStoreDomain, appStoreUser]);
}

export const useRateAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const appStoreUser = useAppStoreUserContext()
    return useCallback((rateInfo, setIsloading) => {
        setIsloading(true)
        rateApp(appStoreDomain, rateInfo, appStoreUser, () => setIsloading(false))
    }, [appStoreDomain, appStoreUser]);
}

export const useAddToAppStoreCart = () => {
    const setAppStoreCart = useUpdateAppStoreCartContext()
    return useCallback((app) => {
        if (app?.categories?.[0]) {
            setAppStoreCart(prevCart => {
                const newCart = {
                    ...prevCart
                }
                if (newCart?.[app.categories[0]]) {
                    newCart[app.categories[0]][app.package_id] = app
                } else {
                    newCart[app.categories[0]] = {
                        [app.package_id]: app
                    }
                }
                return newCart
            })
            createNotification("Successfully added to the cart", "success")
        } else {
            createNotification("Cant buy a non store app", "danger")
        }
    }, [setAppStoreCart]);
}

export const useSignupToAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const updateAppStoreUser = useUpdateLoginToken()
    return useCallback((userData, onLoggedIn) => {
        signupToAppStore(updateAppStoreUser, appStoreDomain, userData, onLoggedIn)
    }, [appStoreDomain, updateAppStoreUser]);
}

export const useInstallAppPackage = () => {
    const botDomain = useBotDomainContext()
    const appStoreDomain = useAppStoreDomainContext()
    const appStoreUser = useAppStoreUserContext()

    return useCallback((downloadInfo, setIsloading, setOpen) => {
        setIsloading(true)

        const success = (updated_data, update_url, result, msg, status) => {
            createNotification(`Successfully installed ${
                downloadInfo.title
            }`)
            setIsloading(false)
            setOpen(false)
        }
        const fail = (updated_data, update_url, result, msg, status) => {
            createNotification(`Failed to install ${
                downloadInfo.title
            }`, "danger")
            setIsloading(false)
        }
        const requestData = {
            url: getAppUrlFromDownloadInfo(downloadInfo, appStoreDomain, appStoreUser)
        }
        sendAndInterpretBotUpdate(requestData, botDomain + backendRoutes.installApp, success, fail)
    }, [appStoreDomain, appStoreUser, botDomain]);
}

export const useInstallProfile = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const botDomain = useBotDomainContext()
    const appStoreUser = useAppStoreUserContext()
    return useCallback((downloadInfo, setIsloading, setOpen) => {
        setIsloading(true)
        const onFailInstall = (updated_data, update_url, result, msg, status) => {
            setIsloading(false)
            createNotification(`Failed to install ${
                downloadInfo.title
            }`, "danger")
        }
        const onSuccessInstall = (updated_data, update_url, result, msg, status) => {
            if (msg.success) {

                createNotification(`Successfully installed ${
                    downloadInfo.title
                }`)
                if (downloadInfo.should_select_profile) {
                    const onSelectSuccess = () => {
                        setIsloading(false)
                        createNotification(`Successfully selected ${
                            downloadInfo.title
                        }`)
                        setOpen(false)
                    }
                    const onSelectFail = () => {
                        createNotification(`Failed to select ${
                            downloadInfo.title
                        }`, "danger")
                        setOpen(false)
                    }
                    selectProfile(botDomain, downloadInfo.package_id, downloadInfo.title, onSelectSuccess, onSelectFail)
                } else {
                    setIsloading(false)
                    setOpen(false)
                }
            } else {
                onFailInstall(updated_data, update_url, result, msg, status)
            }
        }
        sendAndInterpretBotUpdate({
            url: getAppUrlFromDownloadInfo(downloadInfo, appStoreDomain, appStoreUser),
            name: downloadInfo.title
        }, botDomain + backendRoutes.importProfileFromUrl, onSuccessInstall, onFailInstall)
    }, [appStoreDomain, appStoreUser, botDomain]);
}

function getAppUrlFromDownloadInfo(downloadInfo, appStoreDomain, appStoreUser) {
    return `${appStoreDomain}/download_app/${
        appStoreUser?.download_token
    }/${
        downloadInfo.major_version
    }/${
        downloadInfo.minor_version
    }/${
        downloadInfo.bug_fix_version
    }/${
        downloadInfo.package_id
    }.zip`
}

function useUpdateLoginToken() {
    const updateAppStoreUser = useUpdateAppStoreUserContext()
    return useCallback((tokens) => {
        localStorage.setItem('storeSession', JSON.stringify(tokens));
        updateAppStoreUser(tokens)
    }, [updateAppStoreUser]);
}

export const AppStoreDataProvider = ({children}) => {
    const [appStoreData, setAppStoreData] = useState({});
    const [appStoreCart, setAppStoreCart] = useState({});
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
        if (appStoreDomain) fetchAppStoreData(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appStoreDomain, botInfo])
    return (<AppStoreDataContext.Provider value={appStoreData}>
        <UpdateAppStoreDataContext.Provider value={setAppStoreData}>
            <AppStoreCartContext.Provider value={appStoreCart}>
                <UpdateAppStoreCartContext.Provider value={setAppStoreCart}>
                    <AppStoreDomainContext.Provider value={appStoreDomain}>
                        <UpdateAppStoreUserContext.Provider value={setAppStoreUserData}>
                            <AppStoreUserContext.Provider value={appStoreUserData}>
                                <UpdateAppStoreDomainContext.Provider value={setAppStoreDomain}> {children} </UpdateAppStoreDomainContext.Provider>
                            </AppStoreUserContext.Provider>
                        </UpdateAppStoreUserContext.Provider>
                    </AppStoreDomainContext.Provider>
                </UpdateAppStoreCartContext.Provider>
            </AppStoreCartContext.Provider>
        </UpdateAppStoreDataContext.Provider>
    </AppStoreDataContext.Provider>);
};
