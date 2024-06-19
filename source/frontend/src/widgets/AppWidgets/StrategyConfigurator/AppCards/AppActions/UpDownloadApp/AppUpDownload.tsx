import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  DollarOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import type { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import { Modal, Tooltip, Typography } from "antd";
import { t } from "i18next";
import type {
  Dispatch,
  ForwardRefExoticComponent,
  RefAttributes,
  SetStateAction,
} from "react";
import { Trans } from "react-i18next";

import AntButton from "../../../../../../components/Buttons/AntButton";
import { buttonTypes } from "../../../../../../components/Buttons/AntButton";
import AppIconButton from "../../../../../../components/Buttons/AppIconButton";
import type { AppStoreAppType } from "../../../../../../context/data/AppStoreDataProvider";
import {
  useAppStoreUserContext,
  validateUploadInfo,
} from "../../../../../../context/data/AppStoreDataProvider";
import { strategyModeName, strategyName } from "../../../storeConstants";
import type { DownloadInfo, UploadInfo } from "../../AppCard";
import { handlePopConfirmOpen } from "../AppActions";
import AppDownloadForm from "./DownloadForm";
import UploadAppForm from "./UploadAppForm";

export default function AppUpDownload({
  app,
  handleUpload,
  setUploadInfo,
  uploadInfo,
  handleDownload,
  downloadInfo,
  setDownloadInfo,
}: {
  app: AppStoreAppType;
  handleUpload: (callback: (isOpen: boolean) => void) => void;
  setUploadInfo: Dispatch<SetStateAction<UploadInfo>>;
  uploadInfo: UploadInfo;
  handleDownload: (
    setOpen: (isOpen: boolean) => void,
    otherApp: AppStoreAppType | undefined,
  ) => void;
  downloadInfo: DownloadInfo;
  setDownloadInfo: Dispatch<SetStateAction<DownloadInfo>>;
}) {
  const appStoreUser = useAppStoreUserContext();
  const isSignedIn = Boolean(appStoreUser?.token);
  if (app.is_installed) {
    if (app.is_owner) {
      if (app.is_from_store) {
        const buttonText = t("appStore.appCard.uploadApp.publish-update");
        return (
          handleUpload && (
            <UpDownloadloadAppModal
              onConfirm={() =>
                handleUpload((isOpen: boolean) => {
                  handlePopConfirmOpen(setUploadInfo, isOpen);
                })
              }
              antIconComponent={CloudUploadOutlined}
              confirmButtonIcon={CloudUploadOutlined}
              isSelected={app.is_selected}
              smallModal={true}
              confirmTitle={buttonText}
              disabled={!isSignedIn}
              formIsValidated={validateUploadInfo(uploadInfo)}
              open={uploadInfo.open}
              setInfo={setUploadInfo}
              disabledTooltipTitle={t(
                "appStore.appCard.uploadApp.you-need-to-be-signed-in-to-publish-an-update",
              )}
              confirmDescription={
                <UploadAppForm
                  setUploadInfo={setUploadInfo}
                  uploadInfo={uploadInfo}
                  app={app}
                />
              }
              confirmButtonText={buttonText}
              buttonTitle={buttonText}
            />
          )
        );
      }
      const buttonText =
        app.categories[0] === strategyModeName
          ? t("appStore.appCard.uploadApp.sell-strat-mode")
          : app.categories[0] === strategyName
            ? t("appStore.appCard.uploadApp.sell-strategy")
            : t("appStore.appCard.uploadApp.sell-app");

      const confirmButtonText =
        app.categories[0] === strategyModeName
          ? t("appStore.appCard.uploadApp.publish-strat-mode-now")
          : app.categories[0] === strategyName
            ? t("appStore.appCard.uploadApp.publish-strategy-now")
            : t("appStore.appCard.uploadApp.publish-app-now");
      const isValidated = validateUploadInfo(uploadInfo);
      return (
        handleUpload && (
          <UpDownloadloadAppModal
            onConfirm={() =>
              handleUpload((isOpen: boolean) =>
                handlePopConfirmOpen(setUploadInfo, isOpen),
              )
            }
            isSelected={app.is_selected}
            smallModal={true}
            antIconComponent={DollarOutlined}
            confirmButtonIcon={DollarOutlined}
            confirmTitle={confirmButtonText}
            disabled={!isSignedIn}
            formIsValidated={isValidated}
            open={uploadInfo.open}
            setInfo={setUploadInfo}
            disabledTooltipTitle={t(
              "appStore.appCard.uploadApp.you-need-to-be-signed-in-to-sell-an-app",
            )}
            confirmDescription={
              <UploadAppForm
                setUploadInfo={setUploadInfo}
                uploadInfo={uploadInfo}
                app={app}
              />
            }
            confirmButtonText={confirmButtonText}
            buttonTitle={buttonText}
          />
        )
      );
    } else {
      const buttonText = t("appStore.appCard.downloadApp.update-appCategory", {
        appCategory: app.categories[0],
      });

      return (
        handleDownload && (
          <UpDownloadloadAppModal // onConfirm={handleDownload}
            antIconComponent={CloudDownloadOutlined}
            // confirmButtonIcon={CloudDownloadOutlined}

            confirmTitle={buttonText}
            isSelected={app.is_selected}
            disabled={!isSignedIn || app.updated_by_distro}
            disabledTooltipTitle={
              app.updated_by_distro
                ? t(
                    "appStore.appCard.downloadApp.this-app-gets-updated-with-your-octobot-distribution",
                  )
                : t(
                    "appStore.appCard.downloadApp.you-need-to-be-signed-in-to-download-updates",
                  )
            }
            confirmDescription={
              <AppDownloadForm
                downloadInfo={downloadInfo}
                setDownloadInfo={setDownloadInfo}
                handleDownload={handleDownload}
                app={app}
              />
            }
            open={downloadInfo.open}
            setInfo={setDownloadInfo}
            // confirmButtonText={buttonText}
            buttonTitle={buttonText}
          />
        )
      );
    }
  } else if (app.price) {
    if (app.is_owner) {
      const confirmButtonText = t("appStore.appCard.downloadApp.download");

      return (
        handleDownload && (
          <UpDownloadloadAppModal // onConfirm={handleDownload}
            antIconComponent={CloudDownloadOutlined}
            confirmTitle={confirmButtonText}
            disabled={!isSignedIn}
            disabledTooltipTitle={t(
              "appStore.appCard.downloadApp.you-need-to-be-signed-in-to-download-apps",
            )}
            confirmDescription={
              <AppDownloadForm
                downloadInfo={downloadInfo}
                setDownloadInfo={setDownloadInfo}
                handleDownload={handleDownload}
                app={app}
              />
            }
            // confirmButtonIcon={CloudDownloadOutlined}
            open={downloadInfo.open}
            isSelected={app.is_selected}
            setInfo={setDownloadInfo}
            // confirmButtonText={confirmButtonText}
            buttonTitle={confirmButtonText}
          />
        )
      );
    } else {
      return (
        handleDownload && (
          <UpDownloadloadAppModal
            // onConfirm={
            //     () => addAppStoreCart(app)
            // }
            antIconComponent={CloudDownloadOutlined}
            // confirmButtonIcon={ShoppingCartOutlined}
            confirmTitle={t(
              "appStore.appCard.downloadApp.buy-app-title-today",
              { appTitle: app.title },
            )}
            confirmDescription={
              <AppDownloadForm
                downloadInfo={downloadInfo}
                handleDownload={handleDownload}
                setDownloadInfo={setDownloadInfo}
                app={app}
              />
            }
            open={downloadInfo.open}
            setInfo={setDownloadInfo}
            // confirmButtonText={"Add To Shopping Basket"}
            buttonTitle={t(
              "appStore.appCard.downloadApp.download-appCategory",
              { appCategory: app.categories[0] },
            )}
            // buttonTitle={
            //     `Buy for ${
            //         app.price
            //     }$ a month`
            // }
          />
        )
      );
    }
  } else {
    const confirmButtonText = t(
      "appStore.appCard.downloadApp.download-for-free",
    );
    return (
      handleDownload && (
        <UpDownloadloadAppModal // onConfirm={handleDownload}
          antIconComponent={CloudDownloadOutlined}
          confirmButtonIcon={CloudDownloadOutlined}
          confirmTitle={confirmButtonText}
          disabled={!isSignedIn}
          open={downloadInfo.open}
          setInfo={setDownloadInfo}
          disabledTooltipTitle={t(
            "appStore.appCard.downloadApp.you-need-to-be-signed-in-to-download-free-apps",
          )}
          confirmDescription={
            <AppDownloadForm
              downloadInfo={downloadInfo}
              handleDownload={handleDownload}
              setDownloadInfo={setDownloadInfo}
              app={app}
            />
          }
          // confirmButtonText={confirmButtonText}
          buttonTitle={t("appStore.appCard.downloadApp.free-download")}
        />
      )
    );
  }
}

function UpDownloadloadAppModal({
  onConfirm,
  antIconComponent,
  confirmTitle,
  disabled,
  setInfo,
  isSelected,
  open,
  disabledTooltipTitle,
  confirmDescription,
  confirmButtonText,
  buttonTitle,
  confirmButtonIcon,
  smallModal,
  formIsValidated,
}: {
  onConfirm?: () => void;
  antIconComponent: ForwardRefExoticComponent<
    Omit<AntdIconProps, "ref"> & RefAttributes<HTMLSpanElement>
  >;
  confirmTitle: string;
  disabled?: boolean | undefined;
  setInfo: Dispatch<SetStateAction<UploadInfo | DownloadInfo>>;
  isSelected?: boolean | undefined;
  open: boolean | undefined;
  disabledTooltipTitle?: string;
  confirmDescription: JSX.Element;
  confirmButtonText?: string;
  buttonTitle: string;
  confirmButtonIcon?: ForwardRefExoticComponent<
    Omit<AntdIconProps, "ref"> & RefAttributes<HTMLSpanElement>
  >;
  smallModal?: boolean;
  formIsValidated?: boolean;
}) {
  return (
    <>
      <Tooltip title={disabled && disabledTooltipTitle}>
        <div>
          <AppIconButton
            isSelected={isSelected}
            disabled={disabled}
            buttonTitle={buttonTitle}
            antIconComponent={antIconComponent}
            onClick={() => handlePopConfirmOpen(setInfo, true)}
          />
        </div>
      </Tooltip>
      <Modal
        open={open || false}
        onCancel={() => handlePopConfirmOpen(setInfo, false)}
        title={<Typography.Title level={1}> {confirmTitle} </Typography.Title>}
        centered
        width={smallModal ? "450px" : "1200px"}
        footer={[
          <div
            key={"up-download-modal-footer"}
            style={{
              display: "flex",
              marginLeft: "auto",
            }}
          >
            <AntButton
              key="back"
              antIconComponent={LeftOutlined}
              buttonType={buttonTypes.warning}
              style={{ marginLeft: "auto" }}
              size="large"
              onClick={() => handlePopConfirmOpen(setInfo, false)}
            >
              <Trans i18nKey="appStore.appCard.downloadApp.go-back" />
            </AntButton>
            {confirmButtonText && (
              <AntButton
                key="confirm"
                antIconComponent={confirmButtonIcon}
                size="large"
                disabled={formIsValidated === false}
                onClick={onConfirm}
              >
                {confirmButtonText}
              </AntButton>
            )}
          </div>,
        ]}
      >
        {confirmDescription}
      </Modal>
    </>
  );
}
