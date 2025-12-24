import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function VNPayReturn() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('');
    const [orderInfo, setOrderInfo] = useState(null);

    useEffect(() => {
        const processPayment = async () => {
            // Lấy tất cả params từ URL
            const params = {};
            for (let [key, value] of searchParams.entries()) {
                params[key] = value;
            }

            try {
                // Gọi API backend để xác thực và cập nhật đơn hàng
                const response = await fetch(
                    `http://127.0.0.1:8000/api/vnpay-return?${searchParams.toString()}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );

                const data = await response.json();

                if (data.code === '00') {
                    // Thanh toán thành công
                    setStatus('success');
                    setMessage('Thanh toán thành công!');
                    setOrderInfo(data.order);

                    // Xóa giỏ hàng và các thông tin tạm
                    localStorage.removeItem('cart');
                    localStorage.removeItem('appliedDiscount');
                    localStorage.removeItem('discountAmount');
                    localStorage.removeItem('current_order_code');
                    localStorage.removeItem('current_order_id');

                    // Chuyển về trang chủ sau 3 giây
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                } else {
                    // Thanh toán thất bại
                    setStatus('failed');
                    setMessage(data.message || 'Thanh toán thất bại!');
                }
            } catch (error) {
                console.error('Error processing payment:', error);
                setStatus('failed');
                setMessage('Có lỗi xảy ra khi xử lý thanh toán!');
            }
        };

        processPayment();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                {status === 'processing' && (
                    <div className="text-center">
                        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Đang xử lý...</h2>
                        <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">
                            Thanh toán thành công!
                        </h2>
                        <p className="text-gray-600 mb-4">{message}</p>

                        {orderInfo && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600">Mã đơn hàng:</span>
                                    <span className="font-semibold">{orderInfo.order_code}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600">Tổng tiền:</span>
                                    <span className="font-semibold text-green-600">
                                        {new Intl.NumberFormat('vi-VN').format(orderInfo.total)} đ
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Trạng thái:</span>
                                    <span className="font-semibold text-green-600">Đã thanh toán</span>
                                </div>
                            </div>
                        )}

                        <p className="text-sm text-gray-500">
                            Đang chuyển hướng về trang chủ...
                        </p>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-red-600 mb-2">
                            Thanh toán thất bại!
                        </h2>
                        <p className="text-gray-600 mb-6">{message}</p>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Thử lại
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VNPayReturn;