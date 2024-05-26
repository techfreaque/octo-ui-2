import { Rate, Tooltip } from "antd";
import type { CSSProperties} from "react";
import { useState } from "react";

import { projectName } from "../../../../constants/frontendConstants";
import type {
  AppStoreAppType} from "../../../../context/data/AppStoreDataProvider";
import {
  useAppStoreUserContext,
  useRateAppStore,
} from "../../../../context/data/AppStoreDataProvider";

export default function AppRating({
  app,
  rating,
  votes,
  style,
}: {
  app: AppStoreAppType;
  rating: number | undefined;
  votes: number | undefined;
  style?: CSSProperties;
}) {
  const [isLoading, setIsloading] = useState(false);
  const appStoreUser = useAppStoreUserContext();
  const isSignedIn = Boolean(appStoreUser?.token);
  const rateAppStore = useRateAppStore();
  async function onRatingChange(myRating: number) {
    rateAppStore(
      {
        rating: myRating,
        package_id: app.package_id,
      },
      setIsloading
    );
  }
  // TODO replace colors with variables
  return (
    <div
      style={{
        marginTop: "5px",
        marginBottom: "5px",
        display: "flex",
        alignItems: "center",
        fontSize: "12px",
        lineHeight: "16px",
        ...style,
      }}
    >
      <Tooltip
        title={
          app.is_from_store
            ? isSignedIn
              ? undefined
              : `Sign into ${projectName} to rate an app`
            : "Share the app before you can rate it"
        }
      >
        <div>
          <Rate
            allowHalf
            defaultValue={0}
            {...(rating ? { value: rating } : {})}
            disabled={
              !app.is_installed ||
              !app.is_from_store ||
              isLoading ||
              !isSignedIn
            }
            style={{
              color: "rgb(185, 179, 169)",
              fontSize: "14px",
            }}
            onChange={onRatingChange}
          />
          <span
            style={{
              color: "rgb(113, 113, 113)",
              padding: "0px 0px 0px 5px",
              lineHeight: "0px",
            }}
          >
            {formatnumberToKMBT(votes || 0)}
          </span>
        </div>
      </Tooltip>
    </div>
  );
}

function formatnumberToKMBT(number: number) {
  if (!number) {
    return 0;
  }
  if (number < 1e3) {
    return number.toString();
  }
  if (number >= 1e3 && number < 1e6) {
    return `${+(number / 1e3).toFixed(2)}K`;
  }
  if (number >= 1e6 && number < 1e9) {
    return `${+(number / 1e6).toFixed(2)}M`;
  }
  if (number >= 1e9 && number < 1e12) {
    return `${+(number / 1e9).toFixed(2)}B`;
  }

  return `${+(number / 1e12).toFixed(2)}T`;
}
