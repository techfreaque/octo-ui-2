import { Grid } from "@mui/material";
import { Switch, Typography } from "antd";
import { Dispatch, SetStateAction } from "react";

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
        <Typography.Title level={3}>Real Trading Settings</Typography.Title>
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
          checkedChildren="load trades history from exchange"
          unCheckedChildren="don't load trades history from exchange"
        />
      </Grid>
    </>
  );
}
