
import { Fragment } from "react";
import { Button } from "antd";
import {
  CloseCircleOutlined,
  CheckCircleOutlined,
  DownOutlined,
  UpOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined 
} from "@ant-design/icons";

const TableBody = ({
  columns,
  visibleColumns,
  handleSort,
  sortConfig,
  currentData,
  handleRowToggle,
  renderCustomCell,
  expandedRows,
  handleRenderBtn,
  onEdit,
  onEditProduct,
  onViewDetailProduct,
  handleShowModal,
  handleShowConfirmModal,
  handleShowApproveModal,
  handleShowRejectModal,
  onViewDetail,
}) => {
  return (
    <div className="table__wrapper row m-0">
      <div className="light__text overflow-x-auto col-12 p-0 custom-scrollbar">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns
                .filter((col) => visibleColumns.includes(col.key))
                .map((column) => (
                  <th
                    key={column.key}
                    onClick={() => handleSort(column.key)}
                    className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      <span className="icon_sort light__text flex flex-col">
                        <i
                          className={`bi bi-arrow-up text-xs -mb-1 ${
                            sortConfig.key === column.key &&
                            sortConfig.direction === "asc"
                              ? "text-black"
                              : "opacity-50"
                          }`}
                        ></i>
                        <i
                          className={`bi bi-arrow-down text-xs ${
                            sortConfig.key === column.key &&
                            sortConfig.direction === "desc"
                              ? "text-black"
                              : "opacity-50"
                          }`}
                        ></i>
                      </span>
                    </div>
                  </th>
                ))}
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <Fragment key={item.id}>
                <tr
                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRowToggle(item.id)}
                >
                  {columns
                    .filter((col) => visibleColumns.includes(col.key))
                    .map((column) => (
                      <td key={column.key} className="px-4 py-3 align-middle">
                        {renderCustomCell(column, item)}
                      </td>
                    ))}
                  <td className="px-4 py-3 align-middle text-right">
                    <Button
                      type="text"
                      icon={
                        expandedRows.includes(item.id) ? (
                          <UpOutlined />
                        ) : (
                          <DownOutlined />
                        )
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowToggle(item.id);
                      }}
                      className="btn__show"
                    />
                  </td>
                </tr>
                {expandedRows.includes(item.id) && (
                  <tr key={item.id + "-expanded"} className="expand-row bg-gray-50">
                    <td colSpan={columns.length + 1} className="px-4 py-3">
                      <div className="collapse-content">
                        <ul className="px-2 m-0 list-none space-y-2">
                          {columns
                            .filter(
                              (column) => !visibleColumns.includes(column.key)
                            )
                            .map((column) => (
                              <li
                                key={column.key}
                                className="py-2 w-3/4 m-0 truncate flex items-start"
                              >
                                <strong className="mr-3 p-0 min-w-32">
                                  {column.label}:
                                </strong>
                                <span className="p-0 flex-1">
                                  {renderCustomCell(column, item)}
                                </span>
                              </li>
                            ))}
                          <li className="flex gap-2 mt-4 flex-wrap">
                            {handleRenderBtn().btnEdit && (
                              <Button
                                icon={<EditOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(item);
                                  onEditProduct(item.slug);
                                  handleShowModal();
                                }}
                                className="btn__edit"
                              >
                                Chỉnh sửa
                              </Button>
                            )}
                            {handleRenderBtn().btnDelete && (
                              <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShowConfirmModal(item.id);
                                }}
                                className="btn__delete"
                              >
                                Xóa
                              </Button>
                            )}
                            {handleRenderBtn().btnDetail && (
                              <Button
                                icon={<FileTextOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewDetailProduct(item.slug);
                                  onViewDetail(item);
                                }}
                                className="btn__detail"
                              >
                                Xem chi tiết
                              </Button>
                            )}
                            {handleRenderBtn().btnReject && (
                              <Button
                                danger
                                icon={<CloseCircleOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShowRejectModal(item.id);
                                }}
                                className="btn__reject"
                              >
                                Từ chối
                              </Button>
                            )}
                            {handleRenderBtn().btnApprove && (
                              <Button
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShowApproveModal(item.id);
                                }}
                                style={{ backgroundColor: "#22c55e" }}
                                className="btn__approve"
                              >
                                Duyệt bài
                              </Button>
                            )}
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        {currentData.length === 0 && (
          <div className="text-gray-500 whitespace-nowrap flex justify-center mt-4 p-4">
            Chưa có bản ghi nào!
          </div>
        )}
      </div>
    </div>
  );
};

export default TableBody;