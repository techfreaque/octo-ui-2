import { Radio, Space, Tooltip } from "antd";
import AntButton from "./AntButton";

export interface RadioButtonMenuItem {
  label: JSX.Element | string;
  key: string;
  toolTipText?: JSX.Element;
}

export default function RadioButtonGroup({
  rightContent,
  menuItems,
  onChange,
  selected,
}: {
  rightContent?: JSX.Element;
  menuItems: RadioButtonMenuItem[];
  onChange?: ((newValue: string) => void) | undefined;
  selected?: string;
}) {
  return (
    <Radio.Group
      defaultValue={selected}
      style={{
        margin: "auto",
        marginRight: "5px",
      }}
    >
      <Space>
        {menuItems?.map((item) => {
          return (
            <Tooltip key={item.key} title={item?.toolTipText}>
              <div>
                <AntButton
                  selected={selected === item.key}
                  onClick={() => onChange?.(item.key)}
                  buttonVariant="text"
                >
                  {item.label}
                </AntButton>
              </div>
            </Tooltip>
          );
        })}
        {rightContent}
      </Space>
    </Radio.Group>
  );
}
