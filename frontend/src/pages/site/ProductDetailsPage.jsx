import { useParams } from "react-router-dom";
import ProductDetail from "@/components/site/productDetail/ProductDetail";
import WriteComment from "@/components/site/writeComment/WriteComment";
import WriteCommentOrder from "@/components/site/writeComment_true/WriteCommentOrder";

function ProductDetailsPage() {
    const { slug } = useParams(); // Lấy id từ URL, ví dụ /product/66f90a9e8b9d1e123456abcd

    return (
        <div>
            <ProductDetail productSlug={slug} />  {/* Truyền id xuống */}
            <WriteComment productSlug={slug} />
        </div>
    );
}

export default ProductDetailsPage;
