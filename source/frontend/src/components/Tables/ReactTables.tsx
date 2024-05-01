import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  Cell,
} from "@table-library/react-table-library/table";

import { useTheme } from "@table-library/react-table-library/theme";

import {
  useSort,
  HeaderCellSort,
} from "@table-library/react-table-library/sort";

import UnfoldMoreOutlinedIcon from "@mui/icons-material/UnfoldMoreOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { useBotColorsContext } from "../../context/config/BotColorsProvider";
import { useEffect, useState } from "react";

interface ReactTableProps {
  cells: { title: string; key: string }[];
  nodes: {
    id: number;
    [key: string]: string | number;
  }[];
}

export default function ReactTables({ nodes, cells }: ReactTableProps) {
  const botColors = useBotColorsContext();
  const data = { nodes };
  const [theme, setTheme] = useState({
    Table: `
        // color: ${botColors.font};
        `,
    // Header: ``,
    // Body: ``,
    // BaseRow: ``,
    // HeaderRow: ``,
    // Row: ``,
    // BaseCell: ``,
    // HeaderCell: ``,
    // Cell: ``,
  });

  const sort = useSort(
    data,
    {},
    {
      sortFns: {},
      sortIcon: {
        margin: "4px",
        iconDefault: <UnfoldMoreOutlinedIcon fontSize="small" />,
        iconUp: <KeyboardArrowUpOutlinedIcon fontSize="small" />,
        iconDown: <KeyboardArrowDownOutlinedIcon fontSize="small" />,
      },
    }
  );
  useEffect(() => {
    setTheme({
      Table: `
        color: ${botColors.font};
        `,
    });
  }, [botColors]);
  const _theme = useTheme(theme);
  return (
    <Table
      data={data}
      theme={_theme}
      layout={{ fixedHeader: true }}
      sort={sort}
    >
      {(tableList) => (
        <>
          <Header>
            <HeaderRow>
              {cells.map((cell) => (
                <HeaderCellSort sortKey={cell.key} key={cell.key}>
                  {cell.title}
                </HeaderCellSort>
              ))}
            </HeaderRow>
          </Header>
          <Body>
            {tableList.map((item) => (
              <Row key={item.id} item={item}>
                {cells.map((cell) => (
                  <Cell key={cell.key}>{item[cell.key]}</Cell>
                ))}
              </Row>
            ))}
          </Body>
        </>
      )}
    </Table>
  );
}
