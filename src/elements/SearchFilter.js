import React from 'react';
import Highlighter from 'react-highlight-words';
import {SearchOutlined} from '@ant-design/icons';
import {Button,Input,Space} from 'antd';

const state = {
    searchText:'',
    searchedColumn:''
}
export const getColumnSearchProps = (dataIndex,searchInput) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 100 }}
          >
            Tìm kiếm
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Làm mới
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              state.searchText=selectedKeys[0];
              state.searchedColumn=dataIndex;
            }}
          >
            Lọc
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
        record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
        onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current.focus(), 100);
      }
    },
    render: record =>
        state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[state.searchText]}
          autoEscape
          textToHighlight={record[dataIndex] ? record[dataIndex].toString() : ''}
        />
      ) : (
        record[dataIndex]
      ),
  });

const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    state.searchText=selectedKeys[0];
    state.searchedColumn=dataIndex;
  };

const handleReset = clearFilters => {
    clearFilters();
    state.searchText="";
  };