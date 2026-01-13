import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Spin, Pagination, Rate, Empty } from "antd";
import { Search, X, ShoppingCart } from "lucide-react";
import ProductService from "@/services/site/ProductService";

function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || searchParams.get('keyword') || '';
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });

  // Tự động search khi có query từ URL
  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
      searchProducts(queryParam, 1);
    }
  }, [queryParam]);

  // Search products
  const searchProducts = async (query, page = 1) => {
    if (!query.trim()) {
      setProducts([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const result = await ProductService.searchProducts(
        query,
        page,
        pagination.pageSize
      );

      setProducts(result.data || []);
      setPagination((prev) => ({
        ...prev,
        current: result.current,
        total: result.total || 0,
      }));
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update URL với query parameter
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setPagination((prev) => ({ ...prev, current: 1 }));
      searchProducts(searchQuery, 1);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setProducts([]);
    setHasSearched(false);
    navigate('/search'); // Clear URL params
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize,
    }));
    searchProducts(searchQuery, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  };

  const calculateDiscount = (originalPrice, price) => {
    if (!originalPrice || originalPrice <= price) return null;
    const discount = ((originalPrice - price) / originalPrice) * 100;
    return `-${Math.round(discount)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search Section */}
      <div className="bg-white  shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="flex-1 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(e);
                    }
                  }}
                  placeholder="Search for products..."
                  className="w-full pl-12 pr-12 py-3 border-2 rounded-full focus:outline-none focus:border-black transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
                className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Search
              </button>
            </div>

            {/* Search Info */}
            {hasSearched && !loading && (
              <div className="text-gray-600 whitespace-nowrap">
                {products.length > 0 ? (
                  <span>
                    <strong className="text-black">{pagination.total}</strong> results
                  </span>
                ) : (
                  <span className="text-red-600">No results</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {hasSearched ? (
          <Spin spinning={loading}>
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="group cursor-pointer bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                      onClick={() => navigate(`/product/${product.slug}`)}
                    >
                      <div className="aspect-square bg-gray-100 overflow-hidden">
                        <img
                          src={product.main_image || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <Rate disabled defaultValue={5} className="text-xs" />
                          <span className="text-xs text-gray-600">5/5</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-lg">
                            {formatNumber(product.price)}
                          </span>
                          {product.compare_price && (
                            <>
                              <span className="text-gray-400 line-through text-sm">
                                {formatNumber(product.compare_price)}
                              </span>
                              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-semibold">
                                {calculateDiscount(
                                  product.compare_price,
                                  product.price
                                )}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center">
                  <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={handlePaginationChange}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total) => `Total ${total} products`}
                    pageSizeOptions={["12", "24", "36", "48"]}
                  />
                </div>
              </>
            ) : (
              !loading && (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className="text-center py-12">
                      <p className="text-xl font-semibold text-gray-600 mb-2">
                        No products found for "{searchQuery}"
                      </p>
                      <p className="text-gray-500 mb-6">
                        Try different keywords or browse our collection
                      </p>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={clearSearch}
                          className="border-2 border-black text-black px-6 py-3 rounded-full font-semibold hover:bg-black hover:text-white transition-colors"
                        >
                          Clear Search
                        </button>
                        <button
                          onClick={() => navigate("/shop")}
                          className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                        >
                          Browse All Products
                        </button>
                      </div>
                    </div>
                  }
                />
              )
            )}
          </Spin>
        ) : (
          // Empty State - No Search Yet
          <div className="text-center py-20">
            <div className="mb-8">
              <Search className="w-24 h-24 mx-auto text-gray-300 mb-6" />
              <h2 className="text-3xl font-bold text-gray-700 mb-3">
                What are you looking for?
              </h2>
              <p className="text-gray-500 text-lg">
                Enter a product name or keyword to start searching
              </p>
            </div>

            {/* Quick Search Suggestions */}
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["T-shirt", "Jeans", "Hoodie", "Dress", "Sneakers"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        navigate(`/search?q=${encodeURIComponent(term)}`);
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-black hover:text-white rounded-full text-sm transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="mt-12">
              <button
                onClick={() => navigate("/shop")}
                className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                Or Browse All Products
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;