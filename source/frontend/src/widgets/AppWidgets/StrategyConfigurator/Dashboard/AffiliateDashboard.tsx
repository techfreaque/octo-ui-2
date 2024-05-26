import { Typography } from "antd";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Trans } from "react-i18next";

import { projectName } from "../../../../constants/frontendConstants";
import { useGetAffiliateDashboard } from "../../../../context/data/AppStoreDataProvider";

export default function AffiliateDashboard() {
  const [dashboardData, setDashboardData] = useState<AffiliateDashboardData>();
  const getAffiliateDashboard = useGetAffiliateDashboard();
  useEffect(() => {
    getAffiliateDashboard(setDashboardData);
  }, [getAffiliateDashboard]);

  return (
    <div style={{ margin: "20px 0" }}>
      <Typography.Title level={2}>
        <Trans i18nKey="manageAccount.affiliateDashboard.affiliate-program" />
      </Typography.Title>
      <Typography.Paragraph>
        {t(
          "manageAccount.affiliateDashboard.with-projectname-affiliate-program-you-get-commissions-when-people-from-your-network-become-our-customers-you-earn-money-they-get-a-top-product-a-win-win-situation",
          { projectName }
        )}
      </Typography.Paragraph>
      <Typography.Title level={3}>
        <Trans i18nKey="manageAccount.affiliateDashboard.monetize-your-network" />
      </Typography.Title>
      {JSON.stringify(dashboardData)}
    </div>
  );
}

export interface AffiliateDashboardData {
  todo: string;
}
