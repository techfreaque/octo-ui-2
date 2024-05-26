import { ExportOutlined } from "@ant-design/icons";

import AppIconButton from "../../../../../components/Buttons/AppIconButton";
import { useBotDomainContext } from "../../../../../context/config/BotDomainProvider";
import type { AppStoreAppType } from "../../../../../context/data/AppStoreDataProvider";

export default function ExportApp({
  app,
  exportUrl,
}: {
  app: AppStoreAppType;
  exportUrl: string;
}) {
  const botDomain = useBotDomainContext();
  return app.is_installed ? (
    <AppIconButton
      isSelected={app.is_selected}
      buttonTitle={app.categories[0] ? `Export ${app.categories[0]}` : "Export"}
      antIconComponent={ExportOutlined}
      href={botDomain + exportUrl}
    />
  ) : (
    <></>
  );
}
