import { useMemo } from "react";

import {
  tentacleConfigTypes,
  useTentaclesConfigContext,
} from "../../../context/config/TentaclesConfigProvider";

// export default function TradingConfigTabs({ content }: UiLayoutPageLayoutType) {
//   const fetchCurrentTentaclesConfig = useFetchCurrentTradingTentaclesConfig();
//   const currentTentaclesConfig = useCurrentTradingConfig();
//   const saveTentaclesConfig = useSaveTentaclesConfig();
//   const setHiddenMetadataColumns = useUpdateHiddenBacktestingMetadataColumnsContext();
//   return (
//     <AbstractTentaclesConfig
//       fetchCurrentTentaclesConfig={fetchCurrentTentaclesConfig}
//       currentTentaclesTradingConfig={currentTentaclesConfig}
//       saveTentaclesConfig={saveTentaclesConfig}
//       setHiddenMetadataColumns={setHiddenMetadataColumns}
//       // additionalTabs={
//       //     [{
//       //             title: (
//       //                 <Tab key={"strategyConfigTab"}
//       //                     label={"Trading Modes"}
//       //                     value={"strategyConfigTab"}
//       //                     sx={
//       //                         {textTransform: 'none'}
//       //                     }/>
//       //             ),
//       //             tabId: "strategyConfigTab",
//       //             // content: (
//       //             //     <StraegyConfigurator/>)
//       //         }]
//       // }
//       content={content}
//     />
//   );
// }

export function useCurrentTradingConfig() {
  const currentTentaclesConfig = useTentaclesConfigContext();
  return useMemo(() => {
    return currentTentaclesConfig?.[tentacleConfigTypes.tradingTentacles];
  }, [currentTentaclesConfig]);
}
