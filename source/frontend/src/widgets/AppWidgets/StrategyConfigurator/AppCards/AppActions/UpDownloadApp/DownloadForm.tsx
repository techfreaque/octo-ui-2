import { DownloadOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Grid } from "@mui/material";
import { Alert, Card, Tooltip, Typography } from "antd";
import { t } from "i18next";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Trans } from "react-i18next";

import AntButton from "../../../../../../components/Buttons/AntButton";
import AppIconButton from "../../../../../../components/Buttons/AppIconButton";
import AntTable, {
  AntTableDataType,
} from "../../../../../../components/Tables/AntTable";
import { useBotColorsContext } from "../../../../../../context/config/BotColorsProvider";
import {
  AppStoreAppType,
  AppStoreAppVersionType,
  AppStoreVersionTagType,
  useAddToAppStoreCart,
  useAppStoreDataContext,
  useIsInAppStoreCart,
  useUpdateAppStoreCartIsOpenContext,
} from "../../../../../../context/data/AppStoreDataProvider";
import { appPackagesName, strategyName } from "../../../storeConstants";
import { DownloadInfo } from "../../AppCard";
import { IsInstalledIcon, IsNotInstalledIcon } from "../../AppCover";

export default function AppDownloadForm({
  setDownloadInfo,
  downloadInfo,
  app,
  handleDownload,
}: {
  setDownloadInfo: Dispatch<SetStateAction<DownloadInfo>>;
  downloadInfo: DownloadInfo;
  app: AppStoreAppType;
  handleDownload: (
    setOpen: (isOpen: boolean) => void,
    otherApp: AppStoreAppType | undefined
  ) => void;
}) {
  return (
    <div style={{ marginRight: "20px" }}>
      {/* <UpdateAvailable/>
            <UpToDate app={app}/> */}
      <AppVersions
        app={app}
        handleDownload={handleDownload}
        setDownloadInfo={setDownloadInfo}
        downloadInfo={downloadInfo}
      />
    </div>
  );
}

// function UpdateAvailable() {
//     const {Title} = Typography;
//     return (
//         <div style={
//             {
//                 display: 'flex',
//                 alignItems: 'center'
//             }
//         }>
//             <Badge count={
//                     (
//                         <ExclamationCircleFilled style={
//                             {
//                                 color: '#faad14',
//                                 fontSize: '14px'
//                             }
//                         }/>
//                     )
//                 }
//                 offset={
//                     [-3, 20]
//             }>
//                 <SyncOutlined style={
//                     {fontSize: '24px'}
//                 }/>
//             </Badge>
//             <Title level={3}
//                 style={
//                     {
//                         marginLeft: '10px',
//                         marginBottom: '0px'
//                     }
//             }>
//                 Update available</Title>
//         </div>
//     )
// }

// function UpToDate(app) {
//     const {Title} = Typography;
//     const category = app?.categories?.length > 1 ? 'Package' : app?.categories?.[0]
//     return (
//         <div style={
//             {
//                 display: 'flex',
//                 alignItems: 'center'
//             }
//         }>
//             <Badge count={
//                     (
//                         <CheckCircleFilled style={
//                             {
//                                 color: '#5aef70',
//                                 fontSize: '14px'
//                             }
//                         }/>
//                     )
//                 }
//                 offset={
//                     [-3, 20]
//             }>
//                 <SyncOutlined style={
//                     {fontSize: '24px'}
//                 }/>
//             </Badge>
//             <Title level={3}
//                 style={
//                     {
//                         marginLeft: '10px',
//                         marginBottom: '0px'
//                     }
//             }>
//                 Your {category}
//                 is up to date</Title>
//         </div>
//     )
// }

const versionTypes: {
  label: string;
  icon: string;
  toolTipText: string;
  key: AppStoreVersionTagType;
}[] = [
  {
    label: t("appStore.appCard.downloadApp.alpha-versions"),
    icon: t("appStore.appCard.downloadApp.alpha-veriosn-icon"),

    toolTipText: t("appStore.appCard.downloadApp.switch-to-the-alpha-version"),
    key: "alpha_version",
    // disabled: true
  },
  {
    label: t("appStore.appCard.downloadApp.beta-versions"),
    icon: t("appStore.appCard.downloadApp.beta-version-icon"),

    toolTipText: t("appStore.appCard.downloadApp.switch-to-the-beta-version"),
    key: "beta_version",
    // disabled: true
  },
  {
    label: t("appStore.appCard.downloadApp.stable-versions"),
    icon: t("appStore.appCard.downloadApp.stable-version-icon"),

    toolTipText: t("appStore.appCard.downloadApp.switch-to-the-stable-version"),
    key: "stable_version",
    // disabled: true
  },
];

interface VersionDataToDisplay extends AntTableDataType {
  key: string;
  major_version: number;
  minor_version: number;
  bug_fix_version: number;
  title: JSX.Element;
}

function AppVersions({
  app,
  setDownloadInfo,
  downloadInfo,
  handleDownload,
}: {
  app: AppStoreAppType;
  setDownloadInfo: Dispatch<SetStateAction<DownloadInfo>>;
  downloadInfo: DownloadInfo;
  handleDownload: (
    setOpen: (isOpen: boolean) => void,
    otherApp: AppStoreAppType | undefined
  ) => void;
}) {
  // const [versionType, setVersionType] = useState("stable_version")
  const botColors = useBotColorsContext();

  const reversedVersions = app.versions?.reverse();
  const preSorteddata: VersionDataToDisplay[] | undefined = reversedVersions
    ?.filter((version) =>
      downloadInfo?.visibleVersionTypes?.includes(version.version_tag)
    )
    .map((version) => {
      const title = `${version.major_version}.${version.minor_version}.${
        version.bug_fix_version
      } ${versionTagKeyToTitle[version.version_tag]} - ${app.title}`;
      const isSelected =
        version.major_version === downloadInfo?.major_version &&
        version.minor_version === downloadInfo?.minor_version &&
        version.bug_fix_version === downloadInfo?.bug_fix_version;
      return {
        id: title,
        key: title,
        major_version: version.major_version,
        minor_version: version.minor_version,
        bug_fix_version: version.bug_fix_version,
        title: (
          <div
            onClick={() =>
              handdleVersionSelect(
                setDownloadInfo,
                version,
                handleAccordionChange
              )
            }
            style={
              isSelected
                ? {
                    color: botColors?.fontActive,
                  }
                : {}
            }
          >
            {title}
          </div>
        ),
      };
    });
  useEffect(() => {
    const firtVersion = reversedVersions?.[0];
    setDownloadInfo((prevDownloadInfo) => ({
      ...prevDownloadInfo,
      visibleVersionTypes: ["stable_version", "alpha_version", "beta_version"],
      major_version: firtVersion?.major_version,
      minor_version: firtVersion?.minor_version,
      bug_fix_version: firtVersion?.bug_fix_version,
      versionDetailsOpen: !!reversedVersions?.length,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reversedVersions]);

  function handleVersionFilterChange(versionTypeKey: AppStoreVersionTagType) {
    setDownloadInfo((prevDownloadInfo) => ({
      ...prevDownloadInfo,
      visibleVersionTypes: downloadInfo?.visibleVersionTypes?.includes(
        versionTypeKey
      )
        ? downloadInfo.visibleVersionTypes.filter(
            (thissVersionKey) => thissVersionKey !== versionTypeKey
          )
        : [...(downloadInfo?.visibleVersionTypes || []), versionTypeKey],
    }));
  }
  function handleAccordionChange(detailsOpen: boolean) {
    setDownloadInfo((prevDownloadInfo) => ({
      ...prevDownloadInfo,
      versionDetailsOpen: detailsOpen,
    }));
  }
  const selectedVersion = app?.versions?.filter(
    (version) =>
      downloadInfo?.major_version === version.major_version &&
      downloadInfo?.minor_version === version.minor_version &&
      downloadInfo?.bug_fix_version === version.bug_fix_version
  )?.[0];

  return (
    <>
      <VersionSelector
        app={app}
        handleAccordionChange={handleAccordionChange}
        handleVersionFilterChange={handleVersionFilterChange}
        downloadInfo={downloadInfo}
        preSorteddata={preSorteddata}
      />
      <div
        style={{
          marginTop: "20px",
          marginBottom: "10px",
          // width: "350px"
        }}
      >
        {selectedVersion && downloadInfo.versionDetailsOpen && (
          <>
            <Typography.Title level={3}>
              {t(
                "appStore.appCard.downloadApp.v-major_version-minor_version-bug_fix_version-version_tag-details",

                {
                  majorVersion: selectedVersion.major_version,
                  minorVersion: selectedVersion.minor_version,
                  bugFixVersion: selectedVersion.bug_fix_version,
                  versionTag: versionTagKeyToTitle[selectedVersion.version_tag],
                }
              )}
            </Typography.Title>
            <Alert
              type="info"
              showIcon={true}
              message={t(
                "appStore.appCard.downloadApp.appTitle-is-part-of-these-packages",
                { appTitle: app.title }
              )}
              style={{ marginBottom: "5px" }}
            />

            <RequiredPackages
              app={app}
              selectedVersion={selectedVersion}
              downloadInfo={downloadInfo}
              handleDownload={handleDownload}
              setDownloadInfo={setDownloadInfo}
            />

            <Typography.Title level={5}>
              {t(
                "appStore.appCard.downloadApp.release-notes-of-appTitle-v-major_version-minor_version-bug_fix_version-version_tag",

                {
                  appTitle: app.title,
                  majorVersion: selectedVersion.major_version,
                  minorVersion: selectedVersion.minor_version,
                  bugFixVersion: selectedVersion.bug_fix_version,
                  versionTag: versionTagKeyToTitle[selectedVersion.version_tag],
                }
              )}
            </Typography.Title>
            <Typography.Text> {selectedVersion.release_notes} </Typography.Text>
          </>
        )}
      </div>
    </>
  );
}

type RequiredAppsByTentaclePackageType = {
  [originPackageId: string]: AppStoreAppType[];
};

function RequiredPackages({
  app,
  selectedVersion,
  downloadInfo,
  handleDownload,
  setDownloadInfo,
}: {
  app: AppStoreAppType;
  selectedVersion: AppStoreAppVersionType;
  downloadInfo: DownloadInfo;
  handleDownload: (
    setOpen: (isOpen: boolean) => void,
    otherApp: AppStoreAppType | undefined
  ) => void;
  setDownloadInfo: Dispatch<SetStateAction<DownloadInfo>>;
}) {
  const appStoreData = useAppStoreDataContext();
  const requiredAppsByTentaclePackage: RequiredAppsByTentaclePackageType = {};
  const requiredApps: string[] = [
    `${app.package_id}`,
    ...(selectedVersion?.requirements ? selectedVersion.requirements : []),
  ];
  let requirementsSatisfied = true;
  requiredApps.forEach((requirement, index) => {
    appStoreData &&
      Object.values(appStoreData).forEach((apps) => {
        Object.values(apps).forEach((potentialRequiredApp) => {
          if (potentialRequiredApp.package_id !== requirement) {
            return;
          }
          const potentialOriginPackage = potentialRequiredApp.origin_package;
          if (!requiredAppsByTentaclePackage[potentialOriginPackage]) {
            requiredAppsByTentaclePackage[potentialOriginPackage] = [];
          }
          requiredAppsByTentaclePackage[potentialOriginPackage]?.push(
            potentialRequiredApp
          );

          const packageInstalled = requiredAppsByTentaclePackage[
            potentialOriginPackage
          ]?.every((thisApp) => {
            return thisApp?.is_installed;
          });
          requirementsSatisfied =
            (requirementsSatisfied && (index === 0 || packageInstalled)) ||
            false;
        });
      });
  });
  return (
    <Grid container spacing={2}>
      {requiredAppsByTentaclePackage &&
        Object.entries(
          requiredAppsByTentaclePackage
        ).map(([requiredAppPackageName, requiredAppsInPackage], index) => (
          <RequiredPackage
            key={`${app.package_id}${index}`}
            app={app}
            requirementsSatisfied={requirementsSatisfied}
            isMainPackage={index === 0}
            requiredAppsInPackage={requiredAppsInPackage}
            requiredAppPackageName={requiredAppPackageName}
            downloadInfo={downloadInfo}
            handleDownload={handleDownload}
            setDownloadInfo={setDownloadInfo}
          />
        ))}
    </Grid>
  );
}

function RequiredPackage({
  app,
  requiredAppPackageName,
  requiredAppsInPackage,
  downloadInfo,
  handleDownload,
  setDownloadInfo,
  requirementsSatisfied,
  isMainPackage,
}: {
  app: AppStoreAppType;
  requiredAppPackageName: string;
  requiredAppsInPackage: AppStoreAppType[];
  downloadInfo: DownloadInfo;
  handleDownload: (
    setOpen: (isOpen: boolean) => void,
    otherApp: AppStoreAppType | undefined
  ) => void;
  setDownloadInfo: Dispatch<SetStateAction<DownloadInfo>>;
  requirementsSatisfied: boolean;
  isMainPackage: boolean;
}) {
  const botColors = useBotColorsContext();
  const mainPackageApp = requiredAppsInPackage[0] as AppStoreAppType;
  const packageInstalled = requiredAppsInPackage.every((thisApp) => {
    return thisApp?.is_installed;
  });
  const [showAllAppsInpackage, setShowAllAppsInpackage] = useState(false);
  return (
    <Grid item xs={12} md={6} lg={4} style={{ height: "100%" }}>
      <Card
        key={requiredAppPackageName}
        style={{
          marginBottom: "5px",
          height: "100%",
        }}
      >
        <Tooltip
          title={
            packageInstalled
              ? t(
                  "appStore.appCard.downloadApp.the-app-package-is-already-installed"
                )
              : t(
                  "appStore.appCard.downloadApp.the-app-package-isnt-installed-yet"
                )
          }
        >
          <div>
            <Typography.Title level={5} style={{ marginBottom: "5px" }}>
              {packageInstalled ? (
                <IsInstalledIcon topRight={false} />
              ) : (
                <IsNotInstalledIcon topRight={false} />
              )}
              <span>
                {mainPackageApp.categories?.[0] === strategyName
                  ? mainPackageApp.title
                  : requiredAppPackageName}
              </span>
            </Typography.Title>
          </div>
        </Tooltip>
        <Typography.Paragraph style={{ marginBottom: "5px" }}>
          {!packageInstalled &&
            (mainPackageApp.price
              ? t("appStore.appCard.downloadApp.appPrice-month", {
                  appPrice: mainPackageApp.price,
                })
              : t("appStore.appCard.downloadApp.appPrice-free"))}
        </Typography.Paragraph>
        <Trans i18nKey="appStore.appCard.downloadApp.required-apps" />
        <ul>
          {requiredAppsInPackage.map((requiredApp, index) => (
            <Tooltip
              title={
                requiredApp?.is_installed
                  ? t(
                      "appStore.appCard.downloadApp.the-app-is-already-installed"
                    )
                  : t("appStore.appCard.downloadApp.the-app-isnt-installed-yet")
              }
              key={`${requiredApp?.package_id}${index}`}
            >
              <div style={{ display: "flex" }}>
                {requiredApp.is_installed ? (
                  <IsInstalledIcon topRight={false} />
                ) : (
                  <IsNotInstalledIcon topRight={false} />
                )}
                <span style={{ marginLeft: "5px" }}>
                  {`${requiredApp?.title}`}
                </span>
              </div>
            </Tooltip>
          ))}
        </ul>
        <div
          onClick={() => setShowAllAppsInpackage((prevState) => !prevState)}
          style={{
            cursor: "pointer",
            ...(showAllAppsInpackage ? {} : { color: botColors?.fontActive }),
          }}
        >
          <Trans i18nKey="appStore.appCard.downloadApp.all-included-apps-in-package" />
        </div>
        {showAllAppsInpackage && (
          <AllAppsInPackage requiredAppPackage={requiredAppPackageName} />
        )}
        <DownloadPackageButton
          handleDownload={handleDownload}
          mainPackageApp={mainPackageApp}
          packageInstalled={packageInstalled}
          setDownloadInfo={setDownloadInfo}
          app={app}
          requirementsSatisfied={requirementsSatisfied}
          isMainPackage={isMainPackage}
          downloadInfo={downloadInfo}
        />
      </Card>
    </Grid>
  );
}

function AllAppsInPackage({
  requiredAppPackage,
}: {
  requiredAppPackage: string;
}) {
  const appStoreData = useAppStoreDataContext();

  return (
    <ul>
      {appStoreData &&
        Object.entries(appStoreData).map(([category, categoryApps]) => {
          return (
            category !== appPackagesName && (
              <div key={category}>
                {Object.keys(categoryApps).map((app_id) => {
                  const potentialAppInPackage = categoryApps[app_id];
                  if (
                    potentialAppInPackage?.origin_package === requiredAppPackage
                  ) {
                    return (
                      <div key={`${category}${app_id}`}>
                        {potentialAppInPackage.title}
                      </div>
                    );
                  }
                  return <></>;
                })}
              </div>
            )
          );
        })}
    </ul>
  );
}

function DownloadPackageButton({
  handleDownload,
  setDownloadInfo,
  downloadInfo,
  mainPackageApp,
  packageInstalled,
  app,
  requirementsSatisfied,
  isMainPackage,
}: {
  handleDownload: (
    setOpen: (isOpen: boolean) => void,
    otherApp: AppStoreAppType | undefined
  ) => void;
  setDownloadInfo: Dispatch<SetStateAction<DownloadInfo>>;
  downloadInfo: DownloadInfo;
  mainPackageApp: AppStoreAppType;
  packageInstalled: boolean;
  app: AppStoreAppType;
  requirementsSatisfied: boolean;
  isMainPackage: boolean;
}) {
  const addAppStoreCart = useAddToAppStoreCart();
  const checkIsInStoreCart = useIsInAppStoreCart();
  const isOriginPackage = mainPackageApp?.origin_package === app.origin_package;
  const mainPackageInCart = checkIsInStoreCart(mainPackageApp);
  const setOpenBasket = useUpdateAppStoreCartIsOpenContext();

  function thisHandleDownload() {
    handleDownload(
      (isDownloading) =>
        setDownloadInfo((prevInfo) => ({
          ...prevInfo,
          isDownloading,
        })),
      isOriginPackage ? undefined : mainPackageApp
    );
  }
  if (isMainPackage && !requirementsSatisfied) {
    return (
      <Tooltip
        title={t(
          "appStore.appCard.downloadApp.all-requirements-must-be-satisfied-before-you-can-download-this-app"
        )}
      >
        <div>
          <AntButton
            block={true}
            style={{ marginTop: "10px" }}
            disabled={true}
            antIconComponent={DownloadOutlined}
          >
            <Trans i18nKey="appStore.appCard.downloadApp.download-now" />
          </AntButton>
        </div>
      </Tooltip>
    );
  } else if (
    packageInstalled &&
    (!mainPackageApp.price || mainPackageApp.has_paid)
  ) {
    return mainPackageApp.updated_by_distro ? (
      <></>
    ) : (
      <AntButton
        block={true}
        style={{ marginTop: "10px" }}
        disabled={downloadInfo.isDownloading}
        onClick={thisHandleDownload}
        antIconComponent={DownloadOutlined}
      >
        <Trans i18nKey="appStore.appCard.downloadApp.update-now" />
      </AntButton>
    );
  } else if (mainPackageApp.price) {
    if (mainPackageApp.has_paid) {
      return (
        <AntButton
          block={true}
          style={{ marginTop: "10px" }}
          onClick={thisHandleDownload}
          antIconComponent={DownloadOutlined}
        >
          <Trans i18nKey="appStore.appCard.downloadApp.download-now" />
        </AntButton>
      );
    } else if (mainPackageInCart) {
      return (
        <AntButton
          block={true}
          style={{ marginTop: "10px" }}
          onClick={() => setOpenBasket(true)}
          antIconComponent={ShoppingCartOutlined}
        >
          <Trans i18nKey="appStore.appCard.downloadApp.go-to-shopping-basket" />
        </AntButton>
      );
    } else {
      return (
        <AntButton
          block={true}
          style={{ marginTop: "10px" }}
          onClick={() => addAppStoreCart(mainPackageApp)}
          antIconComponent={ShoppingCartOutlined}
        >
          <Trans i18nKey="appStore.appCard.downloadApp.add-to-shopping-basket" />
        </AntButton>
      );
    }
  } else {
    return (
      <AntButton
        block={true}
        style={{ marginTop: "10px" }}
        disabled={mainPackageInCart}
        onClick={thisHandleDownload}
        antIconComponent={DownloadOutlined}
      >
        <Trans i18nKey="appStore.appCard.downloadApp.download-for-free" />
      </AntButton>
    );
  }
}

function VersionSelector({
  app,
  handleAccordionChange,
  handleVersionFilterChange,
  downloadInfo,
  preSorteddata,
}: {
  app: AppStoreAppType;
  handleAccordionChange: (detailsOpen: boolean) => void;
  handleVersionFilterChange: (versionTypeKey: AppStoreVersionTagType) => void;
  downloadInfo: DownloadInfo;
  preSorteddata: VersionDataToDisplay[] | undefined;
}) {
  return (
    <div style={{ marginTop: "20px" }}>
      <Typography.Title level={3} onClick={() => handleAccordionChange(false)}>
        {downloadInfo.versionDetailsOpen
          ? t("appStore.appCard.downloadApp.see-all-versions-of-app-title", {
              appTitle: app.title,
            })
          : t("appStore.appCard.downloadApp.versions-of-app-title", {
              appTitle: app.title,
            })}
      </Typography.Title>
      <div
        style={
          downloadInfo.versionDetailsOpen
            ? {
                display: "none",
              }
            : {
                display: "flex",
              }
        }
      >
        {versionTypes.map((versionTypeObj) => (
          <AppIconButton
            key={versionTypeObj.key}
            isSelected={false}
            active={downloadInfo?.visibleVersionTypes?.includes(
              versionTypeObj.key
            )}
            buttonTitle={versionTypeObj.label}
            disabled={false}
            icon={<>{versionTypeObj.icon}</>}
            onClick={() => handleVersionFilterChange(versionTypeObj.key)}
          />
        ))}
      </div>
      <div
        style={{
          maxHeight: "250px",
          overflowY: "auto",
          ...(downloadInfo.versionDetailsOpen
            ? {
                display: "none",
              }
            : {}),
        }}
      >
        {preSorteddata && (
          <AntTable
            maxWidth="100%"
            columns={versionColumns}
            data={preSorteddata}
          />
        )}
      </div>
    </div>
  );
}

const versionTagKeyToTitle = {
  alpha_version: t('appStore.appCard.downloadApp.alpha-version'),
  beta_version: t('appStore.appCard.downloadApp.beta-version'),
  stable_version: t('appStore.appCard.downloadApp.stable-version'),
};

// const defaultTentaclePackages = {
//     "OctoBot-Default-Tentacles": {},
//     "Matrix-Basic-Tentacles": {}

// }

const versionColumns = [
  {
    title: t("appStore.appCard.downloadApp.select-a-version"),
    dataIndex: "title",
    key: "title",
  },
];

function handdleVersionSelect(
  setDownloadInfo: Dispatch<SetStateAction<DownloadInfo>>,
  version: AppStoreAppVersionType,
  handleAccordionChange: (detailsOpen: boolean) => void
) {
  handleAccordionChange(true);

  setDownloadInfo((prevDownloadInfo) => ({
    ...prevDownloadInfo,
    should_select_profile: false,
    major_version: version.major_version,
    minor_version: version.minor_version,
    bug_fix_version: version.bug_fix_version,
  }));
}
