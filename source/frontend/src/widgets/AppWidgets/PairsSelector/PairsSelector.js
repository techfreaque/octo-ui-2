import TabsWithSelector from "../../../components/Tabs/TabsWithSelector";
import { Button } from "@mui/material";
import { useUpdateVisiblePairsContext, useVisiblePairsContext } from "../../../context/config/VisiblePairProvider";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";
import { backendRoutes } from "../../../constants/backendConstants";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";

export default function PairsSelector() {
  const botInfo = useBotInfoContext();
  const botDomain = useBotDomainContext();
  const visiblePairs = useVisiblePairsContext();
  const setVisiblePairs = useUpdateVisiblePairsContext();

  const handleChange = (event, newTimeframe) => {
    setVisiblePairs(newTimeframe);
  };
  if (botInfo && visiblePairs) {
    return (
      <TabsWithSelector
        currentItem={visiblePairs}
        items={botInfo.symbols}
        handleChange={handleChange}
      >
        <Button href={botDomain + backendRoutes.manageSymbol}>Manage Curreny Settings</Button>
      </TabsWithSelector>
    );
  } else {
    return <></>;
  }
}
