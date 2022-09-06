import React, { useState, useContext, createContext } from "react";
import { useCallback } from "react";
import { fetchAppStoreData } from "../api/botData";
import { useBotDomainContext } from "./BotDomainProvider";

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
  const _saveAppStoreData = useSaveAppStoreDataContext()
  const botDomain = useBotDomainContext()
  const logic = useCallback((packageUrl) => {
    fetchAppStoreData(_saveAppStoreData, botDomain)        
  }, [_saveAppStoreData, botDomain]);
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
