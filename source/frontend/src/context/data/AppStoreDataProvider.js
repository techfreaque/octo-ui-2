import React, { useState, useContext, createContext } from "react";
import { useCallback } from "react";
import { installAppPackage } from "../../api/actions";
import { fetchAppStoreData } from "../../api/data";
import { useBotDomainContext } from "../config/BotDomainProvider";


const AppStoreDataContext = createContext();
const UpdateAppStoreDataContext = createContext();

export const useSaveAppStoreDataContext = () => {
  return useContext(UpdateAppStoreDataContext);
};

export const useAppStoreDataContext = () => {
  return useContext(AppStoreDataContext);
};

export const useFetchAppStoreData = () => {
  const _saveAppStoreData = useSaveAppStoreDataContext()
  const botDomain = useBotDomainContext()
  const logic = useCallback(() => {
    fetchAppStoreData(_saveAppStoreData, botDomain)
  }, [_saveAppStoreData, botDomain]);
  return logic;
}

export const useInstallAppPackage = () => {
  const botDomain = useBotDomainContext()
  const logic = useCallback((packageUrl, packageNameAndVersion, token) => {
    installAppPackage(packageUrl, packageNameAndVersion, botDomain, token)
  }, [botDomain]);
  return logic;
}

export const AppStoreDataProvider = ({ children }) => {
  const [appStoreData, setAppStoreData] = useState({});
  return (
    <AppStoreDataContext.Provider value={appStoreData}>
      <UpdateAppStoreDataContext.Provider value={setAppStoreData}>
        {children}
      </UpdateAppStoreDataContext.Provider>
    </AppStoreDataContext.Provider>
  );
};
