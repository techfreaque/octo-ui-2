import React, {useState, useContext, createContext, useEffect} from "react";
import {useCallback} from "react";
import {selectProfile} from "../../api/actions";
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
import {getFile, sendAndInterpretBotUpdate, sendFile} from "../../api/fetchAndStoreFromBot";
import createNotification from "../../components/Notifications/Notification";
import {backendRoutes} from "../../constants/backendConstants";
import {apiFields, minReleaseNotesLength} from "../../widgets/AppWidgets/StrategyConfigurator/AppCards/AppActions/UpDownloadApp/UploadAppForm";
import {strategyName} from "../../widgets/AppWidgets/StrategyConfigurator/storeConstants";


const AppStoreDataContext = createContext();
const UpdateAppStoreDataContext = createContext();

const AppStorePaymentUrlContext = createContext();
const UpdateAppStorePaymentUrlContext = createContext();

const AppStoreDomainContext = createContext();
const UpdateAppStoreDomainContext = createContext();
const AppStoreCartContext = createContext();
const UpdateAppStoreCartContext = createContext();
const AppStoreCartIsOpenContext = createContext();
const UpdateAppStoreCartIsOpenContext = createContext();

export const useAppStorePaymentUrlContext = () => {
    return useContext(AppStorePaymentUrlContext);
};

export const useUpdateAppStorePaymentUrlContext = () => {
    return useContext(UpdateAppStorePaymentUrlContext);
};
export const useAppStoreCartContext = () => {
    return useContext(AppStoreCartContext);
};

export const useUpdateAppStoreCartContext = () => {
    return useContext(UpdateAppStoreCartContext);
};
export const useAppStoreCartIsOpenContext = () => {
    return useContext(AppStoreCartIsOpenContext);
};

export const useUpdateAppStoreCartIsOpenContext = () => {
    return useContext(UpdateAppStoreCartIsOpenContext);
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
        if (appStoreDomain) 
            fetchAppStoreData(saveAppStoreData, appStoreDomain, {
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
    return uploadInfo?.[apiFields.releaseNotes]?.length > minReleaseNotesLength || ! uploadInfo?.includePackage
}

export const useUploadToAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const appStoreUser = useAppStoreUserContext()
    const botInfo = useBotInfoContext()
    const updateAppStoreUser = useUpdateLoginToken()

    return useCallback((app, uploadInfo, appDownloadUrl, setIsloading, setOpen) => {
        setIsloading(true)
        if (validateUploadIndo(uploadInfo)) {
            if (appStoreUser?.token) {
                const appDetails = {
                    ...app,
                    octobot_version: botInfo.octobot_version,
                    ...(uploadInfo || {})
                }
                function onFail(response) {
                    setIsloading(false)
                    createNotification("Failed to upload the app", "danger")
                    // saveAppStoreData(msg.data);
                }
                function onSucces(response) {
                    if (response.success) {
                        setIsloading(false)
                        setOpen(false)
                        createNotification("Your app is now published")
                    } else if (response.message === "appstore.errors.notLoggedIn") {
                        setIsloading(false)
                        createNotification("You need to be signed in to upload", "danger")
                        updateAppStoreUser({})
                    } else {
                        onFail(response)
                    }
                }
                const uploadUrl = appStoreDomain + backendRoutes.appStoreUpload + `/${
                    appDetails.categories[0]
                }/${
                    appDetails.package_id
                }`
                if (uploadInfo.includePackage) {
                    function handleAppUpload(appFile) {
                        sendFile({
                            url: uploadUrl,
                            file: appFile,
                            fileName: `${
                                appDetails.package_id
                            }.zip`,
                            data: appDetails,
                            onSuccess: onSucces,
                            onError: onFail,
                            withCredentials: true,
                            token: appStoreUser.token
                        })
                    }
                    getFile(appDownloadUrl, handleAppUpload)
                } else {
                    sendAndInterpretBotUpdate(appDetails, uploadUrl, (updated_data, update_url, result, msg) => onSucces(msg), (updated_data, update_url, result, msg) => onFail(msg), "POST", true, appStoreUser.token)
                }
            } else {
                createNotification("You need to be signed in to upload an app", "warning")
            }
        } else {
            setIsloading(false)
            createNotification("Enter release notes before you upload", "danger")
        }
    }, [appStoreDomain, appStoreUser.token, botInfo.octobot_version, updateAppStoreUser]);
}

export const useRateAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const appStoreUser = useAppStoreUserContext()
    return useCallback((ratingInfo, setIsloading) => {
        setIsloading(true)
        function onFail(updated_data, update_url, result, msg, status) {
            setIsloading(false)
            createNotification("Failed rate app", "danger")
        }
        function onSucces(updated_data, update_url, result, msg, status, request) {
            if (msg.success) {
                setIsloading(false)
                createNotification("App rated successfully")
            } else {
                onFail(updated_data, update_url, result, msg, status)
            }
        }
        if (appStoreUser?.token) {
            sendAndInterpretBotUpdate(ratingInfo, appStoreDomain + backendRoutes.appStoreRate, onSucces, onFail, "POST", true, appStoreUser.token)
        } else {
            createNotification("You need to be signed in to rate an app", "warning")
        }
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
                if (newCart?.[app.origin_package]) {
                    newCart[app.origin_package][app.package_id] = app
                } else {
                    newCart[app.origin_package] = {
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

export const useRemoveFromAppStoreCart = () => {
    const setAppStoreCart = useUpdateAppStoreCartContext()
    return useCallback((origin_package) => {
        setAppStoreCart(prevCart => {
            const newCart = {
                ...prevCart
            }
            if (newCart?.[origin_package]) {
                delete newCart[origin_package]
            }
            return newCart
        })
        createNotification("Package removed from the cart", "success")
    }, [setAppStoreCart]);
}

export const useCreatePaymentFromAppStoreCart = () => {
    const setAppStorePaymentUrl = useUpdateAppStorePaymentUrlContext()
    const appStoreDomain = useAppStoreDomainContext()
    const appStoreUser = useAppStoreUserContext()
    const updateAppStoreUser = useUpdateLoginToken()
    return useCallback((setIsloading, origin_packages) => {
        setIsloading ?. (true)
        function onFail(updated_data, update_url, result, msg, status) {
            setIsloading ?. (false)
            if (msg.message === 'appstore.errors.notLoggedIn') {
                updateAppStoreUser({})
                createNotification("You need to be signed in to complete your purchase", "danger")
            } else {
                createNotification("Failed create payment", "danger")
            }
        }
        function onSucces(updated_data, update_url, result, msg, status, request) {
            if (msg.success) {
                setIsloading ?. (false)
                setAppStorePaymentUrl({paymentUrl: msg.payment_url, cancelUrl: msg.cancel_url})
                window.open(msg.payment_url, '_blank').focus();
                createNotification("Payment created")
            } else {
                onFail(updated_data, update_url, result, msg, status)
            }
        }
        if (appStoreUser?.token) {
            sendAndInterpretBotUpdate({
                origin_packages
            }, appStoreDomain + backendRoutes.appStoreCreatePayment, onSucces, onFail, "POST", true, appStoreUser.token)
        } else {
            createNotification("You need to be signed in to buy apps", "warning")
        }
    }, [appStoreDomain, appStoreUser.token, setAppStorePaymentUrl, updateAppStoreUser]);
}

export const useCancelStorePayment = () => {
    const setAppStorePaymentUrl = useUpdateAppStorePaymentUrlContext()
    const appStorePaymentUrl = useAppStorePaymentUrlContext()
    return useCallback(() => {
        fetch(appStorePaymentUrl?.cancelUrl);
        setAppStorePaymentUrl()
        createNotification("Payment cancelled")
    }, [
        appStorePaymentUrl?.cancelUrl,
        setAppStorePaymentUrl
    ]);
}

export const useIsInAppStoreCart = () => {
    const appStoreCart = useAppStoreCartContext()
    return useCallback((app) => {
        return Boolean(appStoreCart?.[app?.origin_package])
    }, [appStoreCart]);
}

export const useAppHasPremiumRequirement = () => {
    const appStoreCart = useAppStoreCartContext()
    return useCallback((app) => {
        if (app.price) {
            return true
        } else if (app.requirements) {
            app.requirements?.forEach(requirement => {})
        }
        return Boolean(appStoreCart?.[app.origin_package])
    }, [appStoreCart]);
}

export const useSignupToAppStore = () => {
    const appStoreDomain = useAppStoreDomainContext()
    const updateAppStoreUser = useUpdateLoginToken()
    return useCallback((userData, onLoggedIn) => {
        signupToAppStore(updateAppStoreUser, appStoreDomain, userData, onLoggedIn)
    }, [appStoreDomain, updateAppStoreUser]);
}

export const useInstallAnyAppPackage = () => {
    const installProfile = useInstallProfile()
    const installApp = useInstallAppPackage()
    return useCallback((downloadInfo, app, setIsloading, setOpen) => {
        if (app.categories?.[0] === strategyName) {
            installProfile({
                ...downloadInfo,
                ...app
            }, setIsloading, setOpen)
        } else {
            installApp(downloadInfo, app, setIsloading, setOpen)
        }
    }, [installApp, installProfile])
}

export const useInstallAppPackage = () => {
    const botDomain = useBotDomainContext()
    const appStoreDomain = useAppStoreDomainContext()
    const appStoreUser = useAppStoreUserContext()
    return useCallback((downloadInfo, app, setIsloading, setOpen) => {
        const _downloadInfo = {
            ...downloadInfo,
            ...app
        }
        setIsloading(true)

        const success = (updated_data, update_url, result, msg, status) => {
            createNotification(`Successfully installed ${
                _downloadInfo.title
            }`)
            setIsloading(false)
            setOpen(false)
        }
        const fail = (updated_data, update_url, result, msg, status) => {
            createNotification(`Failed to install ${
                _downloadInfo.title
            }`, "danger")
            setIsloading(false)
        }
        const requestData = {
            url: getAppUrlFromDownloadInfo(_downloadInfo, appStoreDomain, appStoreUser),
            // version: `${
            //     downloadInfo.major_version
            // }.${
            //     downloadInfo.minor_version
            // }.${
            //     downloadInfo.bug_fix_version
            // }`
        }
        sendAndInterpretBotUpdate(requestData, botDomain + backendRoutes.installApp, success, fail)
    }, [appStoreDomain, appStoreUser, botDomain]);
}

export const useUnInstallAppPackage = () => {
    const botDomain = useBotDomainContext()
    return useCallback((app, setIsloading, setOpen) => {
        setIsloading(true)

        const success = (updated_data, update_url, result, msg, status) => {
            createNotification(`Successfully uninstalled ${
                app.title
            }`)
            setIsloading(false)
            setOpen(false)
        }
        const fail = (updated_data, update_url, result, msg, status) => {
            createNotification(`Failed to uninstall ${
                app.title
            }`, "danger")
            setIsloading(false)
        }
        const requestData = [app.tentacle_name || app.package_id]
        sendAndInterpretBotUpdate(requestData, botDomain + backendRoutes.uninstallApp, success, fail)
    }, [botDomain]);
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
        downloadInfo.origin_package
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
    const [appStoreCartIsOpen, setAppStoreCartIsOpen] = useState(false);
    const [appStorePaymentUrl, setAppStorePaymentUrl] = useState();
    const [appStoreUserData, setAppStoreUserData] = useState({});
    const [appStoreDomain, setAppStoreDomain] = useState(isProduction ? appStoreDomainProduction : (process.env.REACT_APP_STORE_DEVELOPMENT_DOMAIN||appStoreDomainProduction));
    const fetchAppStoreData = useFetchAppStoreData()
    const botInfo = useBotInfoContext()
    useEffect(() => {
        const cookie = localStorage.getItem('storeSession')
        if (cookie && cookie !== 'undefined') {
            setAppStoreUserData(JSON.parse(cookie));
        }
    }, []);
    useEffect(() => {
        if (appStoreDomain) {
            fetchAppStoreData(false);
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appStoreDomain, botInfo])
    return (
        <AppStoreDataContext.Provider value={appStoreData}>
            <UpdateAppStoreDataContext.Provider value={setAppStoreData}>
                <AppStoreCartContext.Provider value={appStoreCart}>
                    <UpdateAppStoreCartContext.Provider value={setAppStoreCart}>
                        <AppStoreCartIsOpenContext.Provider value={appStoreCartIsOpen}>
                            <UpdateAppStoreCartIsOpenContext.Provider value={setAppStoreCartIsOpen}>
                                <AppStoreDomainContext.Provider value={appStoreDomain}>
                                    <UpdateAppStoreUserContext.Provider value={setAppStoreUserData}>
                                        <AppStoreUserContext.Provider value={appStoreUserData}>
                                            <AppStorePaymentUrlContext.Provider value={appStorePaymentUrl}>
                                                <UpdateAppStorePaymentUrlContext.Provider value={setAppStorePaymentUrl}>
                                                    <UpdateAppStoreDomainContext.Provider value={setAppStoreDomain}>
                                                        {children} </UpdateAppStoreDomainContext.Provider>
                                                </UpdateAppStorePaymentUrlContext.Provider>
                                            </AppStorePaymentUrlContext.Provider>
                                        </AppStoreUserContext.Provider>
                                    </UpdateAppStoreUserContext.Provider>
                                </AppStoreDomainContext.Provider>
                            </UpdateAppStoreCartIsOpenContext.Provider>
                        </AppStoreCartIsOpenContext.Provider>
                    </UpdateAppStoreCartContext.Provider>
                </AppStoreCartContext.Provider>
            </UpdateAppStoreDataContext.Provider>
        </AppStoreDataContext.Provider>
    );
};
