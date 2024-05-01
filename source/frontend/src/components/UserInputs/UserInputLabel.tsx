import { Typography } from "antd";

export default function UserInputLabel({
  children,
  title,
}: {
  children: JSX.Element;
  title: string;
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <Typography.Paragraph
        style={{
          marginBottom: "5px",
          marginTop: "0px",
        }}
      >
        {title}
      </Typography.Paragraph>
      {children}
    </div>
  );
}
