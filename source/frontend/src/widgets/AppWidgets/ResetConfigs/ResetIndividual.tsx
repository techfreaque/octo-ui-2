import { ConfigProvider, Switch, Tooltip } from "antd";

import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import type { CheckedListType, SorageResetKeyType } from "./ResetConfigs";

export default function ResetIndividual({
  title,
  description,
  handleCheckboxClick,
  checkedList,
  titleKey,
}: {
  title: string;
  description: JSX.Element | string;
  handleCheckboxClick: (key: SorageResetKeyType) => void;
  checkedList: CheckedListType | undefined;
  titleKey: SorageResetKeyType;
}) {
  const botColors = useBotColorsContext();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        margin: "10px auto",
      }}
    >
      <Tooltip title={description} placement="right">
        <span>{title}</span>
      </Tooltip>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: botColors?.error,
          },
        }}
      >
        <Switch
          checked={checkedList?.[titleKey] || false}
          onChange={() => handleCheckboxClick(titleKey)}
          checkedChildren="Reset"
        />
      </ConfigProvider>
    </div>
  );
}
