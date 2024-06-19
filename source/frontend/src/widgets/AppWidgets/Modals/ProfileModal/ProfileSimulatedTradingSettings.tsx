import {
  faInfoCircle,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid } from "@mui/material";
import {
  Alert,
  Button,
  Card,
  Input,
  InputNumber,
  List,
  Typography,
} from "antd";
import { t } from "i18next";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { Trans } from "react-i18next";

import type { ProfileType } from "../../../../context/data/BotInfoProvider";
import { onProfileSettingChange } from "./ProfileTradingSettings";

export function ProfileSimulatedSettings({
  newProfileSettings,
  setNewProfileSettings,
  isCurrentProfile,
}: {
  newProfileSettings: ProfileType;
  setNewProfileSettings: Dispatch<SetStateAction<ProfileType>>;
  isCurrentProfile: boolean | undefined;
}) {
  return (
    <Grid container spacing={2} style={{ marginTop: "15px" }}>
      <Grid item xs={12} sm={6}>
        <Typography.Title level={5}>
          <Trans i18nKey="strategyConfigurator.profileSettings.maker-fees-limit-orders" />
        </Typography.Title>
        <InputNumber
          style={{ width: "100%" }}
          value={
            newProfileSettings?.config?.["trader-simulator"]?.fees?.maker ||
            null
          }
          disabled={!isCurrentProfile}
          addonAfter="%"
          defaultValue={0.1}
          min={-1}
          max={5}
          step={0.001}
          onChange={(newValue) =>
            onProfileSettingChange(
              setNewProfileSettings,
              Number(newValue),
              "trader-simulator",
              "fees",
              "maker",
            )
          }
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography.Title level={5}>
          <Trans i18nKey="strategyConfigurator.profileSettings.taker-fees-market-orders" />
        </Typography.Title>
        <InputNumber
          style={{ width: "100%" }}
          value={
            newProfileSettings?.config?.["trader-simulator"]?.fees?.taker ||
            null
          }
          disabled={!isCurrentProfile}
          addonAfter="%"
          defaultValue={0.1}
          min={-1}
          max={5}
          step={0.001}
          onChange={(newValue) =>
            onProfileSettingChange(
              setNewProfileSettings,
              Number(newValue),
              "trader-simulator",
              "fees",
              "taker",
            )
          }
        />
      </Grid>
      <ProfilePortfolioSettings
        newProfileSettings={newProfileSettings}
        isCurrentProfile={isCurrentProfile}
        setNewProfileSettings={setNewProfileSettings}
      />
    </Grid>
  );
}
const addKey = "add";
export function ProfilePortfolioSettings({
  newProfileSettings,
  setNewProfileSettings,
  isCurrentProfile,
}: {
  newProfileSettings: ProfileType;
  setNewProfileSettings: Dispatch<SetStateAction<ProfileType>>;
  isCurrentProfile: boolean | undefined;
}) {
  const data: {
    key: string;
    coin: string;
    value: number | undefined;
  }[] = [
    ...Object.keys(
      newProfileSettings.config["trader-simulator"]["starting-portfolio"],
    ).map((coin) => {
      return {
        key: coin,
        coin,
        value:
          newProfileSettings.config["trader-simulator"]["starting-portfolio"][
            coin
          ],
      };
    }),
    {
      key: addKey,
      coin: "",
      value: undefined,
    },
  ];
  return (
    <Grid item xs={12}>
      <Typography.Title level={5}>
        <Trans i18nKey="strategyConfigurator.profileSettings.simulated-starting-portfolio" />
      </Typography.Title>
      {isCurrentProfile && (
        <Alert
          message={
            <>
              <FontAwesomeIcon
                style={{ marginRight: "5px" }}
                icon={faInfoCircle}
              />
              <Trans i18nKey="strategyConfigurator.profileSettings.changes-to-the-simulated-starting-portfolio-will-reset-enabled-exchanges-simulated-portfolio-history" />
            </>
          }
          type="info"
          style={{ marginBottom: "10px" }}
        />
      )}
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          column: 3,
        }}
        dataSource={data}
        renderItem={(item) => {
          return item.key === addKey ? (
            isCurrentProfile && (
              <ProfileAddCoinSettings
                setNewProfileSettings={setNewProfileSettings}
              />
            )
          ) : (
            <ProfilePortfolioCoinSettings
              item={item}
              newProfileSettings={newProfileSettings}
              setNewProfileSettings={setNewProfileSettings}
              isCurrentProfile={isCurrentProfile}
            />
          );
        }}
      />
    </Grid>
  );
}
export function ProfileAddCoinSettings({
  setNewProfileSettings,
}: {
  setNewProfileSettings: Dispatch<SetStateAction<ProfileType>>;
}) {
  const [coinToSet, setCoinToSet] = useState<{
    coin?: string;
    value?: number;
  }>({});
  function handleCoinToAdd(key: "coin" | "value", newValue: string | number) {
    setCoinToSet((prevValues) => ({
      ...prevValues,
      [key]: newValue,
    }));
  }
  function handleCoinAdd() {
    setNewProfileSettings((prevSettings) => {
      const newSettings = {
        ...prevSettings,
      };
      newSettings.config["trader-simulator"]["starting-portfolio"][
        `${coinToSet.coin}`
      ] = coinToSet.value || 0;
      return newSettings;
    });
    setCoinToSet({});
  }
  return (
    <List.Item>
      <Card>
        <Typography.Title level={5} style={{ width: "100%" }}>
          <Trans i18nKey="strategyConfigurator.profileSettings.add-a-new-asset" />
        </Typography.Title>
        <Input
          value={coinToSet.coin}
          onChange={(event) =>
            handleCoinToAdd("coin", event.target.value.toUpperCase())
          }
          placeholder={t("strategyConfigurator.profileSettings.asset-name")}
          style={{ width: "100%" }}
        />
        <InputNumber
          style={{
            width: "100%",
            marginTop: "10px",
          }}
          value={coinToSet.value || null}
          addonAfter={coinToSet.coin ? coinToSet.coin : <></>}
          min={0}
          step={0.0000001}
          placeholder={t("strategyConfigurator.profileSettings.asset-amount")}
          onChange={(newValue) => handleCoinToAdd("value", newValue || 0)}
        />
        <Button
          type="primary"
          style={{ marginTop: "10px" }}
          disabled={!coinToSet.coin && !coinToSet.value && true}
          icon={
            <FontAwesomeIcon style={{ marginRight: "5px" }} icon={faPlus} />
          }
          onClick={handleCoinAdd}
        >
          <Trans i18nKey="strategyConfigurator.profileSettings.add-coin" />
        </Button>
      </Card>
    </List.Item>
  );
}

export function ProfilePortfolioCoinSettings({
  item,
  newProfileSettings,
  setNewProfileSettings,
  isCurrentProfile,
}: {
  item: {
    key: string;
    coin: string;
    value: number | undefined;
  };
  newProfileSettings: ProfileType;
  setNewProfileSettings: Dispatch<SetStateAction<ProfileType>>;
  isCurrentProfile: boolean | undefined;
}) {
  function handleRemoveCoin() {
    setNewProfileSettings((prevSettings) => {
      const newSettings = {
        ...prevSettings,
      };
      delete newSettings.config["trader-simulator"]["starting-portfolio"][
        item.coin
      ];
      return newSettings;
    });
  }
  function handleCoinNameChange(value: string) {
    setNewProfileSettings((prevSettings) => {
      const newSettings = {
        ...prevSettings,
      };
      newSettings.config["trader-simulator"]["starting-portfolio"][
        value.toUpperCase()
      ] =
        newSettings.config["trader-simulator"]["starting-portfolio"][
          item.coin
        ] || 0;
      delete newSettings.config["trader-simulator"]["starting-portfolio"][
        item.coin
      ];
      return newSettings;
    });
  }
  return (
    <List.Item key={item.coin}>
      <Card>
        <Typography.Title
          level={5}
          style={{ width: "100%" }}
          editable={
            isCurrentProfile
              ? {
                  tooltip: (
                    <Trans i18nKey="strategyConfigurator.profileSettings.click-to-edit-the-asset" />
                  ),
                  onChange: handleCoinNameChange,
                  text: item.coin,
                }
              : false
          }
        >
          {item.coin}
        </Typography.Title>

        <InputNumber
          style={{ width: "100%" }}
          value={
            newProfileSettings.config["trader-simulator"]["starting-portfolio"][
              item.coin
            ] || null
          }
          disabled={!isCurrentProfile}
          addonAfter={item.coin}
          min={0}
          step={0.00000001}
          onChange={(newValue) =>
            onProfileSettingChange(
              setNewProfileSettings,
              Number(newValue),
              "trader-simulator",
              "starting-portfolio",
              item.coin,
            )
          }
        />
        {isCurrentProfile && (
          <Button
            key={`delete${item.coin}`}
            type="primary"
            danger
            style={{ marginTop: "10px" }}
            icon={
              <FontAwesomeIcon style={{ marginRight: "5px" }} icon={faXmark} />
            }
            onClick={handleRemoveCoin}
          >
            {t("strategyConfigurator.profileSettings.remove-coinName", {
              coinName: item.coin,
            })}
          </Button>
        )}
      </Card>
    </List.Item>
  );
}
