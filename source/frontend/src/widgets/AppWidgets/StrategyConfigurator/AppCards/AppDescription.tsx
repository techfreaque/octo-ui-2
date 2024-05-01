import { Typography } from "antd";

export function CardDescription({
  category,
  app,
  isMouseHover,
  cardActions,
}: {
  category;
  app;
  isMouseHover: boolean;
  cardActions;
}) {
  if (app?.is_selected) {
    return (
      <>
        <CleanDescription description={app.description} /> {cardActions}
      </>
    );
  }
  const lineHeight = 20;
  const lines = 4;
  const totalLineHeight = lineHeight * lines;
  const marginBottom = 35;
  const marginTop = 10;
  const lineHeightWithMargin = totalLineHeight + marginBottom + marginTop;

  return (
    <div
      style={{
        height: `${lineHeightWithMargin + 5}px`,
        overflow: "hidden",
      }}
    >
      {isMouseHover ? (
        <OnHoverDescription
          cardActions={cardActions}
          lineHeightWithMargin={lineHeightWithMargin}
        />
      ) : (
        <NonHoverDescription
          marginBottom={marginBottom}
          cardActions={cardActions}
          marginTop={marginTop}
          lineHeight={lineHeight}
          totalLineHeight={totalLineHeight}
          app={app}
        />
      )}
    </div>
  );
}

function NonHoverDescription({
  cardActions,
  marginBottom,
  marginTop,
  lineHeight,
  totalLineHeight,
  app,
}: {
  cardActions;
  marginBottom: number;
  marginTop: number;
  lineHeight: number;
  totalLineHeight: number;
  app;
}) {
  return (
    <>
      <div
        style={{
          marginBottom: `${marginBottom}px`,
          marginTop: `${marginTop}px`,
          height: `${totalLineHeight}px`,
          maxHeight: `${totalLineHeight}px`,
        }}
      >
        <span
          style={{
            display: "block" /* or inline-block */,
            textOverflow: "ellipsis",
            wordWrap: "break-word",
            // overflow: "hidden",
            width: "100%",

            lineHeight: `${lineHeight}px`,
            height: `${totalLineHeight}px`,
            maxHeight: `${totalLineHeight}px`,
            overflow: "hidden",
          }}
        >
          <CleanDescription description={app.description} />
        </span>
      </div>
      {cardActions}
    </>
  );
}

export function CleanDescription({
  description,
  endComponent,
}: {
  description?: string;
  endComponent?: JSX.Element;
}) {
  const lines = description?.replace(/<br>/g, "\n")?.split("\n");
  return (
    <>
      {lines?.map((paragraph, index) => (
        <Typography.Paragraph key={index}>
          {paragraph}
          {lines.length === index + 1 && endComponent}
        </Typography.Paragraph>
      ))}
    </>
  );
}

function OnHoverDescription({
  cardActions,
  lineHeightWithMargin,
}: {
  cardActions;
  lineHeightWithMargin: number;
}) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
      }}
    >
      {/* <span style={
                { // ... unSelectedStyle,
                    height: lineHeightWithMargin + 5 + "px",
                    // marginBottom: "0px",
                    // height: lineHeightWithMargin+"px",
                    // maxHeight: lineHeightWithMargin+ "px"
                }
            }> */}
      {/* <span style={
                {
                    marginBottom: "-" + marginBottom + "px",
                    marginTop: "-" + marginTop + "px",
                    height: "100%",
                }
            }> */}
      {cardActions}
      {/* </span> */}
    </div>
  );
}
