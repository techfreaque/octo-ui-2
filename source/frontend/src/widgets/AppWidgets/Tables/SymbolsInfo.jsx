import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button, Divider, FormControlLabel, Switch, TableSortLabel, TextField } from "@mui/material";
import React, { useState } from "react";
import { fetchSymbolsInfo } from "../../../api/data";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row(props) {
  const { row, useCompactLayout } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} onClick={() => setOpen(!open)}>
        {useCompactLayout && <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>}
        {useCompactLayout
          ? <>
            <TableCell>{row.symbol}</TableCell>
            <TableCell>{row.fundingRate}</TableCell>
            <TableCell>{row.nextUpdate}</TableCell>
          </>
          : Object.values(row).map((rowValue, index) => (
            <TableCell key={index}>{rowValue}</TableCell>
          ))}
      </TableRow>
      {useCompactLayout && <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Leverage Tiers
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Leverage Tier</TableCell>
                    <TableCell>Max Leverage</TableCell>
                    <TableCell>From Notional</TableCell>
                    <TableCell>To Notional</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row?.leverageTiers.map((leverageTierData) => (
                    <TableRow key={leverageTierData.tier}>
                      <TableCell>
                        Leverage Tier {leverageTierData.tier}
                      </TableCell>
                      <TableCell>{leverageTierData.max_leverage}</TableCell>
                      <TableCell>{leverageTierData.min_notional}</TableCell>
                      <TableCell>{leverageTierData.max_notional}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>}
    </React.Fragment>
  );
}

export default function SymbolsInfoTable() {
  const [symbolsInfo, setSymbolsInfo] = useState()
  const [isLoading, setisLoading] = useState(false)
  const [useCompactLayout, setUseCompactLayout] = useState(false)
  const [triedToLoad, setTriedToLoad] = useState()
  const [symbolsSearch, setSymbolsSearch] = useState()
  const botDomain = useBotDomainContext();
  const isBotOnline = useIsBotOnlineContext();
  const currentSymbolsInfo = [];
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('symbol');
  let maxTier = 0
  const additionalCells = []

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  if (symbolsInfo) {
    Object.keys(symbolsInfo).forEach((exchangeName, id) => {
      Object.keys(symbolsInfo[exchangeName].leverage_tiers || symbolsInfo[exchangeName].funding).forEach((symbol) => {
        const fundingData = symbolsInfo[exchangeName].funding?.[symbol]
        const infoData = {
          symbol: symbol,
          fundingRate: fundingData?.funding_rate,
          // lastUpdated: fundingData?.last_updated && String(new Date(fundingData.last_updated)),
          nextUpdate: fundingData?.next_update && String(new Date(fundingData.next_update)),
        }
        const thisLeverageTiers = symbolsInfo[exchangeName]?.leverage_tiers?.[symbol] || []
        if (useCompactLayout) {
          infoData.leverageTiers = symbolsInfo[exchangeName]?.leverage_tiers?.[symbol]
        } else {
          thisLeverageTiers.forEach((thisTierData) => {
            const tierSuffix = "_" + thisTierData.tier
            infoData["tier" + tierSuffix] = thisTierData.tier
            infoData["maxLeverage" + tierSuffix] = thisTierData.max_leverage
            // infoData["minNotional" + tierSuffix] = thisTierData.min_notional
            infoData["maxNotional" + tierSuffix] = thisTierData.max_notional
            if (maxTier < thisTierData.tier) {
              maxTier = thisTierData.tier
              additionalCells.push(<>
                <TableCell>Tier {thisTierData.tier}</TableCell>
                <SortedCell orderBy={orderBy} order={order} colKey={"maxLeverage" + tierSuffix} setSorted={handleRequestSort}>Leverage {thisTierData.tier}</SortedCell>
                <SortedCell orderBy={orderBy} order={order} colKey={"maxNotional" + tierSuffix} setSorted={handleRequestSort}>Max Notional {thisTierData.tier}</SortedCell>
              </>)
            }
          })
        }
        currentSymbolsInfo.push(infoData);

      })
    })
  }
  const currentFilteredSymbolsInfo = symbolsSearch ? currentSymbolsInfo.filter(infoData => {
    return infoData.symbol.toLowerCase().includes(symbolsSearch.toLowerCase())
  }) : currentSymbolsInfo




  const currentSortedSymbolsInfo = currentFilteredSymbolsInfo.sort((dataA, dataB) => {
    const _dataA = dataA[orderBy]
    const _dataB = dataB[orderBy]
    if (typeof (_dataA) === 'string') {
      if (order === 'asc') {
        if (_dataA && _dataB) {
          return _dataA < _dataB ? 1 : -1
        } else {
          return -1
        }
      } else {
        if (_dataA && _dataB) {
          return _dataA < _dataB ? -1 : 1
        } else {
          return 1
        }
      }
    }
    else {
      if (order === 'asc') {
        if (_dataA && _dataB) {
          return _dataA - _dataB
        } else if (_dataA) {
          return 1
        } else {
          return -1
        }
      } else {
        if (_dataA && _dataB) {
          return _dataB - _dataA
        } else if (_dataA) {
          return -1
        } else {
          return 1
        }
      }
    }
  })


  return (
    <TableContainer component={Paper} style={{ maxHeight: "100%" }}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          marginLeft: "auto",
          '& svg': {
            m: 1.5,
          },
          '& hr': {
            mx: 0.5,
          },
        }}
      >
        <Button style={{ marginLeft: "auto", marginRight: "auto" }}
          disabled={!isBotOnline || isLoading}
          onClick={() => {
            setisLoading(true)
            fetchSymbolsInfo(setSymbolsInfo, botDomain).then(() => {
              setTriedToLoad(true)
              setisLoading(false)
            })
          }} >
          <FontAwesomeIcon style={{ marginRight: "10px" }} icon={faRefresh} /> Load Symbols Info
        </Button>
        {symbolsInfo && <>
          <FormControlLabel
            control={<Switch checked={useCompactLayout} onChange={(event) => setUseCompactLayout(event.target.checked)} />}
            label="Compact Table"
          />
          <Divider orientation="vertical" variant="middle" flexItem />
          <TextField
            label="Search for a symbol"
            value={symbolsSearch}
            variant="filled"
            style={{ marginRight: "10px" }}
            onChange={(event) => {
              setSymbolsSearch(event.target.value);
            }}
          />
        </>}
      </Box>
      {symbolsInfo
        ? <Table stickyHeader >
          <TableHead>
            <TableRow>
              {useCompactLayout && <TableCell />}
              <SortedCell orderBy={orderBy} order={order} colKey="symbol" setSorted={handleRequestSort}>Symbol</SortedCell>
              <SortedCell orderBy={orderBy} order={order} colKey="fundingRate" setSorted={handleRequestSort}>Funding Rate</SortedCell>
              <SortedCell orderBy={orderBy} order={order} colKey="nextUpdate" setSorted={handleRequestSort}>Next Funding Update</SortedCell>
              {!useCompactLayout && additionalCells.map(cell => cell)}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentSortedSymbolsInfo.map((row) => (
              <Row key={row.symbol} row={row} useCompactLayout={useCompactLayout} />
            ))}
          </TableBody>
        </Table>
        : (triedToLoad
          && <Alert severity="info">No symbols info data available for this exchange</Alert>)
      }
    </TableContainer>
  );
}

function SortedCell({ orderBy, order, colKey, setSorted, children }) {
  return <TableCell
    key={colKey}

    sortDirection={orderBy === colKey ? order : false}
  >
    <TableSortLabel
      active={orderBy === colKey}
      direction={order}
      onClick={() => setSorted(colKey)}
    >
      {children}
    </TableSortLabel>
  </TableCell>
}