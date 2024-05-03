import {
  useState,
  useContext,
  createContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useCallback } from "react";
import { selectProfile } from "../../api/actions";
import {
  fetchPackagesData,
  loginToAppStore,
  logoutFromAppStore,
  signupToAppStore,
} from "../../api/data";
import { useBotDomainContext } from "../config/BotDomainProvider";
import {
  appStoreDomainProduction,
  isProduction,
} from "../../constants/frontendConstants";
import { useBotInfoContext } from "./BotInfoProvider";
import {
  errorResponseCallBackParams,
  getFile,
  sendAndInterpretBotUpdate,
  sendFile,
  successResponseCallBackParams,
} from "../../api/fetchAndStoreFromBot";
import createNotification from "../../components/Notifications/Notification";
import { backendRoutes } from "../../constants/backendConstants";
import {
  apiFields,
  minReleaseNotesLength,
} from "../../widgets/AppWidgets/StrategyConfigurator/AppCards/AppActions/UpDownloadApp/UploadAppForm";
import { strategyName } from "../../widgets/AppWidgets/StrategyConfigurator/storeConstants";
import {
  StorePayments,
  StoreUsersType,
} from "../../widgets/AppWidgets/StrategyConfigurator/Dashboard/Backend";
import { LoginSignupFormType } from "../../widgets/AppWidgets/StrategyConfigurator/Dashboard/Login";
import { UploadInfo } from "../../widgets/AppWidgets/StrategyConfigurator/AppCards/AppCard";

export type StrategyModeCategoryType = "Strategy Mode";
export type StrategyCategoryType = "Strategy";
export type OtherCategoryType =
  | "Strategy Block"
  | "App Packages"
  | "Service Notifier"
  | "Interface"
  | "Package";

export type StoreCategoryType =
  | StrategyModeCategoryType
  | OtherCategoryType
  | StrategyCategoryType;

export type AppStoreVersionTagType =
  | "stable_version"
  | "beta_version"
  | "alpha_version";

export type AppStoreVersionTypeType =
  | "bug_fix_version"
  | "minor_version"
  | "major_version";

export type AppStorePublishStatusType = "draft" | "published" | "unpublished";
export interface AppStoreAppVersionType {
  bug_fix_version: number;
  major_version: number;
  minor_version: number;
  origin_package: string;
  release_notes: string;
  requirements: string[];
  timestamp: number;
  version_tag: AppStoreVersionTagType;
  version_type: AppStoreVersionTypeType;
}

export interface AppStoreAppType {
  categories: StoreCategoryType[];
  description?: string;
  first_publish_timestamp?: number;
  last_publish_timestamp?: number;
  origin_package: string;
  price?: number;
  title: string;
  is_installed?: boolean;
  has_paid?: boolean;
  is_owner?: boolean;
  is_shared?: boolean;
  package_id?: string;
  requirements?: string[];
  tentacle_name?: string;
  updated_by_distro?: boolean;
  app_users?: number;
  can_delete?: boolean;
  downloads?: number;
  image_url?: string;
  avatar_url?: string;
  is_from_store?: boolean;
  is_selected?: boolean;
  publish_status?: AppStorePublishStatusType;
  publish_user_name?: number;
  rating?: number;
  short_description?: string;
  votes?: number;
  versions?: AppStoreAppVersionType[];
}

export type AppStoreCategoryDataType = {
  [packageId: string]: AppStoreAppType;
};
export type AppStoreDataType = {
  [categry in StoreCategoryType]: AppStoreCategoryDataType;
};

const AppStoreDataContext = createContext<AppStoreDataType>({});
const UpdateAppStoreDataContext = createContext<
  Dispatch<SetStateAction<AppStoreDataType>>
>((_value) => {});

export interface AppStorePaymentUrlType {
  paymentUrl: string;
  cancelUrl: string;
}

const AppStorePaymentUrlContext = createContext<
  AppStorePaymentUrlType | undefined
>(undefined);
const UpdateAppStorePaymentUrlContext = createContext<
  Dispatch<SetStateAction<AppStorePaymentUrlType | undefined>>
>((_value) => {});

const defaultDomain = isProduction
  ? appStoreDomainProduction
  : process.env.REACT_APP_STORE_DEVELOPMENT_DOMAIN || appStoreDomainProduction;

const AppStoreDomainContext = createContext<string>(defaultDomain);
const UpdateAppStoreDomainContext = createContext<
  Dispatch<SetStateAction<string>>
>((_value) => {});

export interface AppStoreCartType {
  [originPackageId: string]: {
    [packageId: string]: AppStoreAppType;
  };
}

const AppStoreCartContext = createContext<AppStoreCartType>({});
const UpdateAppStoreCartContext = createContext<
  Dispatch<SetStateAction<AppStoreCartType>>
>((_value) => {});
const AppStoreCartIsOpenContext = createContext<boolean>(false);
const UpdateAppStoreCartIsOpenContext = createContext<
  Dispatch<SetStateAction<boolean>>
>((_value) => {});

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

export interface AppStoreUserType {
  token: string;
  download_token: string;
}

const AppStoreUserContext = createContext<AppStoreUserType | undefined>(
  undefined
);

const UpdateAppStoreUserContext = createContext<
  Dispatch<SetStateAction<AppStoreUserType | undefined>>
>((_) => {});

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

export type InstalledTentaclesInfoType = {
  [category: string]: {
    [packageId: string]: {
      categories: string[];
      is_installed: boolean;
      is_owner: boolean;
      is_shared: boolean;
      origin_package: string;
      package_id: string;
      requirements: string[];
      "default-config"?: string[];
      "requirements-min-count"?: number;
      tentacle_name?: string;
      title: string;
      description?: string;
      updated_by_distro: boolean;
      avatar_url?: string;
      is_from_store?: boolean;
      is_selected?: boolean;
      activation?: boolean;
    };
  };
};

const _useFetchAppStoreData = () => {
  const saveAppStoreData = useSaveAppStoreDataContext();
  const appStoreDomain = useAppStoreDomainContext();
  return useCallback(
    (
      installedTentaclesInfo: InstalledTentaclesInfoType,
      appStoreUser: AppStoreUserType | undefined,
      notification?: boolean
    ) => {
      if (!appStoreDomain) {
        return;
      }
      function successCallback(payload: successResponseCallBackParams) {
        saveAppStoreData(payload.data?.data);
        if (notification)
          createNotification({
            title: "Successfully fetched package manager repositories",
          });
      }
      function errorCallback(payload: errorResponseCallBackParams) {
        if (notification)
          createNotification({
            title: "Failed to fetch package manager repositories",
          });
        // TODO add fallback
      }
      sendAndInterpretBotUpdate({
        updatedData: installedTentaclesInfo,
        updateUrl: appStoreDomain + backendRoutes.appStoreFree,
        successCallback,
        errorCallback,
        withCredentials: true,
        token: appStoreUser?.token,
      });
    },
    [appStoreDomain, saveAppStoreData]
  );
};

export const useFetchAppStoreData = () => {
  const botDomain = useBotDomainContext();
  const fetchAppStoreData = _useFetchAppStoreData();
  const appStoreUser = useAppStoreUserContext();
  return useCallback(
    (notification?: boolean) => {
      fetchPackagesData(
        (newData: InstalledTentaclesInfoType) =>
          fetchAppStoreData(newData, appStoreUser, notification),
        botDomain,
        notification
      );
    },
    [appStoreUser, botDomain, fetchAppStoreData]
  );
};

export const useLoginToAppStore = () => {
  const appStoreDomain = useAppStoreDomainContext();
  const updateAppStoreUser = useUpdateLoginToken();
  const appStoreUser = useAppStoreUserContext();
  return useCallback(
    (userData: LoginSignupFormType, onLoggedIn: () => void) => {
      loginToAppStore(
        updateAppStoreUser,
        appStoreDomain,
        userData,
        appStoreUser,
        onLoggedIn
      );
    },
    [updateAppStoreUser, appStoreDomain, appStoreUser]
  );
};

export const useLogoutFromAppStore = () => {
  const appStoreDomain = useAppStoreDomainContext();
  const updateAppStoreUser = useUpdateLoginToken();
  const appStoreUser = useAppStoreUserContext();
  return useCallback(() => {
    logoutFromAppStore(updateAppStoreUser, appStoreDomain, appStoreUser);
  }, [updateAppStoreUser, appStoreDomain, appStoreUser]);
};

export function validateUploadInfo(uploadInfo: UploadInfo) {
  return (
    (uploadInfo?.[apiFields.release_notes]?.length || 0) >
      minReleaseNotesLength || uploadInfo?.includePackage !== true
  );
}

export const useUploadToAppStore = () => {
  const appStoreDomain = useAppStoreDomainContext();
  const appStoreUser = useAppStoreUserContext();
  const botInfo = useBotInfoContext();
  const updateAppStoreUser = useUpdateLoginToken();

  return useCallback(
    (
      app: AppStoreAppType,
      uploadInfo: UploadInfo,
      appDownloadUrl: string,
      setIsloading: Dispatch<SetStateAction<boolean>>,
      setOpen: (isOpen: boolean) => void
    ) => {
      setIsloading(true);
      if (!botInfo) {
        createNotification({
          title: "Bot not ready to upload yet",
          type: "danger",
        });
        setIsloading(false);
        return;
      }
      if (validateUploadInfo(uploadInfo)) {
        if (appStoreUser?.token) {
          const appDetails = {
            ...app,
            octobot_version: botInfo.octobot_version,
            ...(uploadInfo || {}),
          };
          const onFail = (response) => {
            setIsloading(false);
            createNotification({
              title: "Failed to upload the app",
              type: "danger",
            });
            // saveAppStoreData(msg.data);
          };
          const onSucces = (response) => {
            if (response.success) {
              setIsloading(false);
              setOpen(false);
              createNotification({ title: "Your app is now published" });
              return;
            }
            if (response.message === "appstore.errors.notLoggedIn") {
              setIsloading(false);
              createNotification({
                title: "You need to be signed in to upload",
                type: "danger",
              });
              updateAppStoreUser(undefined);
              return;
            }
            onFail(response);
          };
          const uploadUrl =
            appStoreDomain +
            backendRoutes.appStoreUpload +
            `/${appDetails.categories[0]}/${appDetails.package_id}`;
          if (uploadInfo.includePackage) {
            const handleAppUpload = (appFile) => {
              sendFile({
                url: uploadUrl,
                file: appFile,
                fileName: `${appDetails.package_id}.zip`,
                data: appDetails,
                onSuccess: onSucces,
                onError: onFail,
                withCredentials: true,
                token: appStoreUser.token,
              });
            };
            getFile({
              url: appDownloadUrl,
              successCallback: handleAppUpload,
              errorCallback: onFail,
            });
          } else {
            sendAndInterpretBotUpdate({
              updatedData: appDetails,
              updateUrl: uploadUrl,
              successCallback: (payload: successResponseCallBackParams) =>
                onSucces(payload.data),
              errorCallback: (payload: errorResponseCallBackParams) =>
                onFail(payload.data),
              withCredentials: true,
              token: appStoreUser.token,
            });
          }
        } else {
          setIsloading(false);
          createNotification({
            title: "You need to be signed in to upload an app",
            type: "warning",
          });
        }
      } else {
        setIsloading(false);
        createNotification({
          title: "Enter release notes before you upload",
          type: "danger",
        });
      }
    },
    [appStoreDomain, appStoreUser?.token, botInfo, updateAppStoreUser]
  );
};

export const useRateAppStore = () => {
  const appStoreDomain = useAppStoreDomainContext();
  const appStoreUser = useAppStoreUserContext();
  return useCallback(
    (ratingInfo, setIsloading: Dispatch<SetStateAction<boolean>>) => {
      setIsloading(true);
      function errorCallback(payload: errorResponseCallBackParams) {
        setIsloading(false);
        createNotification({ title: "Failed to rate app", type: "danger" });
      }
      function successCallback(payload: successResponseCallBackParams) {
        if (payload.data.success) {
          setIsloading(false);
          createNotification({ title: "App rated successfully" });
        } else {
          errorCallback(payload);
        }
      }
      if (appStoreUser?.token) {
        sendAndInterpretBotUpdate({
          updatedData: ratingInfo,
          updateUrl: appStoreDomain + backendRoutes.appStoreRate,
          successCallback,
          errorCallback,
          withCredentials: true,
          token: appStoreUser.token,
        });
      } else {
        createNotification({
          title: "You need to be signed in to rate an app",
          type: "warning",
        });
      }
    },
    [appStoreDomain, appStoreUser?.token]
  );
};

export const usePublishApp = () => {
  const appStoreDomain = useAppStoreDomainContext();
  const appStoreUser = useAppStoreUserContext();
  return useCallback(
    (package_id: string, setIsloading: Dispatch<SetStateAction<boolean>>) => {
      setIsloading(true);
      function errorCallback(payload: errorResponseCallBackParams) {
        setIsloading(false);
        createNotification({ title: "Failed to publish app", type: "danger" });
      }
      function successCallback(payload: successResponseCallBackParams) {
        if (payload.data.success) {
          setIsloading(false);
          createNotification({ title: "App published successfully" });
        } else {
          errorCallback(payload);
        }
      }
      if (appStoreUser?.token) {
        sendAndInterpretBotUpdate({
          updatedData: { package_id },
          updateUrl: appStoreDomain + backendRoutes.appPublishApp,
          successCallback,
          errorCallback,
          withCredentials: true,
          token: appStoreUser.token,
        });
      } else {
        createNotification({
          title: "You need to be signed in to publish an app",
          type: "warning",
        });
      }
    },
    [appStoreDomain, appStoreUser?.token]
  );
};

export const useUnpublishApp = () => {
  const appStoreDomain = useAppStoreDomainContext();
  const appStoreUser = useAppStoreUserContext();
  return useCallback(
    (package_id: string, setIsloading: Dispatch<SetStateAction<boolean>>) => {
      setIsloading(true);
      function errorCallback(payload: errorResponseCallBackParams) {
        setIsloading(false);
        createNotification({
          title: "Failed to unpublish app",
          type: "danger",
        });
      }
      function successCallback(payload: successResponseCallBackParams) {
        if (payload.data.success) {
          setIsloading(false);
          createNotification({ title: "App unpublished successfully" });
        } else {
          errorCallback(payload);
        }
      }
      if (appStoreUser?.token) {
        sendAndInterpretBotUpdate({
          updatedData: { package_id },
          updateUrl: appStoreDomain + backendRoutes.appUnpublishApp,
          successCallback,
          errorCallback,
          withCredentials: true,
          token: appStoreUser.token,
        });
      } else {
        createNotification({
          title: "You need to be signed in to unpublish an app",
          type: "warning",
        });
      }
    },
    [appStoreDomain, appStoreUser?.token]
  );
};

export const useDeleteApp = () => {
  const appStoreDomain = useAppStoreDomainContext();
  const appStoreUser = useAppStoreUserContext();
  return useCallback(
    (package_id: string, setIsloading) => {
      setIsloading(true);
      function errorCallback(payload: errorResponseCallBackParams) {
        setIsloading(false);
        createNotification({ title: "Failed to delete app", type: "danger" });
      }
      function successCallback(payload: successResponseCallBackParams) {
        if (payload.data.success) {
          setIsloading(false);
          createNotification({ title: "App deleted successfully" });
        } else {
          errorCallback(payload);
        }
      }
      if (appStoreUser?.token) {
        sendAndInterpretBotUpdate({
          updatedData: { package_id },
          updateUrl: appStoreDomain + backendRoutes.appDeleteApp,
          successCallback,
          errorCallback,
          withCredentials: true,
          token: appStoreUser.token,
        });
      } else {
        createNotification({
          title: "You need to be signed in to delete an app",
          type: "warning",
        });
      }
    },
    [appStoreDomain, appStoreUser?.token]
  );
};

export const useAddToAppStoreCart = () => {
  const setAppStoreCart = useUpdateAppStoreCartContext();
  const cancelStorePayment = useCancelStorePayment();
  return useCallback(
    (app: AppStoreAppType) => {
      if (app?.categories?.[0]) {
        setAppStoreCart((prevCart) => {
          const newCart = {
            ...prevCart,
          };
          if (newCart?.[app.origin_package]) {
            newCart[app.origin_package][app.package_id] = app;
          } else {
            newCart[app.origin_package] = {
              [app.package_id]: app,
            };
          }
          localStorage.setItem("cart", JSON.stringify(newCart));
          return newCart;
        });
        cancelStorePayment(false);
        createNotification({ title: "Successfully added to the cart" });
        return;
      }
      createNotification({
        title: "Cant buy a non store app",
        type: "danger",
      });
    },
    [cancelStorePayment, setAppStoreCart]
  );
};

export const useRemoveFromAppStoreCart = () => {
  const setAppStoreCart = useUpdateAppStoreCartContext();
  return useCallback(
    (origin_package) => {
      setAppStoreCart((prevCart) => {
        const newCart = {
          ...prevCart,
        };
        if (newCart?.[origin_package]) {
          delete newCart[origin_package];
        }
        localStorage.setItem("cart", JSON.stringify(newCart));
        return newCart;
      });
      createNotification({ title: "Package removed from the cart" });
    },
    [setAppStoreCart]
  );
};

export const useCreatePaymentFromAppStoreCart = () => {
  const setAppStorePaymentUrl = useUpdateAppStorePaymentUrlContext();
  const appStoreDomain = useAppStoreDomainContext();
  const appStoreUser = useAppStoreUserContext();
  const updateAppStoreUser = useUpdateLoginToken();
  return useCallback(
    (setIsloading, origin_packages) => {
      setIsloading?.(true);
      function errorCallback(payload: errorResponseCallBackParams) {
        setIsloading?.(false);
        if (payload.data.message === "appstore.errors.notLoggedIn") {
          updateAppStoreUser({});
          createNotification({
            title: "You need to be signed in to complete your purchase",
            type: "danger",
          });
        } else {
          createNotification({
            title: "Failed create payment",
            type: "danger",
          });
        }
      }
      function successCallback(payload: successResponseCallBackParams) {
        if (payload.data.success) {
          setIsloading?.(false);
          const payment = {
            paymentUrl: payload.data.payment_url,
            cancelUrl: payload.data.cancel_url,
          };
          setAppStorePaymentUrl(payment);
          localStorage.setItem("payment", JSON.stringify(payment));
          window.open(payload.data.payment_url, "_blank")?.focus();
          createNotification({ title: "Payment created" });
          return;
        }
        errorCallback(payload);
      }
      if (appStoreUser?.token) {
        sendAndInterpretBotUpdate({
          updatedData: {
            origin_packages,
          },
          updateUrl: appStoreDomain + backendRoutes.appStoreCreatePayment,
          successCallback,
          errorCallback,
          withCredentials: true,
          token: appStoreUser.token,
        });
      } else {
        createNotification({
          title: "You need to be signed in to buy apps",
          type: "warning",
        });
      }
    },
    [
      appStoreDomain,
      appStoreUser?.token,
      setAppStorePaymentUrl,
      updateAppStoreUser,
    ]
  );
};

export const useCancelStorePayment = () => {
  const setAppStorePaymentUrl = useUpdateAppStorePaymentUrlContext();
  const appStorePaymentUrl = useAppStorePaymentUrlContext();
  return useCallback(
    (notification = true) => {
      if (appStorePaymentUrl?.cancelUrl) {
        fetch(appStorePaymentUrl?.cancelUrl);
        setAppStorePaymentUrl(undefined);
        localStorage.setItem("payment", JSON.stringify({}));
        if (notification) createNotification({ title: "Payment canceled" });
        return;
      }
      setAppStorePaymentUrl(undefined);
      createNotification({
        title: "Failed to cancel payment",
        type: "danger",
        message: "No cancel url found",
      });
    },
    [appStorePaymentUrl?.cancelUrl, setAppStorePaymentUrl]
  );
};

export const useCheckStorePayment = () => {
  const setAppStorePaymentUrl = useUpdateAppStorePaymentUrlContext();
  const appStorePaymentUrl = useAppStorePaymentUrlContext();
  const appStoreDomain = useAppStoreDomainContext();
  const appStoreUser = useAppStoreUserContext();
  const setAppStoreCart = useUpdateAppStoreCartContext();
  const fetchAppStoreData = useFetchAppStoreData();
  return useCallback(() => {
    const cancelUrl = appStorePaymentUrl?.cancelUrl.split("/");
    const checkInfo = {
      token: cancelUrl ? cancelUrl[cancelUrl.length - 1] : "",
    };
    function errorCallback() {
      createNotification({
        title: "Payment not detected yet",
        type: "warning",
      });
    }
    function successCallback(payload: successResponseCallBackParams) {
      if (payload.data?.is_paid) {
        fetchAppStoreData(false);
        setAppStoreCart({});
        localStorage.setItem("cart", JSON.stringify({}));
        setAppStorePaymentUrl(undefined);
        localStorage.setItem("payment", JSON.stringify({}));
        createNotification({
          title: "Payment successful",
          type: "info",
          message: "You can download the app now",
          duration: 50_000_000,
        });
        return;
      }
      errorCallback();
    }
    sendAndInterpretBotUpdate({
      updatedData: checkInfo,
      updateUrl: appStoreDomain + backendRoutes.appStoreCheckPayment,
      successCallback,
      errorCallback,
      withCredentials: true,
      token: appStoreUser?.token,
    });
  }, [
    appStoreDomain,
    appStorePaymentUrl?.cancelUrl,
    appStoreUser?.token,
    fetchAppStoreData,
    setAppStoreCart,
    setAppStorePaymentUrl,
  ]);
};

export const useGetUsers = () => {
  const appStoreDomain = useAppStoreDomainContext();
  const appStoreUser = useAppStoreUserContext();
  return useCallback(
    (
      setAppStoreUsers: Dispatch<SetStateAction<StoreUsersType | undefined>>
    ) => {
      function errorCallback(payload: errorResponseCallBackParams) {
        // createNotification({title: "Failed to load Users", "warning"})
      }
      function successCallback(payload: successResponseCallBackParams) {
        if (payload.data.success) {
          setAppStoreUsers(payload.data);
          // createNotification({title: "Successfully loaded users"})
        }
      }
      if (appStoreUser?.token) {
        sendAndInterpretBotUpdate({
          updateUrl: appStoreDomain + backendRoutes.appStoreUsers,
          successCallback,
          errorCallback,
          withCredentials: true,
          token: appStoreUser.token,
        });
      }
    },
    [appStoreDomain, appStoreUser?.token]
  );
};

export const useGetAffiliateDashboard = () => {
  const appStoreDomain = useAppStoreDomainContext();
  const appStoreUser = useAppStoreUserContext();
  return useCallback(
    (setAppStoreDashboardData) => {
      function errorCallback() {
        // createNotification({title: "Failed to load Users", "warning"})
      }
      function successCallback(payload: successResponseCallBackParams) {
        if (payload.data.success) {
          setAppStoreDashboardData(payload.data);
          // createNotification({title: "Successfully loaded users"})
        }
      }
      if (appStoreUser?.token) {
        sendAndInterpretBotUpdate({
          updateUrl: appStoreDomain + backendRoutes.appStoreAffiliateDashboard,
          successCallback,
          errorCallback,
          withCredentials: true,
          token: appStoreUser.token,
        });
      }
    },
    [appStoreDomain, appStoreUser?.token]
  );
};

export const useGetStorePayments = () => {
  const appStoreDomain = useAppStoreDomainContext();
  const appStoreUser = useAppStoreUserContext();
  return useCallback(
    (setStorePayments: Dispatch<SetStateAction<StorePayments | undefined>>) => {
      function errorCallback() {
        // createNotification({title: "Failed to load Users", "warning"})
      }
      function successCallback(payload: successResponseCallBackParams) {
        if (payload.data.success) {
          setStorePayments(payload.data);
          // createNotification({title: "Successfully loaded users"})
        }
      }
      if (appStoreUser?.token) {
        sendAndInterpretBotUpdate({
          updateUrl: appStoreDomain + backendRoutes.appStorePayments,
          successCallback,
          errorCallback,
          withCredentials: true,
          token: appStoreUser.token,
        });
      }
    },
    [appStoreDomain, appStoreUser?.token]
  );
};

export const useDeleteStoreUser = () => {
  const appStoreDomain = useAppStoreDomainContext();
  const appStoreUser = useAppStoreUserContext();
  return useCallback(
    (userId: string) => {
      function errorCallback() {
        createNotification({ title: "Failed to delete User", type: "warning" });
      }
      function successCallback(payload: successResponseCallBackParams) {
        if (payload.data.success) {
          createNotification({ title: "Successfully deleted user" });
        }
      }
      if (appStoreUser?.token) {
        sendAndInterpretBotUpdate({
          updatedData: { id: userId },
          updateUrl: appStoreDomain + backendRoutes.appStoreDeleteUser,
          successCallback,
          errorCallback,
          withCredentials: true,
          token: appStoreUser.token,
        });
      }
    },
    [appStoreDomain, appStoreUser?.token]
  );
};

export const useIsInAppStoreCart: () => (
  app: AppStoreAppType
) => boolean = () => {
  const appStoreCart = useAppStoreCartContext();
  return useCallback(
    (app: AppStoreAppType) => {
      return app?.origin_package && appStoreCart?.[app.origin_package]
        ? true
        : false;
    },
    [appStoreCart]
  );
};

export const useAppHasPremiumRequirement = () => {
  const appStoreCart = useAppStoreCartContext();
  return useCallback(
    (app: AppStoreAppType) => {
      if (app.price) {
        return true;
      } else if (app.requirements) {
        app.requirements?.forEach((requirement) => {});
      }
      return Boolean(appStoreCart?.[app.origin_package]);
    },
    [appStoreCart]
  );
};

export const useSignupToAppStore = () => {
  const appStoreDomain = useAppStoreDomainContext();
  const updateAppStoreUser = useUpdateLoginToken();
  return useCallback(
    (userData: LoginSignupFormType, onLoggedIn: () => void) => {
      signupToAppStore(
        updateAppStoreUser,
        appStoreDomain,
        userData,
        onLoggedIn
      );
    },
    [appStoreDomain, updateAppStoreUser]
  );
};

export const useInstallAnyAppPackage = () => {
  const installProfile = useInstallProfile();
  const installApp = useInstallAppPackage();
  return useCallback(
    (downloadInfo, app: AppStoreAppType, setIsloading, setOpen) => {
      if (app.categories?.[0] === strategyName) {
        installProfile(
          {
            ...downloadInfo,
            ...app,
          },
          setIsloading,
          setOpen
        );
      } else {
        installApp(downloadInfo, app, setIsloading, setOpen);
      }
    },
    [installApp, installProfile]
  );
};

export const useInstallAppPackage = () => {
  const botDomain = useBotDomainContext();
  const appStoreDomain = useAppStoreDomainContext();
  const appStoreUser = useAppStoreUserContext();
  return useCallback(
    (
      downloadInfo,
      app: AppStoreAppType,
      setIsloading: Dispatch<SetStateAction<boolean>>,
      setOpen: Dispatch<SetStateAction<boolean>>
    ) => {
      const _downloadInfo = {
        ...downloadInfo,
        ...app,
      };
      setIsloading(true);

      const successCallback = (payload: successResponseCallBackParams) => {
        createNotification({
          title: `Successfully installed ${_downloadInfo.title}`,
        });
        setIsloading(false);
        setOpen(false);
      };
      const errorCallback = (payload: errorResponseCallBackParams) => {
        createNotification({
          title: `Failed to install ${_downloadInfo.title}`,
          type: "danger",
        });
        setIsloading(false);
      };
      const requestData = {
        url: getAppUrlFromDownloadInfo(
          _downloadInfo,
          appStoreDomain,
          appStoreUser
        ),
        // version: `${
        //     downloadInfo.major_version
        // }.${
        //     downloadInfo.minor_version
        // }.${
        //     downloadInfo.bug_fix_version
        // }`
      };
      sendAndInterpretBotUpdate({
        updatedData: requestData,
        updateUrl: botDomain + backendRoutes.installApp,
        successCallback,
        errorCallback,
      });
    },
    [appStoreDomain, appStoreUser, botDomain]
  );
};

export const useUnInstallAppPackage = () => {
  const botDomain = useBotDomainContext();
  return useCallback(
    (
      app: AppStoreAppType,
      setIsloading: Dispatch<SetStateAction<boolean>>,
      setOpen: Dispatch<SetStateAction<boolean>>
    ) => {
      setIsloading(true);
      const successCallback = (payload: successResponseCallBackParams) => {
        createNotification({
          title: `Successfully uninstalled ${app.title}`,
        });
        setIsloading(false);
        setOpen(false);
      };
      const errorCallback = (payload: errorResponseCallBackParams) => {
        createNotification({
          title: `Failed to uninstall ${app.title}`,
          type: "danger",
        });
        setIsloading(false);
      };
      const requestData = [app.tentacle_name || app.package_id];
      sendAndInterpretBotUpdate({
        updatedData: requestData,
        updateUrl: botDomain + backendRoutes.uninstallApp,
        successCallback,
        errorCallback,
      });
    },
    [botDomain]
  );
};

export const useInstallProfile = () => {
  const appStoreDomain = useAppStoreDomainContext();
  const botDomain = useBotDomainContext();
  const appStoreUser = useAppStoreUserContext();
  return useCallback(
    (
      downloadInfo,
      setIsloading: Dispatch<SetStateAction<boolean>>,
      setOpen: Dispatch<SetStateAction<boolean>>
    ) => {
      setIsloading(true);
      const onFailInstall = (payload: errorResponseCallBackParams) => {
        setIsloading(false);
        createNotification({
          title: `Failed to install ${downloadInfo.title}`,
          type: "danger",
        });
      };
      const onSuccessInstall = (payload: successResponseCallBackParams) => {
        if (payload.data.success) {
          createNotification({
            title: `Successfully installed ${downloadInfo.title}`,
          });
          if (downloadInfo.should_select_profile) {
            const onSelectSuccess = () => {
              setIsloading(false);
              createNotification({
                title: `Successfully selected ${downloadInfo.title}`,
              });
              setOpen(false);
            };
            const onSelectFail = () => {
              createNotification({
                title: `Failed to select ${downloadInfo.title}`,
                type: "danger",
              });
              setOpen(false);
            };
            selectProfile(
              botDomain,
              downloadInfo.package_id,
              downloadInfo.title,
              onSelectSuccess,
              onSelectFail
            );
          } else {
            setIsloading(false);
            setOpen(false);
          }
        } else {
          onFailInstall(payload);
        }
      };
      sendAndInterpretBotUpdate({
        updatedData: {
          url: getAppUrlFromDownloadInfo(
            downloadInfo,
            appStoreDomain,
            appStoreUser
          ),
          name: downloadInfo.title,
        },
        updateUrl: botDomain + backendRoutes.importProfileFromUrl,
        successCallback: onSuccessInstall,
        errorCallback: onFailInstall,
      });
    },
    [appStoreDomain, appStoreUser, botDomain]
  );
};

function getAppUrlFromDownloadInfo(
  downloadInfo,
  appStoreDomain: string,
  appStoreUser: AppStoreUserType | undefined
) {
  return `${appStoreDomain}/download_app/${appStoreUser?.download_token}/${downloadInfo.major_version}/${downloadInfo.minor_version}/${downloadInfo.bug_fix_version}/${downloadInfo.origin_package}.zip`;
}

function useUpdateLoginToken() {
  const updateAppStoreUser = useUpdateAppStoreUserContext();
  return useCallback(
    (tokens: AppStoreUserType | undefined) => {
      localStorage.setItem("storeSession", JSON.stringify(tokens));
      updateAppStoreUser(tokens);
    },
    [updateAppStoreUser]
  );
}

export const AppStoreDataProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [appStoreData, setAppStoreData] = useState<AppStoreDataType>({});
  const [appStoreCart, setAppStoreCart] = useState<AppStoreCartType>({});
  const [appStoreCartIsOpen, setAppStoreCartIsOpen] = useState<boolean>(false);
  const [appStorePaymentUrl, setAppStorePaymentUrl] = useState<
    AppStorePaymentUrlType | undefined
  >(undefined);
  const [appStoreUserData, setAppStoreUserData] = useState<
    AppStoreUserType | undefined
  >(undefined);
  const [appStoreDomain, setAppStoreDomain] = useState<string>(defaultDomain);
  const fetchAppStoreData = useFetchAppStoreData();
  const botInfo = useBotInfoContext();
  useEffect(() => {
    const cookie = localStorage.getItem("storeSession");
    if (cookie && cookie !== "undefined") {
      setAppStoreUserData(JSON.parse(cookie));
    }
    const cart = localStorage.getItem("cart");
    if (cart && cart !== "undefined") {
      setAppStoreCart(JSON.parse(cart));
    }
    const payment = localStorage.getItem("payment");
    if (payment && payment !== "undefined") {
      setAppStorePaymentUrl(JSON.parse(payment));
    }
  }, []);
  useEffect(() => {
    if (appStoreDomain) {
      fetchAppStoreData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appStoreDomain, botInfo]);
  return (
    <AppStoreDataContext.Provider value={appStoreData}>
      <UpdateAppStoreDataContext.Provider value={setAppStoreData}>
        <AppStoreCartContext.Provider value={appStoreCart}>
          <UpdateAppStoreCartContext.Provider value={setAppStoreCart}>
            <AppStoreCartIsOpenContext.Provider value={appStoreCartIsOpen}>
              <UpdateAppStoreCartIsOpenContext.Provider
                value={setAppStoreCartIsOpen}
              >
                <AppStoreDomainContext.Provider value={appStoreDomain}>
                  <UpdateAppStoreUserContext.Provider
                    value={setAppStoreUserData}
                  >
                    <AppStoreUserContext.Provider value={appStoreUserData}>
                      <AppStorePaymentUrlContext.Provider
                        value={appStorePaymentUrl}
                      >
                        <UpdateAppStorePaymentUrlContext.Provider
                          value={setAppStorePaymentUrl}
                        >
                          <UpdateAppStoreDomainContext.Provider
                            value={setAppStoreDomain}
                          >
                            {children}
                          </UpdateAppStoreDomainContext.Provider>
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
