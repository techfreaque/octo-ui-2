import {SearchOutlined} from "@ant-design/icons";
import {Button, Input, Space, Table} from "antd";
import {useRef, useState} from "react";

export default function AntTable({columns, data, onFilterChange, maxWidth= "650px"}) {
    // eslint-disable-next-line no-unused-vars
    const [searchText, setSearchText] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [searchedColumn, setSearchedColumn] = useState('');
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: (
            {
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
                close
            }
        ) => (<FilterDrowdown selectedKeys={selectedKeys}
                confirm={confirm}
                clearFilters={clearFilters}
                setSearchText={setSearchText}
                setSearchedColumn={setSearchedColumn}
                dataIndex={dataIndex}
                searchInput={searchInput}
                setSelectedKeys={setSelectedKeys}
                close={close}/>),
        filterIcon: (filtered) => (<SearchOutlined style={
                {
                    color: filtered ? '#1890ff' : undefined
                }
            }/>),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
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
    const _columns = columns.map(column => (column.searchColumnKey ? {
        ...column,
        ...getColumnSearchProps(column.searchColumnKey)
    } : column))

    const searchInput = useRef(null);

    const [tableParams, setTableParams] = useState({
        // filters: {
        //     enabled: [true]
        // }
        // pagination: {
        // current: 1,
        // pageSize: 10,
        // },
    });
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({ // pagination,
            filters,
            ...sorter
        });
    };

    const _data = onFilterChange(tableParams, data)
    return (<div className='pairs-table'
        style={
            {
                //     maxHeight: "calc(100vh - 80px)",
                overflowX: "auto",
                overflowY: "auto",
                maxWidth: maxWidth,
                width: "100vw",
                maxHeight: "calc(100vh - 140px)"
            }
    }>

        <Table columns={_columns}
            scroll={
                {
                    x: false,
                    y: false
                }
            }

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
            pagination={
                {position: ["bottomLeft"]}
            }
            filters={
                tableParams?.filters
            }/>
    </div>)
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
    close
}) {
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    return (<div style={
            {padding: 8}
        }
        onKeyDown={
            (e) => e.stopPropagation()
    }>
        <Input ref={searchInput}
            placeholder={
                `Search ${dataIndex}`
            }
            value={
                selectedKeys[0]
            }
            onChange={
                (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={
                () => handleSearch(selectedKeys, confirm, dataIndex)
            }
            style={
                {
                    marginBottom: 8,
                    display: 'block'
                }
            }/>
        <Space>
            <Button type="primary"
                onClick={
                    () => handleSearch(selectedKeys, confirm, dataIndex)
                }
                icon={
                    (<SearchOutlined/>)
                }
                size="small"
                style={
                    {width: 90}
            }>
                Search
            </Button>
            <Button onClick={
                    () => clearFilters && handleReset(clearFilters)
                }
                size="small"
                style={
                    {width: 90}
            }>
                Reset
            </Button>
            <Button type="link" size="small"
                onClick={
                    () => {
                        confirm({closeDropdown: false});
                        setSearchText(selectedKeys[0]);
                        setSearchedColumn(dataIndex);
                    }
            }>
                Filter
            </Button>
            <Button type="link" size="small"
                onClick={
                    () => {
                        close();
                    }
            }>
                close
            </Button>
        </Space>
    </div>)
}
