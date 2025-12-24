import { useState, useEffect } from 'react';
import { Check, X, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ProductService from '@/services/site/ProductService';
import ReviewService from '@/services/site/ReviewService';

function WriteCommentOrder() {
    const navigate = useNavigate();
    const { slug } = useParams();
    const location = useLocation();
    const { orderId } = location.state || {};

    const [hoverRating, setHoverRating] = useState(0);
    const [rating, setRating] = useState(0);
    const [reviewName, setReviewName] = useState('');
    const [reviewContent, setReviewContent] = useState('');
    const [reviewImages, setReviewImages] = useState([]);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [userName, setUserName] = useState('');




    // Lấy thông tin user từ localStorage
    useEffect(() => {
        const userDetail = localStorage.getItem('userDetail');
        if (userDetail) {
            try {
                const user = JSON.parse(userDetail);
                setUserName(user.fullName || 'Người dùng');
            } catch (err) {
                console.error('Error parsing userDetail:', err);
                setUserName('Người dùng');
            }
        } else {
            setUserName('Người dùng');
        }
    }, []);

    

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) {
                setError('Không tìm thấy sản phẩm');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await ProductService.getProductBySlug(slug);
                setProduct(data);
                setError(null);
            } catch (err) {
                setError('Không thể tải thông tin sản phẩm');
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (reviewContent.trim().length < 20) {
            alert("Nội dung đánh giá phải có ít nhất 20 ký tự.");
            return;
        }

        if (rating === 0) {
            alert("Vui lòng chọn số sao đánh giá.");
            return;
        }

        try {
            setSubmitting(true);

            // Lấy product id từ state đã có (không cần fetch lại)
            const productId = product.data?.id;
            if (!productId) {
                alert("Không tìm thấy sản phẩm, vui lòng thử lại!");
                return;
            }

            const user = JSON.parse(localStorage.getItem('userDetail'));
            // Build FormData
            const formData = new FormData();

            formData.append("rating", rating);
            formData.append("content", reviewContent);
            formData.append("user_id", user.userId);  // TODO: replace with real user
            formData.append("product_id", productId);
            formData.append("order_id", orderId);

            reviewImages.forEach(img => {
                formData.append("images[]", img.file);
            });

            // Submit API
            const result = await ReviewService.createReview(formData);

            if (!result?.success) {
                alert(result?.message || "Gửi đánh giá thất bại, vui lòng thử lại.");
                return;
            }

            // Reset form
            setReviewContent("");
            setRating(0);
            setHoverRating(0);
            setReviewImages([]);

            // Toast notification
            setShowSuccessToast(true);
            window.scrollTo({ top: 0, behavior: "smooth" });

            // Redirect về trang sản phẩm sau 2 giây
            setTimeout(() => {
                navigate(`/product/${slug}`);
            }, 2000);

        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Có lỗi xảy ra khi gửi đánh giá, vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    const getRatingEmoji = (stars) => {
        if (stars === 5) return { emoji: '⭐', text: 'Tuyệt vời!', color: 'text-yellow-600' };
        if (stars === 4) return { emoji: '😊', text: 'Rất tốt!', color: 'text-green-600' };
        if (stars === 3) return { emoji: '👍', text: 'Ổn!', color: 'text-blue-600' };
        if (stars === 2) return { emoji: '😐', text: 'Được!', color: 'text-orange-600' };
        return { emoji: '😞', text: 'Cần cải thiện', color: 'text-red-600' };
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setReviewImages(prev => [...prev, ...newImages]);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 font-semibold">Đang tải thông tin sản phẩm...</p>
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
                        <p className="text-red-600 font-semibold mb-2">{error || 'Không tìm thấy sản phẩm'}</p>
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
            {showSuccessToast && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <p className="font-semibold">Thành công!</p>
                            <p className="text-sm">Cảm ơn bạn đã gửi đánh giá</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Quay lại</span>
                </button>
            </div>

            <div className="max-w-4xl mx-auto mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-4">
                        {product.data?.images?.[0] && (
                            <img
                                src={product.data.images[0]}
                                alt={product.data.name}
                                className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200"
                            />
                        )}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{product.data?.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">Đánh giá cho sản phẩm này</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">Viết đánh giá của bạn</h2>
                    <p className="text-gray-500 text-center mb-8">Chia sẻ trải nghiệm của bạn về sản phẩm này</p>

                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tên của bạn <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={userName}
                                    readOnly
                                    className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-sm cursor-not-allowed text-gray-600"
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Đánh giá của bạn <span className="text-red-500">*</span>
                                </label>

                                <div className="bg-gray-50 rounded-xl py-3 px-4 border border-gray-300">
                                    <div className="flex items-center space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="focus:outline-none transition-transform hover:scale-125"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill={(hoverRating || rating) >= star ? '#FACC15' : '#D1D5DB'}
                                                    className="w-8 h-8"
                                                >
                                                    <path d="M12 .587l3.668 7.568L24 9.748l-6 5.84 1.417 8.251L12 19.771l-7.417 4.068L6 15.588 0 9.748l8.332-1.593z" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>

                                    {rating > 0 && (
                                        <p className={`mt-2 text-sm font-medium flex items-center gap-1 ${getRatingEmoji(rating).color}`}>
                                            <span>{getRatingEmoji(rating).emoji}</span>
                                            {getRatingEmoji(rating).text}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nội dung đánh giá <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows="5"
                                value={reviewContent}
                                onChange={(e) => setReviewContent(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-black focus:ring-2 focus:ring-gray-200 resize-none"
                                placeholder="Chia sẻ suy nghĩ của bạn về sản phẩm này (tối thiểu 20 ký tự)..."
                            ></textarea>

                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-gray-500">{reviewContent.length}/20 ký tự</p>
                                {reviewContent.length >= 20 && (
                                    <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                                        <Check className="w-4 h-4" />
                                        Đủ ký tự
                                    </span>
                                )}
                            </div>

                            <div className="mt-3">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tải ảnh lên (không bắt buộc)
                                </label>

                                <input
                                    id="reviewImagesInput"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    name="images[]"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('reviewImagesInput').click()}
                                    className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors shadow"
                                >
                                    Tải ảnh lên
                                </button>

                                {reviewImages.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                                        {reviewImages.map((img, index) => (
                                            <div key={index} className="relative group aspect-square">
                                                <img
                                                    src={img.url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover rounded-xl border-2 border-gray-300"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        URL.revokeObjectURL(img.url);
                                                        setReviewImages((prev) => prev.filter((_, i) => i !== index));
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-lg hover:bg-red-600 transition-all"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmitReview}
                            disabled={submitting}
                            className="w-full py-3.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Đang gửi...</span>
                                </>
                            ) : (
                                'Gửi đánh giá'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WriteCommentOrder;