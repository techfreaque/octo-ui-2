import { useEffect, useState } from "react";
import { useGetAffiliateDashboard } from "../../../../context/data/AppStoreDataProvider";
import { Typography } from "antd";

export default function AffiliateDashboard() {
  const [dashboardData, setDashboardData] = useState();
  const getAffiliateDashboard = useGetAffiliateDashboard();
  useEffect(() => {
    getAffiliateDashboard(setDashboardData);
  }, [getAffiliateDashboard]);

  return (
    <div style={{ margin: "20px 0" }}>
      <Typography.Title level={2}>Affiliate Program</Typography.Title>
      <Typography.Paragraph>
        With Octane Affiliate Program you get commissions when people from your
        network become our customers. You earn money. They get a top product. A
        win-win situation!
      </Typography.Paragraph>
      <Typography.Title level={3}>Monetize your Network</Typography.Title>
      <Typography.Title level={3}>Monetize your Network</Typography.Title>
      {JSON.stringify(dashboardData)}
    </div>
  );
}
