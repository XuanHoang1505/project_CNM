import { useState } from "react";
import { Button, Modal, Spin } from "antd";
import {
  CloseCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SafetyOutlined,
  ManOutlined,
  WomanOutlined,
  UserOutlined,
} from "@ant-design/icons";

import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TableFooter from "./TableFooter";
import defaultAvatar from "@/assets/site/images/avatar-default-lg.png";

import "@/css/table-management.css";

const TableManagement = ({
  data,
  columns,
  title,
  defaultColumns,
  modalContent,
  statusFunction,
  handleReset = () => {},
  onEdit = () => {},
  onViewDetail = () => {},
  onViewDetailProduct = () => {},
  onCreateProduct = () => {},
  handleSaveItem,
  onDelete,
  onSetting,
  isLoading,
  buttonCustom,
  onResetStatus,
  onReject,
  onApprove,
  onEditProduct = () => {},
}) => {
  const [visibleColumns, setVisibleColumns] = useState(
    defaultColumns.map((col) => col.key)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [expandedRows, setExpandedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showModalImage, setShowModalImage] = useState(false);
  const [showModalVideo, setShowModalVideo] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [articleId, setArticleId] = useState(null);

  const handleRenderBtn = () => {
    const defaultButtonConfig = {
      btnAdd: true,
      btnEdit: true,
      btnDelete: true,
      btnDetail: false,
      btnSetting: true,
      btnReject: false,
      btnApprove: false,
    };
    return buttonCustom ?? defaultButtonConfig;
  };

  // Render custom cell - sử dụng logic từ code gốc của bạn
  const renderCustomCell = (column, item) => {
    switch (column.key) {
      case "status": {
        const statusStyles = {
          ACTIVE:
            "px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800",
          PUBLISHED:
            "px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800",
          REJECTED:
            "px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800",
          DISABLED:
            "px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800",
          INACTIVE:
            "px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800",
          PENDING:
            "px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800",
          COMPLETED:
            "px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800",
          EXPIRED:
            "px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800",
        };

        const statusText = {
          ACTIVE: "Hoạt động",
          PUBLISHED: "Đã xuất bản",
          REJECTED: "Đã từ chối",
          DISABLED: "Vô hiệu hóa",
          INACTIVE: "Vô hiệu hóa",
          PENDING: "Đang chờ duyệt",
          COMPLETED: "Hoàn thành",
          EXPIRED: "Đã hết hạn",
        };

        return (
          <span
            className={
              statusStyles[item.status] ||
              "px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800"
            }
          >
            {statusText[item.status] || "Không xác định"}
          </span>
        );
      }
      case "is_active": {
        const isActive = item.is_active;

        return (
          <span
            className={
              isActive
                ? "px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800"
                : "px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800"
            }
          >
            {isActive ? "Hiển thị" : "Ẩn"}
          </span>
        );
      }

      case "order_status":
        return (
          <span
            className={
              item.order_status === "completed"
                ? "px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800"
                : item.order_status === "canceled"
                ? "px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800"
                : item.order_status === "confirmed"
                ? "px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800"
                : item.order_status === "pending"
                ? "px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800"
                : "px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800"
            }
          >
            {item.order_status === "completed"
              ? "Hoàn thành"
              : item.order_status === "confirmed"
              ? "Đã xác nhận"
              : item.order_status === "canceled"
              ? "Đã hủy"
              : item.order_status === "pending"
              ? "Đang xử lý"
              : "Chưa xử lý"}
          </span>
        );

      case "payment_status":
        return (
          <span
            className={
              item.payment_status === "paid"
                ? "px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800"
                : "px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800"
            }
          >
            {item.payment_status === "paid"
              ? "Đã thanh toán"
              : "Chưa thanh toán"}
          </span>
        );

      case "avatar":
        return (
          <img
            src={item.avatar || defaultAvatar}
            alt={item.name || "Avatar"}
            className="w-11 h-11 object-cover rounded-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleImageClick(item.avatar);
            }}
          />
        );
      case "thumbnail":
        return (
          <img
            src={item.thumbnail || "https://via.placeholder.com/45"}
            alt={item.name || ""}
            className="w-11 h-11 object-cover rounded-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleImageClick(item.thumbnail);
            }}
          />
        );

      case "poster": {
        // Thêm {} cho mỗi case có khai báo
        return (
          <img
            src={item[column.key] || "https://via.placeholder.com/45"}
            alt={item.name || item.title || "Ảnh"}
            className="w-11 h-11 object-cover rounded-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleImageClick(item[column.key]);
            }}
          />
        );
      }
      case "rating":
        // eslint-disable-next-line no-case-declarations
        const stars = [];

        for (let i = 1; i <= 5; i++) {
          if (i <= Math.floor(item.rating)) {
            stars.push(
              <i
                key={i}
                className="bi bi-star-fill text-warning me-1"
                style={{ fontSize: "15px" }}
              />
            );
          } else if (i === Math.ceil(item.rating) && item.rating % 1 !== 0) {
            stars.push(
              <i
                key={i}
                className="bi bi-star-half text-warning me-1"
                style={{ fontSize: "15px" }}
              />
            );
          } else {
            stars.push(
              <i
                key={i}
                className="bi bi-star text-warning me-1"
                style={{ fontSize: "15px" }}
              />
            );
          }
        }
        return <div>{stars}</div>;
      case "gender":
        return (
          <span className={`rounded-3 px-1 py-1 `}>
            {item.gender === "" || item.gender === null ? (
              <span className="text-gray-400 italic">Chưa có</span>
            ) : item.gender === "1" ? (
              <>
                <ManOutlined /> Nam
              </>
            ) : (
              <>
                <WomanOutlined /> Nữ
              </>
            )}
          </span>
        );
      case "role":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium">
            {item.role === "ADMIN" ? (
              <>
                <SafetyOutlined className="text-blue-600" />
                <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                  Quản Lý
                </span>
              </>
            ) : (
              <>
                <UserOutlined className="text-green-600" />
                <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                  Khách Hàng
                </span>
              </>
            )}
          </span>
        );
      default:
        return item[column.key] || (item[column.key] === 0 ? 0 : "---");
    }
  };

  // Sorting and filtering logic
  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.key) {
      let compareA = a[sortConfig.key];
      let compareB = b[sortConfig.key];
      if (typeof compareA === "string") compareA = compareA.toLowerCase();
      if (typeof compareB === "string") compareB = compareB.toLowerCase();
      return sortConfig.direction === "asc"
        ? compareA > compareB
          ? 1
          : -1
        : compareA < compareB
        ? 1
        : -1;
    }
    return 0;
  });

  const filteredData = sortedData.filter((item) =>
    visibleColumns.some((key) =>
      item[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const handleColumnToggle = (key) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleRowToggle = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Modal handlers
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    if (onResetStatus) onResetStatus();
    setShowModal(false);
  };

  const handleSubmit = async () => {
    if (handleSaveItem && (await handleSaveItem())) {
      handleCloseModal();
    }
  };

  const handleShowConfirmModal = (id) => {
    setDeleteId(id);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setDeleteId(null);
  };

  const handleConfirmDelete = () => {
    if (deleteId && onDelete) {
      onDelete(deleteId);
      handleCloseConfirmModal();
    }
  };

  const handleShowApproveModal = (id) => {
    setArticleId(id);
    setShowApproveModal(true);
  };

  const handleCloseApproveModal = () => {
    setShowApproveModal(false);
    setArticleId(null);
  };

  const handleApprove = () => {
    if (onApprove && articleId) {
      onApprove(articleId, {});
      handleCloseApproveModal();
    }
  };

  const handleShowRejectModal = (id) => {
    setArticleId(id);
    setShowRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setArticleId(null);
  };

  const handleReject = () => {
    if (onReject && articleId) {
      onReject(articleId, "Nội dung không phù hợp");
      handleCloseRejectModal();
    }
  };

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
    setShowModalImage(true);
  };

  const handleVideoClick = (videoSrc) => {
    setSelectedVideo(videoSrc);
    setShowModalVideo(true);
  };

  return (
    <div className="table__management bg-transparent col-12 p-4 rounded-3">
      <h5 className="mb-4 text-uppercase fw-bold ">{title}</h5>

      <TableHeader
        handleReset={handleReset}
        onSetting={onSetting}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleRenderBtn={handleRenderBtn}
        handleShowModal={handleShowModal}
        onCreateProduct={onCreateProduct}
        columns={columns}
        handleColumnToggle={handleColumnToggle}
        visibleColumns={visibleColumns}
      />

      <TableBody
        columns={columns}
        currentData={currentData}
        expandedRows={expandedRows}
        handleRowToggle={handleRowToggle}
        renderCustomCell={renderCustomCell}
        visibleColumns={visibleColumns}
        handleSort={handleSort}
        sortConfig={sortConfig}
        handleRenderBtn={handleRenderBtn}
        onEdit={onEdit}
        onEditProduct={onEditProduct}
        onViewDetailProduct={onViewDetailProduct}
        handleShowModal={handleShowModal}
        handleShowConfirmModal={handleShowConfirmModal}
        handleShowApproveModal={handleShowApproveModal}
        handleShowRejectModal={handleShowRejectModal}
        onViewDetail={onViewDetail}
      />

      <TableFooter
        handleItemsPerPageChange={(e) => {
          setItemsPerPage(parseInt(e.target.value));
          setCurrentPage(1);
        }}
        itemsPerPage={itemsPerPage}
        handlePageChange={setCurrentPage}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredData.length / itemsPerPage)}
        total={filteredData.length}
      />

      {/* Modal Thêm/Sửa/Xem - Sử dụng Ant Design Modal */}
      <Modal
        open={showModal}
        onCancel={handleCloseModal}
        title={
          statusFunction?.isEditing ? (
            <span>
              CẬP NHẬT BẢN GHI{" "}
              <i className="bi bi-arrow-repeat text-green-500"></i>
            </span>
          ) : statusFunction?.isAdd ? (
            <span>
              THÊM MỚI BẢN GHI{" "}
              <i className="bi bi-plus-circle-dotted text-green-500 ml-1"></i>
            </span>
          ) : (
            <span>
              XEM CHI TIẾT <i className="bi bi-card-list ml-1"></i>
            </span>
          )
        }
        footer={
          !statusFunction?.isViewDetail
            ? [
                <Button key="cancel" onClick={handleCloseModal}>
                  Đóng
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={isLoading}
                  onClick={handleSubmit}
                >
                  Lưu
                </Button>,
              ]
            : null
        }
        width={800}
      >
        <Spin spinning={isLoading}>{modalContent}</Spin>
      </Modal>

      {/* Modal Xác nhận xóa */}
      <Modal
        open={showConfirmModal}
        onCancel={handleCloseConfirmModal}
        centered
        footer={null}
        closable={false}
      >
        <div className="flex flex-col items-center py-4">
          <ExclamationCircleOutlined className="text-red-500 text-7xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Bạn có chắc chắn?</h3>
          <p className="text-center text-gray-600 mb-6 w-3/4">
            Bạn thực sự muốn xóa bản ghi này? Quá trình này sẽ không thể hoàn
            tác.
          </p>
          <div className="flex gap-3">
            <Button size="large" onClick={handleCloseConfirmModal}>
              Hủy
            </Button>
            <Button
              size="large"
              type="primary"
              danger
              loading={isLoading}
              onClick={handleConfirmDelete}
            >
              Xóa
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Hình ảnh */}
      <Modal
        open={showModalImage}
        onCancel={() => setShowModalImage(false)}
        footer={null}
        centered
        width={450}
      >
        <img
          src={selectedImage}
          alt="Large view"
          className="w-full h-96 object-cover rounded-lg"
        />
      </Modal>

      {/* Modal Video */}
      <Modal
        open={showModalVideo}
        onCancel={() => setShowModalVideo(false)}
        footer={null}
        centered
        width={900}
      >
        <video
          src={selectedVideo}
          controls
          autoPlay
          className="w-full rounded-lg"
        />
      </Modal>

      {/* Modal Duyệt bài */}
      <Modal
        open={showApproveModal}
        onCancel={handleCloseApproveModal}
        centered
        footer={null}
        closable={false}
      >
        <div className="flex flex-col items-center py-4">
          <CheckCircleOutlined className="text-green-500 text-7xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Duyệt bài viết</h3>
          <p className="text-center text-gray-600 mb-6 w-3/4">
            Bạn có chắc chắn muốn duyệt bài viết này không?
          </p>
          <div className="flex gap-3">
            <Button size="large" onClick={handleCloseApproveModal}>
              Hủy
            </Button>
            <Button
              size="large"
              type="primary"
              loading={isLoading}
              onClick={handleApprove}
              style={{ backgroundColor: "#22c55e" }}
            >
              Duyệt
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Từ chối */}
      <Modal
        open={showRejectModal}
        onCancel={handleCloseRejectModal}
        centered
        footer={null}
        closable={false}
      >
        <div className="flex flex-col items-center py-4">
          <CloseCircleOutlined className="text-red-500 text-7xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Từ chối bài viết</h3>
          <p className="text-center text-gray-600 mb-6 w-3/4">
            Bạn có chắc chắn muốn từ chối bài viết này không?
          </p>
          <div className="flex gap-3">
            <Button size="large" onClick={handleCloseRejectModal}>
              Hủy
            </Button>
            <Button
              size="large"
              type="primary"
              danger
              loading={isLoading}
              onClick={handleReject}
            >
              Từ chối
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TableManagement;
