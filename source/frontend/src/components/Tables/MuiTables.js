import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function MuiTable({ data, visibleFields }) {
  // Otherwise filter will be applied on fields such as the hidden column id
  const columns = React.useMemo(
    () => data.columns.filter((column) => visibleFields.includes(column.field)),
    [data.columns, visibleFields]
  );

  return (
    data &&
    visibleFields && (
      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          {...data}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
        />
      </Box>
    )
  );
}
