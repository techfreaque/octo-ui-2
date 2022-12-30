import TabsWithSelector from "../../../components/Tabs/TabsWithSelector";
import { Button } from "@mui/material";
import { useUpdateVisiblePairsContext, useVisiblePairsContext } from "../../../context/config/VisiblePairProvider";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";
import { backendRoutes } from "../../../constants/backendConstants";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { useMemo } from "react";

export default function PairsSelector() {
  const botInfo = useBotInfoContext();
  const botDomain = useBotDomainContext();
  const visiblePairs = useVisiblePairsContext();
  const setVisiblePairs = useUpdateVisiblePairsContext();
  return useMemo(() => {
    if (botInfo && visiblePairs) {
      return (
        <TabsWithSelector
          currentItem={visiblePairs}
          items={botInfo.symbols}
          handleChange={(event, newTimeframe) => setVisiblePairs(newTimeframe)}
        >
          <Button href={botDomain + backendRoutes.manageSymbol}>Manage Currency Settings</Button>
        </TabsWithSelector>
      );
    } else {
      return <></>;
    }
  }, [botDomain, botInfo, setVisiblePairs, visiblePairs])
}
