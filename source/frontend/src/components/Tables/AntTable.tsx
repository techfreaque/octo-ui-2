import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  InputRef,
  Space,
  Table,
  TablePaginationConfig,
} from "antd";
import {
  ExpandableConfig,
  FilterValue,
  SorterResult,
} from "antd/es/table/interface";
import { Dispatch, LegacyRef, SetStateAction, useRef, useState } from "react";

export interface AntTableDataType {
  key: string;
  [column: string]: string | number | boolean | JSX.Element | undefined | null;
}
export interface AntTableExpandableConfig<T extends AntTableDataType>
  extends ExpandableConfig<T> {
  expandedRowRender: (
    record: T,
    index: number,
    indent: number,
    expanded: boolean
  ) => JSX.Element;
}
export interface AntTableColumnType<T extends AntTableDataType> {
  title: string;
  dataIndex: string;
  key: string;
  width?: string;
  sorter?: (a: T, b: T) => number;
  filters?: {
    text: string;
    value: boolean | string | number;
  }[];
  sortDirections?: ["descend", "ascend"];
  searchColumnKey?: string;
}

export type AntTableSorterType<TAntTableDataType extends AntTableDataType> =
  | SorterResult<TAntTableDataType>[]
  | SorterResult<TAntTableDataType>;

export type AntTableFiltersType = Record<string, FilterValue | null>;

export default function AntTable<
  TAntTableDataType extends AntTableDataType,
  TAntTableColumnType extends AntTableColumnType<TAntTableDataType>
>({
  columns,
  data,
  onFilterChange,
  maxWidth = "650px",
  expandable,
}: {
  columns: TAntTableColumnType[];
  data: TAntTableDataType[];
  onFilterChange?: (
    tableParams:
      | {
          filters: AntTableFiltersType;
          sorter: AntTableSorterType<TAntTableDataType>;
        }
      | undefined,
    data: TAntTableDataType[]
  ) => TAntTableDataType[];
  maxWidth?: string;
  expandable?: AntTableExpandableConfig<TAntTableDataType>;
}) {
  // eslint-disable-next-line no-unused-vars
  const [searchText, setSearchText] = useState<string>("");
  // eslint-disable-next-line no-unused-vars
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <FilterDrowdown
        selectedKeys={selectedKeys}
        confirm={confirm}
        clearFilters={clearFilters}
        setSearchText={setSearchText}
        setSearchedColumn={setSearchedColumn}
        dataIndex={dataIndex}
        searchInput={searchInput}
        setSelectedKeys={setSelectedKeys}
        close={close}
      />
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => (searchInput.current as any)?.select(), 100);
      }
    },
    // render: (text) => searchedColumn === dataIndex ? (
    //     <Highlighter highlightStyle={
    //             {
    //                 backgroundColor: '#ffc069',
    //                 padding: 0
    //             }
    //         }
    //         searchWords={
    //             [searchText]
    //         }
    //         autoEscape
    //         textToHighlight={
    //             text ? text.toString() : ''
    //         }/>
    // ) : (text)
  });
  const _columns = columns.map((column) =>
    column.searchColumnKey
      ? {
          ...column,
          ...getColumnSearchProps(column.searchColumnKey),
        }
      : column
  );

  const searchInput = useRef(null);

  const [tableParams, setTableParams] = useState<{
    filters: AntTableFiltersType;
    sorter: AntTableSorterType<TAntTableDataType>;
  }>();
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: AntTableFiltersType,
    sorter: AntTableSorterType<TAntTableDataType>
  ) => {
    setTableParams({
      // pagination,
      filters,
      sorter,
    });
  };

  const _data = onFilterChange ? onFilterChange(tableParams, data) : data;
  return (
    <div
      className="pairs-table"
      style={{
        //     maxHeight: "calc(100vh - 80px)",
        overflowX: "auto",
        overflowY: "auto",
        maxWidth,
        width: "100vw",
        maxHeight: "calc(100vh - 200px)",
      }}
    >
      <Table
        columns={_columns}
        scroll={{
          // x: false,
          // y: false,
        }}
        expandable={expandable}
        style={
          {
            // overflow: "hidden"
            // maxWidth: "650px",
            // maxHeight: "calc(100vh - 80px)",
          }
        }
        dataSource={_data}
        sticky={true}
        onChange={handleTableChange}
        pagination={{ position: ["bottomLeft"] }}
        // filters={tableParams?.filters}
      />
    </div>
  );
}

function FilterDrowdown({
  selectedKeys,
  confirm,
  clearFilters,
  setSearchText,
  setSearchedColumn,
  dataIndex,
  searchInput,
  setSelectedKeys,
  close,
}: {
  selectedKeys;
  confirm;
  clearFilters;
  setSearchText: Dispatch<SetStateAction<string>>;
  setSearchedColumn: Dispatch<SetStateAction<string>>;
  dataIndex;
  searchInput: LegacyRef<InputRef>;
  setSelectedKeys;
  close: () => void;
}) {
  const handleSearch = () => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = () => {
    if (clearFilters) {
      clearFilters();
      setSearchText("");
    }
  };
  return (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <Input
        ref={searchInput}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => handleSearch()}
        style={{
          marginBottom: 8,
          display: "block",
        }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch()}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset()}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => {
            confirm({ closeDropdown: false });
            setSearchText(selectedKeys[0]);
            setSearchedColumn(dataIndex);
          }}
        >
          Filter
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => {
            close();
          }}
        >
          close
        </Button>
      </Space>
    </div>
  );
}
