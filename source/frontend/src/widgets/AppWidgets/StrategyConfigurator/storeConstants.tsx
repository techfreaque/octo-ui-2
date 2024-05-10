import {
  AppStorePublishStatusType,
  AppStoreVersionTagType,
  AppStoreVersionTypeType,
  StoreCategoryType,
  StrategyCategoryType,
  StrategyModeCategoryType,
} from "../../../context/data/AppStoreDataProvider";

export const hiddenCategories: StoreCategoryType[] = ["Legacy Strategy"];
export type StrategyModeSettingsNameType = "Strategy Mode Settings";
export const strategyModeSettingsName: StrategyModeSettingsNameType =
  "Strategy Mode Settings";
export const strategyName: StrategyCategoryType = "Strategy";
export const strategyModeName: StrategyModeCategoryType = "Strategy Mode";
export const appPackagesName: StoreCategoryType = "App Packages";

export const AppPublishStatus: {
  [key in AppStorePublishStatusType]: AppStorePublishStatusType;
} = {
  draft: "draft",
  published: "published",
  unpublished: "unpublished",
};

export interface AppVersionTypeInfoType {
  title: string;
  key: AppStoreVersionTypeType;
}

export const appVersionTypes: {
  [key: string]: AppVersionTypeInfoType;
} = {
  BUG_FIX_VERSION: {
    title: "Minor Bug Fix Update",
    key: "bug_fix_version",
  },
  MINOR_VERSION: {
    title: "Minor Update",
    key: "minor_version",
  },
  MAJOR_VERSION: {
    title: "Major Update",
    key: "major_version",
  },
};

export const appVersionTags: {
  [key: string]: {
    title: string;
    key: AppStoreVersionTagType;
  };
} = {
  BETA_VERSION: {
    title: "Beta Version",
    key: "beta_version",
  },
  STABLE_VERSION: {
    title: "Stable Version",
    key: "stable_version",
  },
  ALPHA_VERSION: {
    title: "Alpha Version",
    key: "alpha_version",
  },
};
