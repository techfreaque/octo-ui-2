import { InfoCircleOutlined } from "@ant-design/icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import { t } from "i18next";
import { useState } from "react";
import { Trans } from "react-i18next";

import AntButton from "../../../../../components/Buttons/AntButton";
import AppIconButton from "../../../../../components/Buttons/AppIconButton";
import { AppStoreAppType } from "../../../../../context/data/AppStoreDataProvider";

export default function AppInfoModal({
  app,
  infoContent,
}: {
  app: AppStoreAppType;
  infoContent: string | JSX.Element;
}) {
  const [open, setOpen] = useState<boolean>(false);
  function handleClose() {
    setOpen(false);
  }
  return (
    <>
      <AppIconButton
        isSelected={app.is_selected}
        buttonTitle={t("appStore.appCard.appInfo.appCategory-info", {
          appCategory: app.categories[0],
        })}
        antIconComponent={InfoCircleOutlined}
        onClick={() => setOpen(true)}
      />
      <Modal
        open={open}
        onCancel={handleClose}
        title={`${app.title} | ${app.categories[0]}`}
        centered
        width="700px"
        footer={[
          <AntButton
            key="back"
            icon={
              <FontAwesomeIcon
                style={{
                  margin: "auto",
                  marginRight: "5px",
                }}
                icon={faXmark}
              />
            }
            size="large"
            onClick={handleClose}
          >
            <Trans i18nKey="appStore.appCard.appInfo.close" />
          </AntButton>,
        ]}
      >
        {infoContent}
      </Modal>
    </>
  );
}
