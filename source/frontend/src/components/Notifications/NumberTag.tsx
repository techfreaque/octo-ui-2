import { Badge, Space, Tag } from "antd";

import { useBotColorsContext } from "../../context/config/BotColorsProvider";

export default function NumberTag({
  count,
  color,
  text,
}: {
  count: number;
  color: string;
  text: string;
}) {
  const _count = formatNumber(count);
  const botColors = useBotColorsContext();
  return (
    <Space>
      <Tag
        color={color}
        style={{
          fontSize: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 5px 0 2px",
        }}
      >
        {
          <Badge
            overflowCount={999}
            count={_count}
            showZero
            style={{
              width: getBadgeSize(_count),
              height: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              margin: "5px",
              backgroundColor: botColors.primary,
            }}
          />
        }
        {text}
      </Tag>
    </Space>
  );
}

function getBadgeSize(formattedNumber: string): string {
  if (formattedNumber.length < 2) {
    return "15px";
  }
  if (formattedNumber.length === 2) {
    return "25px";
  }
  if (formattedNumber.length === 3) {
    return "30px";
  }
  if (formattedNumber.length === 4) {
    return "35px";
  }
  if (formattedNumber.length === 5) {
    return "45px";
  }
  return "48px";
}

function formatNumber(number: number): string {
  if (number < 1e3) {
    return number.toString();
  }
  if (number >= 1e3 && number < 1e6) {
    return `${(number / 1e3).toFixed(2)}K`;
  }
  if (number >= 1e6 && number < 1e9) {
    return `${(number / 1e6).toFixed(2)}M`;
  }
  if (number >= 1e9 && number < 1e12) {
    return `${(number / 1e9).toFixed(2)}B`;
  }
  if (number >= 1e12) {
    return `${(number / 1e12).toFixed(2)}T`;
  }
  return number.toString();
}
