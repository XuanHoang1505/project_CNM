import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import ProductService from "@/services/site/ProductService";
import ReviewService from "@/services/site/ReviewService";

function WriteComment({ productSlug: propSlug }) {
  const [selectedTab, setSelectedTab] = useState("reviews");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const productSlug = propSlug || routeSlug;

  const faqs = [
    {
      id: 1,
      question: "What materials is this t-shirt made from?",
      answer:
        "This t-shirt is crafted from 100% premium cotton, ensuring maximum comfort and breathability. The fabric is pre-shrunk and maintains its shape and softness even after multiple washes.",
    },
    {
      id: 2,
      question: "How should I care for this t-shirt?",
      answer:
        "For best results, machine wash cold with similar colors. Tumble dry on low heat or hang dry. Avoid using bleach or harsh detergents. Iron on low heat if needed, avoiding direct contact with the printed design.",
    },
    {
      id: 3,
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for all unworn items with original tags attached. If you're not completely satisfied with your purchase, you can return it for a full refund or exchange. Return shipping costs are covered for defective items.",
    },
    {
      id: 4,
      question: "How does the sizing run?",
      answer:
        "Our t-shirts run true to size. We recommend ordering your regular size for a comfortable fit. If you prefer a looser fit, consider sizing up. Check our detailed size chart for specific measurements.",
    },
    {
      id: 5,
      question: "How long does shipping take?",
      answer:
        "Standard shipping typically takes 5-7 business days. Express shipping (2-3 business days) is also available at checkout. International orders may take 10-15 business days depending on your location.",
    },
    {
      id: 6,
      question: "Is the design print durable?",
      answer:
        "Yes! We use high-quality screen printing techniques that ensure the design remains vibrant and intact even after many washes. The print is tested for durability and colorfastness.",
    },
  ];

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await ProductService.getProductBySlug(productSlug);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải thông tin sản phẩm");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (propSlug) {
      fetchProduct();
    }
  }, [propSlug]);

  // Fetch reviews when product is loaded
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?.data?.id) return;
      try {
        setReviewsLoading(true);
        const res = await ProductService.getProductBySlug(productSlug);
        const productId = res.data?.id;
        const response = await ReviewService.getReviewsByProduct(productId);
        if (response?.success && response?.data) {
          const transformedReviews = response.data.map((review) => ({
            id: review.id,
            name: review.user?.name || "Anonymous",
            avatar: review.user?.avatar,
            rating: parseInt(review.rating) || 0,
            comment: review.content,
            images: review.images || [],
            date: (() => {
              if (!review.created_at) return "Posted on Unknown date";
              const [datePart, timePart] = review.created_at.split(" ");
              return `Posted on ${timePart} ${datePart}`;
            })(),
            verified: true,
          }));
          setReviews(transformedReviews);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [product]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={`full-${i}`}
          className="w-5 h-5 fill-yellow-400"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-5 h-5" viewBox="0 0 20 20">
          <defs>
            <linearGradient id={`half-gradient-${rating}`}>
              <stop offset="50%" stopColor="#FACC15" />
              <stop offset="50%" stopColor="#E5E7EB" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#half-gradient-${rating})`}
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
          />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-5 h-5 fill-gray-300"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">
              Đang tải thông tin sản phẩm...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center bg-red-50 border border-red-200 rounded-2xl p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-600 font-semibold mb-2">
              {error || "Không tìm thấy sản phẩm"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex items-center justify-center border-b-2 border-gray-200 mb-8">
        <button
          onClick={() => setSelectedTab("details")}
          className={`px-8 py-4 font-semibold transition-all relative ${
            selectedTab === "details"
              ? "text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Product Details
          {selectedTab === "details" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
          )}
        </button>
        <button
          onClick={() => setSelectedTab("reviews")}
          className={`px-8 py-4 font-semibold transition-all relative ${
            selectedTab === "reviews"
              ? "text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Reviews & Ratings
          {selectedTab === "reviews" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
          )}
        </button>
        <button
          onClick={() => setSelectedTab("faqs")}
          className={`px-8 py-4 font-semibold transition-all relative ${
            selectedTab === "faqs"
              ? "text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          FAQs
          {selectedTab === "faqs" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
          )}
        </button>
      </div>

      {/* Product Details Tab */}
      {selectedTab === "details" && (
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Information
            </h2>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full"></span>
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-pink-400 to-red-500 rounded-full"></span>
                  Specifications
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-xl p-4 hover:border-gray-300 transition-all">
                    <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                      Material
                    </p>
                    <p className="font-bold text-gray-900">
                      {product.material || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-xl p-4 hover:border-gray-300 transition-all">
                    <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                      Brand
                    </p>
                    <p className="font-bold text-gray-900">
                      {product.brand?.name || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-xl p-4 hover:border-gray-300 transition-all">
                    <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                      Category
                    </p>
                    <p className="font-bold text-gray-900">
                      {product.category?.name || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-xl p-4 hover:border-gray-300 transition-all">
                    <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                      Style
                    </p>
                    <p className="font-bold text-gray-900">
                      {product.dressStyle?.name || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-xl p-4 hover:border-gray-300 transition-all">
                    <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                      Care Instructions
                    </p>
                    <p className="font-bold text-gray-900 text-sm">
                      {product.care_instructions || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {product.dimensions && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-indigo-400 to-blue-500 rounded-full"></span>
                    Kích thước
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">
                        Chiều dài
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        {product.dimensions.length}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">
                        Ngực
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        {product.dimensions.chest}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">
                        Vai
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        {product.dimensions.shoulder}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {product.variants && product.variants.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></span>
                    Các biến thể có sẵn
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {product.variants.map((variant, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-3 hover:border-gray-400 transition-all"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm uppercase">
                            {variant.size}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              variant.stock > 10
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {variant.stock} sẵn
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 capitalize">
                          {variant.color}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Tab - CHỈ HIỂN THỊ */}
      {selectedTab === "reviews" && (
        <>
          {/* Reviews List Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
              Reviews ({reviews.length})
            </h2>
          </div>

          {/* Reviews List */}
          <div className="space-y-4 max-w-4xl mx-auto mb-12">
            {reviewsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-center">
                  <div className="relative w-12 h-12 mx-auto mb-3">
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-black rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-700 font-semibold text-sm">
                    Loading reviews...
                  </p>
                </div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-10 text-center border border-gray-200 shadow-sm">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-xl overflow-hidden shadow-md">
                          {review.avatar ? (
                            <img
                              src={review.avatar}
                              alt={review.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-black flex items-center justify-center text-white font-bold text-lg">
                              {review.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        {review.verified && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                            <Check
                              className="w-3 h-3 text-white"
                              strokeWidth={3}
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{review.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-gray-300">•</span>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                      </div>
                    </div>
                    {review.verified && (
                      <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 whitespace-nowrap">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        Verified
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm mb-3">
                    {review.comment}
                  </p>
                  {review.images && review.images.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                      {review.images.map((img, index) => (
                        <div
                          key={index}
                          className="relative aspect-square group overflow-hidden rounded-xl cursor-pointer"
                        >
                          <img
                            src={img}
                            alt={`Review ${index + 1}`}
                            className="w-full h-full object-cover border border-gray-200 group-hover:border-black transition-all group-hover:scale-110 rounded-xl"
                            onClick={() => window.open(img, "_blank")}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* FAQs Tab */}
      {selectedTab === "faqs" && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all hover:shadow-md"
              >
                <button
                  onClick={() =>
                    setOpenFaqIndex(openFaqIndex === faq.id ? null : faq.id)
                  }
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                      openFaqIndex === faq.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFaqIndex === faq.id && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WriteComment;
