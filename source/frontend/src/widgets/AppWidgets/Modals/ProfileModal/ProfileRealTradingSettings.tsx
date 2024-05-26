import { Grid } from "@mui/material";
import { Switch, Typography } from "antd";
import { t } from "i18next";
import { Dispatch, SetStateAction } from "react";
import { Trans } from "react-i18next";

import { ProfileType } from "../../../../context/data/BotInfoProvider";
import { onProfileSettingChange } from "./ProfileTradingSettings";

export function ProfileRealSettings({
  newProfileSettings,
  setNewProfileSettings,
  isCurrentProfile,
}: {
  newProfileSettings: ProfileType;
  setNewProfileSettings: Dispatch<SetStateAction<ProfileType>>;
  isCurrentProfile: boolean;
}) {
  return (
    <>
      <Grid item xs={12}>
        <Typography.Title level={3}>
          <Trans i18nKey="strategyConfigurator.profileSettings.real-trading-settings" />
        </Typography.Title>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Switch
          disabled={!isCurrentProfile}
          onChange={(value) =>
            onProfileSettingChange(
              setNewProfileSettings,
              value,
              "trader",
              "load-trade-history"
            )
          }
          checked={newProfileSettings?.config?.trader?.["load-trade-history"]}
          checkedChildren={t(
            "strategyConfigurator.profileSettings.load-trades-history-from-exchange"
          )}
          unCheckedChildren={t(
            "strategyConfigurator.profileSettings.dont-load-trades-history-from-exchange"
          )}
        />
      </Grid>
    </>
  );
}
