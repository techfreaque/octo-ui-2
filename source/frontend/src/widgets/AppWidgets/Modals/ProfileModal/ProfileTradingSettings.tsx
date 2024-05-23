import { Grid } from "@mui/material";
import { AutoComplete, Radio, Typography } from "antd";
import { Dispatch, SetStateAction, useState } from "react";

import {
  ProfileRootPathType,
  ProfileType,
} from "../../../../context/data/BotInfoProvider";

type TradingTypeValueType =
  | "realTrading"
  | "simulatedTrading"
  | "tradingDisabled";

const tradingTypes: {
  realTrading: {
    label: string;
    value: TradingTypeValueType;
  };
  simulatedTrading: {
    label: string;
    value: TradingTypeValueType;
  };
  tradingDisabled: {
    label: string;
    value: TradingTypeValueType;
  };
} = {
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

export function onProfileSettingChange(
  setNewProfileSettings: Dispatch<SetStateAction<ProfileType>>,
  value: number | string | boolean,
  rootPath: ProfileRootPathType,
  subPath: string,
  subSubPath?: string
) {
  setNewProfileSettings((prevSettings) => {
    const newSettings = {
      ...prevSettings,
    };

    if (newSettings.config[rootPath]) {
      if (subSubPath) {
        if ((newSettings.config[rootPath] as any)[subPath]) {
          (newSettings.config[rootPath] as any)[subPath][subSubPath] = value;
        } else {
          (newSettings.config[rootPath] as any)[subPath] = {
            [subSubPath]: value,
          };
        }
      } else {
        (newSettings.config[rootPath] as any)[subPath] = value;
      }
    } else if (subSubPath) {
      newSettings.config[rootPath] = {
        [subPath]: {
          [subSubPath]: value,
        },
      } as any;
    } else {
      newSettings.config[rootPath] = {
        [subPath]: value,
      } as any;
    }

    return newSettings;
  });
}

export function ProfileTradingTypeSettings({
  setNewProfileSettings,
  newProfileSettings,
  isCurrentProfile,
}: {
  setNewProfileSettings: Dispatch<SetStateAction<ProfileType>>;
  newProfileSettings: ProfileType;
  isCurrentProfile: boolean | undefined;
}) {
  const isRealTrading = newProfileSettings?.config?.trader?.enabled;
  const isSimulatedTrading =
    newProfileSettings?.config?.["trader-simulator"].enabled;
  const currentTradingType = isRealTrading
    ? tradingTypes.realTrading.value
    : isSimulatedTrading
    ? tradingTypes.simulatedTrading.value
    : tradingTypes.tradingDisabled.value;

  function handleTradingTypeChange(value: TradingTypeValueType) {
    setNewProfileSettings((prevSettings) => {
      const newSettings = {
        ...prevSettings,
      };
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
      return newSettings;
    });
  }

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
        onChange={(event) => handleTradingTypeChange(event.target.value)}
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
}: {
  newProfileSettings: ProfileType;
  setNewProfileSettings: Dispatch<SetStateAction<ProfileType>>;
  isCurrentProfile: boolean;
}) {
  const refMarket = newProfileSettings?.config?.trading?.["reference-market"];
  // TODO replace with all available
  const quoteAssets = Array.from(
    new Set([refMarket, "USDT", "BTC", "ETH", "USD", "BUSD", "USDC"])
  );

  const defaultOptions = convertStringArrayToOptions(quoteAssets);
  const [options, setOptions] = useState(defaultOptions);
  function setAutoCompleteOptions(searchText: string) {
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

function convertStringArrayToOptions(
  stringArray: string[]
): {
  label: string;
  value: string;
}[] {
  return stringArray
    ? stringArray.map((quoteAsset) => ({
        label: quoteAsset,
        value: quoteAsset,
      }))
    : [];
}
