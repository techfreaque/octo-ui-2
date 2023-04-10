import TabsWithSelector from "../../../components/Tabs/TabsWithSelector";
import { Button } from "@mui/material";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";
import { backendRoutes } from "../../../constants/backendConstants";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { useMemo } from "react";
import { useUpdateVisibleExchangesContext, useVisibleExchangesContext } from "../../../context/config/VisibleExchangesProvider";

export default function ExchangeSelector() {
  const botInfo = useBotInfoContext();
  const botDomain = useBotDomainContext();
  const visibleExchanges = useVisibleExchangesContext();
  const setVisibleExchanges = useUpdateVisibleExchangesContext();
  return useMemo(() => {
      return botInfo?.exchange_names && visibleExchanges && (
        <TabsWithSelector
          currentItem={visibleExchanges}
          items={botInfo.exchange_names}
          handleChange={(event, newExchange) => setVisibleExchanges(newExchange)}
        >
          
          <Button href={botDomain + backendRoutes.manageSymbol}>Manage exchange settings</Button>
        </TabsWithSelector>
      );
  }, [botDomain, botInfo, setVisibleExchanges, visibleExchanges])
}
