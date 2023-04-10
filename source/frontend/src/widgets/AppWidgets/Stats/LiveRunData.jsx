import { Chip, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react"
import { useVisiblePairsContext } from "../../../context/config/VisiblePairProvider";
import { useVisibleTimeFramesContext } from "../../../context/config/VisibleTimeFrameProvider";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";
import { useBotPlottedElementsContext } from "../../../context/data/BotPlottedElementsProvider"

export default function LiveRunMetaData() {
    const botPlottedElements = useBotPlottedElementsContext()
    const botInfo = useBotInfoContext();
    const [metadata, setMetadata] = useState();
    const visiblePairs = useVisiblePairsContext();
    const visibleTimeframes = useVisibleTimeFramesContext();
    useEffect(() => {
        botPlottedElements?.live && botInfo?.live_id && visiblePairs && visibleTimeframes &&
            botPlottedElements.live?.[botInfo.live_id]?.[visiblePairs]?.[visibleTimeframes]?.data?.sub_elements?.forEach(element => {
                if (element.type === "dictionary") {
                    const newMetadata = { ...element?.data?.elements[0]?.value }
                    newMetadata["start portfolio"] = JSON.parse(newMetadata["start portfolio"].replace(/'/g, '"'))
                    newMetadata["end portfolio"] = JSON.parse(newMetadata["end portfolio"].replace(/'/g, '"'))
                    setMetadata(newMetadata)
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [botPlottedElements?.live])
    return useMemo(() => {
        if (metadata) {
            return (<Grid container spacing={1} >
                <Grid item xs={12}>
                    <h2 style={{ textAlign: "center", margin: "20px" }}>Run details</h2>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div style={{ textAlign: "center" }}>
                        Live id: <Chip variant="outlined" label={metadata.id} />
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div style={{ textAlign: "center" }}>
                        Exchanges: {metadata.exchanges.map(exchange => (
                            <Chip key={exchange} variant="outlined" label={exchange} />
                        ))}
                    </div>
                </Grid>
                {metadata.leverage !== 0 && <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div style={{ textAlign: "center" }}>
                        Leverage: <Chip variant="outlined" label={metadata.leverage} />
                    </div>
                </Grid>
                }
                {
                    metadata.name && <Grid item xs={12} sm={6} md={4} lg={3}>
                        <div style={{ textAlign: "center" }}>
                            Strategy Name: <Chip variant="outlined" label={metadata.name} />
                        </div>
                    </Grid>
                }
                <Grid item xs={12} sm={6} md={4} lg={3} >
                    <div style={{ textAlign: "center" }}>
                        Reference market: <Chip variant="outlined" label={metadata.ref_market} />
                    </div>
                </Grid>
                {
                    metadata.future_contracts && Object.keys(metadata.future_contracts).length
                    && <Grid item xs={12} md={8} lg={6}>
                        <div style={{ textAlign: "center" }}>
                            Future contracts:<br />
                            {Object.keys(metadata.future_contracts).map(exchange => (
                                <div key={exchange}>
                                    {exchange}:<br /><Chip variant="outlined" label={<>
                                        {Object.keys(metadata.future_contracts[exchange]).map(pair => (
                                            <div key={pair}>
                                                {pair}: {metadata.future_contracts[exchange][pair].contract_type.replace(/_/g, " ") + " - "
                                                    + metadata.future_contracts[exchange][pair].margin_type.replace(/_/g, " ") + " - "
                                                    + metadata.future_contracts[exchange][pair].position_mode.replace(/_/g, " ")}
                                            </div>
                                        ))}
                                    </>} />
                                </div>
                            ))}
                        </div>
                    </Grid>
                }
                <Grid item xs={12} sm={6} md={4} lg={3} >
                    <div style={{ textAlign: "center" }}>
                        Symbols: {Object.values(metadata.symbols).map(symbol => (
                            <Chip key={symbol} variant="outlined" label={symbol} />
                        ))}
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div style={{ textAlign: "center" }}>
                        Time frames: {Object.values(metadata["time frames"]).map(timeFrame => (
                            <Chip key={timeFrame} variant="outlined" label={timeFrame} />
                        ))}
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div style={{ textAlign: "center" }}>
                        Trading type: <Chip variant="outlined" label={metadata.trading_type} />
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <h2 style={{ textAlign: "center", margin: "20px" }}>Run performance</h2>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div style={{ textAlign: "center" }}>
                        Gains: <Chip variant="outlined" label={metadata.gains} />
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div style={{ textAlign: "center" }}>
                        Loses: <Chip variant="outlined" label={metadata.loses} />
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div style={{ textAlign: "center" }}>
                        R² end balance: <Chip variant="outlined" label={metadata["R² end balance"]} />
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div style={{ textAlign: "center" }}>
                        R² max balance: <Chip variant="outlined" label={metadata["R² max balance"]} />
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div style={{ textAlign: "center" }}>
                        Start portfolio: {Object.keys(metadata["start portfolio"]).map((asset) => (
                            <Chip key={asset} variant="outlined" label={asset + ": " + metadata["start portfolio"][asset].total} />
                        ))}
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div style={{ textAlign: "center" }}>
                        End portfolio: {Object.keys(metadata["end portfolio"]).map((asset) => (
                            <Chip key={asset} variant="outlined" label={asset + ": " + metadata["end portfolio"][asset].total} />
                        ))}
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div style={{ textAlign: "center" }}>
                        % draw down:  <Chip variant="outlined" label={metadata["% draw down"]} />
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div style={{ textAlign: "center" }}>
                        % gains: <Chip variant="outlined" label={metadata["% gains"]} />
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div style={{ textAlign: "center" }}>
                        % win rate: <Chip variant="outlined" label={metadata["% win rate"]} />
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div style={{ textAlign: "center" }}>
                        Entries: <Chip variant="outlined" label={metadata.entries} />
                    </div>
                </Grid>


                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div style={{ textAlign: "center" }}>
                        Trades: <Chip variant="outlined" label={metadata.trades} />
                    </div>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div style={{ textAlign: "center" }}>
                        Wins: <Chip variant="outlined" label={metadata.wins} />
                    </div>
                </Grid>

            </Grid>

            )
        }
    }, [metadata])
}