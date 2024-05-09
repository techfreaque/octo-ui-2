import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Input,
  InputRef,
  Space,
  Table,
  TablePaginationConfig,
} from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import {
  ExpandableConfig,
  FilterDropdownProps,
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";
import {
  Dispatch,
  LegacyRef,
  RefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";

export default function AntTable<
  TAntTableDataType extends AntTableDataType,
  TAntTableColumnType extends AntTableColumnType<TAntTableDataType>
>({
  columns,
  data,
  maxWidth = "850px",
  paginationSize = 10,
  expandable,
  selectedRowKeys,
  setSelectedRowKeys,
  size,
  header,
  onChange,
}: {
  columns: TAntTableColumnType[];
  data: TAntTableDataType[];
  maxWidth?: string;
  paginationSize?: number;
  expandable?: AntTableExpandableConfig<TAntTableDataType>;
  selectedRowKeys?: string[] | undefined;
  setSelectedRowKeys?: Dispatch<SetStateAction<string[] | undefined>>;
  onChange?: (currentData: TAntTableDataType[]) => void;
  size?: SizeType;
  header?: JSX.Element | undefined;
}) {
  const searchInput = useRef<InputRef>(null);
  function formatColumns(
    columns: TAntTableColumnType[],
    searchInput: RefObject<InputRef>
  ): TAntTableColumnType[] {
    return columns.map((column) => {
      if (!column.disableSearch && !column.filters) {
        return {
          ...column,
          sorter: getSorter<TAntTableDataType, TAntTableColumnType>(column),
          ...getColumnSearchProps(column.title, searchInput),
        };
      }
      return {
        ...column,
        ...(column.children
          ? {
              children: formatColumns(
                column.children as TAntTableColumnType[],
                searchInput
              ),
            }
          : {}),
        sorter: getSorter<TAntTableDataType, TAntTableColumnType>(column),
      };
    });
  }
  const _columns: TAntTableColumnType[] = formatColumns(columns, searchInput);

  const [filters, setFilters] = useState<AntTableFiltersType>();

  const handleTableChange = (
    _pagination: TablePaginationConfig,
    filters: AntTableFiltersType,
    _sort: SorterResult<TAntTableDataType> | SorterResult<TAntTableDataType>[],
    extra: TableCurrentDataSource<TAntTableDataType>
  ) => {
    onChange?.(extra.currentDataSource);
    setFilters(filters);
  };
  const _data = filterData(filters, data, columns);

  return (
    <div
      style={{
        overflowX: "auto",
        overflowY: "auto",
        maxWidth,
        width: "100%",
        maxHeight: "calc(100vh - 200px)",
      }}
    >
      <Table
        columns={_columns}
        scroll={{}}
        {...(expandable ? { expandable } : {})}
        style={{
          width: "100%",
        }}
        dataSource={_data}
        sticky={true}
        onChange={handleTableChange}
        {...(header
          ? {
              title: () => (
                <Flex gap={10} justify={"flex-start"} align={"center"}>
                  {header}
                </Flex>
              ),
            }
          : {})}
        size={size}
        {...(setSelectedRowKeys
          ? {
              rowSelection: {
                selectedRowKeys: selectedRowKeys || [],
                onChange: (newSelectedRowKeys: React.Key[]) => {
                  // only strings allowed as keys
                  setSelectedRowKeys(newSelectedRowKeys as string[]);
                },
                selections: [
                  Table.SELECTION_ALL,
                  Table.SELECTION_INVERT,
                  Table.SELECTION_NONE,
                ],
              },
            }
          : {})}
        pagination={
          _data.length > paginationSize ? { position: ["bottomLeft"] } : false
        }
      />
    </div>
  );
}

const getColumnSearchProps = (
  elementName: string,
  searchInput: RefObject<InputRef>
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    close,
    visible,
    prefixCls,
  }: FilterDropdownProps) => (
    <FilterDrowdown
      close={close}
      prefixCls={prefixCls}
      visible={visible}
      selectedKeys={selectedKeys}
      confirm={confirm}
      {...(clearFilters ? { clearFilters } : {})}
      elementName={elementName}
      searchInput={searchInput}
      setSelectedKeys={setSelectedKeys}
    />
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined
      style={{
        color: filtered ? "#1890ff" : undefined,
      }}
    />
  ),
  // onFilter: (value: React.Key | boolean, record: TAntTableDataType) => {
  //   const _value = typeof value === "string" ? value.toLowerCase() : value;
  //   const recordValue =
  //     typeof (record as any)[dataIndex] === "string"
  //       ? (record as any)[dataIndex].toLowerCase()
  //       : (record as any)[dataIndex];
  //   return recordValue.includes(_value);
  // },
  onFilterDropdownOpenChange: (visible: boolean) => {
    if (visible) {
      setTimeout(() => (searchInput.current as any)?.select(), 100);
    }
  },
});

function getSorter<
  TAntTableDataType extends AntTableDataType,
  TAntTableColumnType extends AntTableColumnType<TAntTableDataType>
>(
  column: TAntTableColumnType
): ((a: TAntTableDataType, b: TAntTableDataType) => any) | undefined {
  if (column.dsorter === "boolean") {
    return (a: TAntTableDataType, b: TAntTableDataType) =>
      ((a as any)[column.key] === true ? 1 : 0) -
      ((b as any)[column.key] === true ? 1 : 0);
  }
  if (column.dsorter === "string") {
    return (a: TAntTableDataType, b: TAntTableDataType) =>
      (b as any)[column.key] &&
      (a as any)[column.key]?.localeCompare((b as any)[column.key]);
  }
  if (column.dsorter === "number") {
    return (a: TAntTableDataType, b: TAntTableDataType) => {
      // Get the values of the property for both items
      const propA = (a as any)[column.key] as number | undefined;
      const propB = (b as any)[column.key] as number | undefined;

      // If either property is undefined, return 0
      if (propA === undefined && propB === undefined) {
        return 0;
      }
      if (propA === undefined) {
        return 1;
      }
      if (propB === undefined) {
        return -1;
      }

      // Compare the numbers directly
      return propA - propB;
    };
  }
  if (column.dsorter === "string[]") {
    return (a: TAntTableDataType, b: TAntTableDataType) => {
      // Get the values of the property for both items
      const propA = (a as any)[column.key] as string[] | undefined;
      const propB = (b as any)[column.key] as string[] | undefined;

      // Check if both properties are arrays
      if (Array.isArray(propA) && Array.isArray(propB)) {
        // Sort arrays alphabetically and compare lexicographically
        const sortedPropA = propA.slice().sort();
        const sortedPropB = propB.slice().sort();

        for (let i = 0; i < sortedPropA.length && i < sortedPropB.length; i++) {
          const comparisonResult = sortedPropA[i].localeCompare(sortedPropB[i]);
          if (comparisonResult !== 0) {
            return comparisonResult;
          }
        }

        // If all values are equal so far, the item with fewer values comes first
        return sortedPropA.length - sortedPropB.length;
      }

      // Handle cases where one property is undefined
      if (!propA && !propB) {
        return 0;
      }
      if (!propA) {
        return 1;
      }
      if (!propB) {
        return -1;
      }
      return 0;
    };
  }
  if (column.dsorter) {
    return column.dsorter;
  }
  return undefined;
}

function filterData<
  TAntTableDataType extends AntTableDataType,
  TAntTableColumn extends AntTableColumnType<TAntTableDataType>
>(
  filters: AntTableFiltersType | undefined,
  data: TAntTableDataType[],
  columns: TAntTableColumn[]
): TAntTableDataType[] {
  const columnsByKey: {
    [key: string]: TAntTableColumn;
  } = {};
  if (!filters) {
    return data;
  }
  columns.forEach((column) => {
    columnsByKey[column.key] = column;
  });
  return data.filter((item) => {
    return Object.entries(filters).every(([columnId, filter]) => {
      if (!filter) {
        return true;
      }
      if (columnsByKey[columnId]?.dfilter) {
        return columnsByKey[columnId].dfilter?.(item, filter);
      }
      if (columnsByKey[columnId]?.filters) {
        return (
          ["string", "number", "boolean"].includes(
            typeof (item as any)?.[columnId]
          ) &&
          filter.includes((item as any)[columnId] as string | number | boolean)
        );
      }
      if (typeof (item as any)?.[columnId] === "string") {
        return ((item as any)[columnId] as string)
          .toLowerCase()
          .includes(String(filter[0]).toLowerCase());
      }
    });
  });
}

function FilterDrowdown({
  selectedKeys,
  confirm,
  clearFilters,
  elementName,
  searchInput,
  setSelectedKeys,
}: FilterDropdownProps & {
  elementName: string;
  searchInput: LegacyRef<InputRef>;
}) {
  const handleSearch = () => {
    confirm();
  };
  const handleReset = () => {
    if (clearFilters) {
      clearFilters();
      confirm();
    }
  };
  return (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <Input
        ref={searchInput}
        placeholder={`Search ${elementName}`}
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
      </Space>
    </div>
  );
}

export interface AntTableDataType {
  id: string;
  key: string;
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
export interface AntTableColumnType<
  TAntTableDataType extends AntTableDataType
> {
  title: string;
  key: string;
  // dataIndex to use another column to sort / filter
  dataIndex?: string;
  width?: string;
  dsorter?:
    | ((a: TAntTableDataType, b: TAntTableDataType) => number)
    | "string"
    | "boolean"
    | "number"
    | "string[]"
    | undefined;
  filters?: {
    text: string;
    value: boolean | string | number;
  }[];
  children?: AntTableColumnType<TAntTableDataType>[];
  sortDirections?: ["descend", "ascend"];
  disableSearch?: boolean;
  dfilter?: (
    item: TAntTableDataType,
    symbolValueFilter: FilterValue
  ) => boolean;
}

export type AntTableFiltersType = Record<string, FilterValue | null>;
