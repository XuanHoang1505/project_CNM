import { Select, Pagination } from "antd";
const { Option } = Select;

export const TableFooter = ({
  handleItemsPerPageChange,
  itemsPerPage,
  handlePageChange,
  currentPage,
  // totalPages,
  total,
}) => {
  return (
    <div className="box__control flex flex-col md:flex-row justify-center md:justify-between items-center mt-4 light__text gap-4">
      <div className="flex items-center gap-2">
        <span>Xem</span>
        <Select
          value={itemsPerPage}
          onChange={(value) => handleItemsPerPageChange({ target: { value } })}
          className="w-20"
        >
          <Option value="10">10</Option>
          <Option value="25">25</Option>
          <Option value="50">50</Option>
          <Option value="100">100</Option>
        </Select>
        <span>mục</span>
      </div>

      <Pagination
        current={currentPage}
        total={total}
        pageSize={itemsPerPage}
        onChange={handlePageChange}
        showSizeChanger={false}
        showQuickJumper
      />
    </div>
  );
};

export default TableFooter;