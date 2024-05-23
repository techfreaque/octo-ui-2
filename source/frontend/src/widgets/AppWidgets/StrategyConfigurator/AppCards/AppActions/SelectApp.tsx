import { SelectOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState } from "react";
import { Trans } from "react-i18next";

import AppIconButton from "../../../../../components/Buttons/AppIconButton";
import { AppStoreAppType } from "../../../../../context/data/AppStoreDataProvider";
import { ConfirmAction } from "./AppActions";

export default function SelectApp({
  app,
  handleSelect,
  isReadOnlyStrategy,
}: {
  app: AppStoreAppType;
  handleSelect?: ((setClosed: () => void) => void) | undefined;
  isReadOnlyStrategy: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  if (!app.is_selected && app.is_installed && handleSelect) {
    const handleOk = () => {
      setConfirmLoading(true);
      handleSelect(() => {
        setOpen(false);
        setConfirmLoading(false);
      });
    };
    const okButtonProps = {
      loading: confirmLoading,
      style: {
        backgroundColor: "orange",
      },
      icon: (
        <span>
          <SelectOutlined
            size={1}
            style={{
              marginBottom: "5px",
              marginRight: "5px",
            }}
          />
        </span>
      ),
    };
    const buttonTitle = `Select ${
      app.categories[0] === "Strategy Mode" ? "Strat Mode" : app.categories[0]
    }`;
    return isReadOnlyStrategy ? (
      <Tooltip title={<Trans i18nKey="apps.cantSelectStrategyModeTooltip" />}>
        <div>
          <AppIconButton
            isSelected={false}
            buttonTitle={buttonTitle}
            antIconComponent={SelectOutlined}
            disabled
          />
        </div>
      </Tooltip>
    ) : (
      <ConfirmAction
        antIconComponent={SelectOutlined}
        onConfirm={handleOk}
        open={open}
        confirmTitle={`Select ${app.title}?`}
        okButtonProps={okButtonProps}
        confirmButtonText={
          app?.categories?.[0]
            ? `Select ${app.categories[0]} & Restart Now`
            : "Select & Restart Now"
        }
        buttonTitle={buttonTitle}
      />
    );
  }
  return <></>;
}
