import TableManagement from "@/components/admin/common/table/TableManagement";
import Page500 from "@/pages/page500/Page500";
import ProductService from "@/services/site/ProductService";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductManagement = () => {
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorServer, setErrorServer] = useState(null);
  const navigate = useNavigate();

  const productColumns = [
    { key: "id", label: "ID" },
    { key: "thumbnail", label: "Thumbnail"},
    { key: "name", label: "Tên sản phẩm" },
    { key: "slug", label: "Slug" },
    { key: "description", label: "Mô tả" },
    { key: "price", label: "Giá" },
    { key: "stock", label: "Tồn kho" },
    { key: "is_active", label: "Trạng thái" },
  ];

  const keysToRemove = ["slug", "id", "category", "description"];
  const defaultColumns = productColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  const buttons = {
    btnAdd: true,
    btnEdit: true,
    btnDelete: true,
    btnDetail: true,
    btnSetting: false,
  };

  const fetchProducts = async () => {
    setLoadingPage(true);
    try {
      const data = await ProductService.getProducts();
      const formatData = (data.data || []).map((item) => ({
        ...item,
        stock:
          item.variants?.reduce(
            (total, v) => total + (Number(v.stock) || 0),
            0
          ) ?? 0,
      }));
      setProductData(formatData);
    } catch (error) {
      setErrorServer(
        error.message || "An error occurred while fetching products."
      );
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (slug) => {
    navigate(`/admin/product/${slug}`, {
      state: {
        initEditMode: true,
      },
    });
  };

  const handleCreateProduct = () => {
    navigate("/admin/product/create");
  };

  const handleViewDetail = (slug) => {
    navigate(`/admin/product/${slug}`, {
      state: {
        initEditMode: false,
      },
    });
  };

  const handleDelete = async (id) => {
    if (!id) return;
    setIsLoading(true);
    try {
      await ProductService.deleteProduct(id);
      setProductData((prev) => prev.filter((a) => a.id !== id));
      toast.success("Xóa sản phẩm thành công!");
    } catch (error) {
      const msg = error?.response?.data?.message || "Xóa sản phẩm thất bại.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {loadingPage ? (
        <div className="w-full h-full flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="m-0 p-0">
          <TableManagement
            columns={productColumns}
            data={productData}
            title={"Quản lý sản phẩm"}
            defaultColumns={defaultColumns}
            onEditProduct={handleEdit}
            onDelete={handleDelete}
            onViewDetailProduct={handleViewDetail}
            onCreateProduct={handleCreateProduct}
            buttonCustom={buttons}
            isLoading={isLoading}
          />
        </section>
      )}
    </>
  );
};
export default ProductManagement;
