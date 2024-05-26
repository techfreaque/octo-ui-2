import { Card } from "antd";
import type { CSSProperties, Dispatch, SetStateAction } from "react";

import { useBotColorsContext } from "../../../../context/config/BotColorsProvider";
import type {
  AppStoreAppType,
  StoreCategoryType,
} from "../../../../context/data/AppStoreDataProvider";
import { AppAvatar, AppCover, AppTitle } from "./AppCover";
import { CardDescription } from "./AppDescription";
import AppRating from "./AppRating";

export default function AppCardTemplate({
  app,
  setMouseHover,
  cardActions,
  isMouseHover,
  avatarUrl,
  category,
}: {
  app: AppStoreAppType;
  setMouseHover: Dispatch<SetStateAction<boolean>>;
  cardActions: JSX.Element;
  isMouseHover: boolean;
  avatarUrl: string;
  category: StoreCategoryType;
}) {
  const botColors = useBotColorsContext();
  const boxShadowColor =
    app?.is_selected || isMouseHover
      ? botColors?.borderActive
      : "rgb(0 0 0 / 24%)";
  const cardStyle: CSSProperties = {
    boxShadow: `0px 0px 3px ${boxShadowColor}`,
    borderRadius: "4px",
    transition: "all 200ms linear 0ms",
  };
  // if (!app?.is_selected) {
  //     cardStyle.height = "450px"
  // }
  if (isMouseHover) {
    cardStyle.transform = "translateY(-1px)";
  }

  return (
    <Card // hoverable
      style={cardStyle}
      cover={
        <AppCover
          // avatarImage={'https://tradeciety.com/hubfs/Imported_Blog_Media/GBPUSDH45.png'}
          app={app}
        />
      }
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
    >
      <div>
        <Card.Meta
          avatar={<AppAvatar avatarImage={avatarUrl} />}
          title={<AppTitle title={app.title} />}
        />

        <div
          style={{
            marginLeft: "50px",
            marginTop: "0px",
            marginBottom: "10px",
            marginRight: "50px",
          }}
        >
          {!app?.is_selected && (
            <>
              <div> {category} </div>
              <AppRating rating={app.rating} app={app} votes={app.votes} />
            </>
          )}
          <CardDescription
            cardActions={cardActions}
            isMouseHover={isMouseHover}
            app={app}
          />
        </div>
      </div>
    </Card>
  );
}
