import { ConfigProvider, Switch, ThemeConfig, Tooltip } from "antd";
import { SwitchChangeEventHandler } from "antd/es/switch";

export default function EnablerSwitch({
  availableAfterRestart,
  title,
  isEnabled,
  disabledAfterRestart,
  onChange,
}: {
  availableAfterRestart: boolean;
  title: string;
  isEnabled: boolean;
  disabledAfterRestart: boolean;
  onChange: SwitchChangeEventHandler;
}) {
  const switchTheme: ThemeConfig =
    availableAfterRestart || disabledAfterRestart
      ? {
          token: {
            colorPrimary: "#ff1733",
            colorBgBase: "#ff1733",
            colorTextBase: "#ff1733",
          },
        }
      : {};
  return (
    <Tooltip
      title={
        availableAfterRestart
          ? `${title} will be enabled after save and restart`
          : disabledAfterRestart &&
            `${title} will be disabled after save and restart`
      }
    >
      <div>
        <ConfigProvider theme={switchTheme}>
          <Switch
            checked={
              availableAfterRestart || (!disabledAfterRestart && isEnabled)
            }
            onChange={onChange}
          />
        </ConfigProvider>
      </div>
    </Tooltip>
  );
}
