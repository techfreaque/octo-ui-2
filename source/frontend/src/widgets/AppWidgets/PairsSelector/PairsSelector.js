import { useBotInfoContext } from "../../../context/BotInfoProvider";
import {
  useUpdateVisiblePairsContext,
  useVisiblePairsContext,
} from "../../../context/VisiblePairProvider";
import TabsWithSelector from "../../../components/Tabs/TabsWithSelector";
import { Button } from "@mui/material";

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
