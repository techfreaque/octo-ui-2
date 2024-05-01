import { Grid } from "@mui/material";
import { AutoComplete, Radio, Typography } from "antd";
import { useState } from "react";

const tradingTypes = {
  realTrading: {
    label: "Real Trading",
    value: "realTrading",
  },
  simulatedTrading: {
    label: "Simulated Trading",
    value: "simulatedTrading",
  },
  tradingDisabled: {
    label: "Trading Disabled",
    value: "tradingDisabled",
  },
};
const tradingTypeStr = "tradingType";

export function onProfileSettingChange(
  setNewProfileSettings,
  value,
  rootPath: string,
  subPath?: string,
  subSubPath?: string,
  subSubSubPath?: string
) {
  setNewProfileSettings((prevSettings) => {
    const newSettings = {
      ...prevSettings,
    };

    if (tradingTypeStr === rootPath) {
      if (tradingTypes.realTrading.value === value) {
        newSettings.config.trader.enabled = true;
        newSettings.config["trader-simulator"].enabled = false;
      } else if (tradingTypes.simulatedTrading.value === value) {
        newSettings.config.trader.enabled = false;
        newSettings.config["trader-simulator"].enabled = true;
      } else {
        newSettings.config.trader.enabled = false;
        newSettings.config["trader-simulator"].enabled = false;
      }
    } else {
      if (!subPath) {
        throw new Error("subPath isrequired to save profile settings");
      }
      if (newSettings.config[rootPath]) {
        if (subSubSubPath && subSubPath) {
          newSettings.config[rootPath][subPath][subSubPath][
            subSubSubPath
          ] = value;
        } else if (subSubPath) {
          newSettings.config[rootPath][subPath][subSubPath] = value;
        } else {
          newSettings.config[rootPath][subPath] = value;
        }
      } else if (subSubSubPath && subSubPath) {
        newSettings.config[rootPath] = {
          [subPath]: {
            [subSubPath]: {
              [subSubSubPath]: value,
            },
          },
        };
      } else if (subSubPath) {
        newSettings.config[rootPath] = {
          [subPath]: {
            [subSubPath]: value,
          },
        };
      } else {
        newSettings.config[rootPath] = {
          [subPath]: value,
        };
      }
    }
    return newSettings;
  });
}

export function ProfileTradingTypeSettings({
  setNewProfileSettings,
  newProfileSettings,
  isCurrentProfile,
}) {
  const isRealTrading = newProfileSettings?.config?.trader?.enabled;
  const isSimulatedTrading =
    newProfileSettings?.config?.["trader-simulator"].enabled;
  const currentTradingType = isRealTrading
    ? tradingTypes.realTrading.value
    : isSimulatedTrading
    ? tradingTypes.simulatedTrading.value
    : tradingTypes.tradingDisabled.value;

  return (
    <Grid item xs={12}>
      <Typography.Title level={5}>Trading Type:</Typography.Title>
      <Radio.Group
        disabled={!isCurrentProfile}
        options={[
          tradingTypes.realTrading,
          tradingTypes.simulatedTrading,
          tradingTypes.tradingDisabled,
        ]}
        onChange={(event) =>
          onProfileSettingChange(
            setNewProfileSettings,
            event.target.value,
            tradingTypeStr
          )
        }
        value={currentTradingType}
        optionType="button"
      />
    </Grid>
  );
}

export function ProfileReferenceMarketSettings({
  newProfileSettings,
  setNewProfileSettings,
  isCurrentProfile,
}) {
  const refMarket = newProfileSettings?.config?.trading?.["reference-market"];
  // TODO replace with all available
  const quoteAssets = Array.from(
    new Set([refMarket, "USDT", "BTC", "ETH", "USD", "BUSD", "USDC"])
  );

  const defaultOptions = convertStringArrayToOptions(quoteAssets);
  const [options, setOptions] = useState(defaultOptions);
  function setAutoCompleteOptions(searchText) {
    const searchTextU = searchText?.toUpperCase();
    const newOptions = searchTextU
      ? convertStringArrayToOptions(
          Array.from(
            new Set([
              ...quoteAssets.filter((quoteAsset) =>
                quoteAsset.includes(searchTextU)
              ),
              searchTextU,
            ])
          )
        )
      : defaultOptions;
    setOptions(newOptions);
  }
  return (
    <Grid xs={12} sm={6} item>
      <Typography.Title level={5}>Reference Market:</Typography.Title>
      <AutoComplete
        options={options}
        disabled={!isCurrentProfile}
        style={{ width: "100%" }}
        value={refMarket}
        onChange={(_refMarket) =>
          onProfileSettingChange(
            setNewProfileSettings,
            _refMarket.toUpperCase(),
            "trading",
            "reference-market"
          )
        }
        onSearch={setAutoCompleteOptions}
        placeholder="enter a reference market like USDT or BTC"
      />
    </Grid>
  );
}

function convertStringArrayToOptions(stringArray) {
  return stringArray
    ? stringArray.map((quoteAsset) => ({
        label: quoteAsset,
        value: quoteAsset,
      }))
    : [];
}
