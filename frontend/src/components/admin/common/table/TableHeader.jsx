
import { Input, Button, Dropdown, Checkbox } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  SettingOutlined,
  ColumnHeightOutlined,
} from "@ant-design/icons";

const TableHeader = ({
  handleReset,
  onSetting,
  searchTerm,
  setSearchTerm,
  handleRenderBtn,
  handleShowModal,
  onCreateProduct,
  columns,
  handleColumnToggle,
  visibleColumns,
}) => {
  const menuItems = columns.map((column) => ({
    key: column.key,
    label: (
      <Checkbox
        checked={visibleColumns.includes(column.key)}
        onChange={() => handleColumnToggle(column.key)}
      >
        {column.label}
      </Checkbox>
    ),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
      <div className="lg:col-span-8 col-span-1">
        <Input
          placeholder="Tìm kiếm"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="large"
        />
      </div>
      <div className="lg:col-span-4 col-span-1 flex justify-start lg:justify-end gap-2">
        {handleRenderBtn().btnSetting && (
          <Button
            type="primary"
            icon={<SettingOutlined />}
            onClick={onSetting}
            style={{ backgroundColor: "#22c55e" }}
          >
            Cài đặt
          </Button>
        )}
        {handleRenderBtn().btnAdd && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              handleReset();
              handleShowModal();
              onCreateProduct();
            }}
          >
            Thêm
          </Button>
        )}
        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          <Button icon={<ColumnHeightOutlined />} />
        </Dropdown>
      </div>
    </div>
  );
};

export default TableHeader;