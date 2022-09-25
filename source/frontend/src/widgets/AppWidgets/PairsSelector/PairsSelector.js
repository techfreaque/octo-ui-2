import TabsWithSelector from "../../../components/Tabs/TabsWithSelector";
import { Button } from "@mui/material";
import { useUpdateVisiblePairsContext, useVisiblePairsContext } from "../../../context/config/VisiblePairProvider";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";

export default function PairsSelector() {
  const botInfo = useBotInfoContext();
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
        <Button>Manage Curreny Settings</Button>
      </TabsWithSelector>
    );
  } else {
    return <></>;
  }
}
