import React, { useState, useEffect } from 'react';
import { X, Package, Calendar, User, MapPin, CreditCard, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { MessageSquare } from 'lucide-react';
import OrderService from '@/services/site/OrderService';
import ProductService from '@/services/site/ProductService';
import { Modal } from 'antd';

function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            const userDetailStr = localStorage.getItem('userDetail');
            if (!userDetailStr) throw new Error('Không tìm thấy thông tin người dùng.');

            const userDetail = JSON.parse(userDetailStr);
            if (!userDetail.email) throw new Error('Email không hợp lệ.');

            // 🔥 Lấy dữ liệu từ API - MySQL trả về orders trực tiếp
            const response = await OrderService.getOrdersByEmail(userDetail.email);

            // 🔥 Không cần map lại vì MySQL đã trả về đúng format
            // Chỉ cần gán trực tiếp
            setOrders(response.orders || response || []);

        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message || 'Không thể tải đơn hàng.');
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('vi-VN').format(num || 0);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-purple-100 text-purple-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentMethodText = (method) => {
        const methods = {
            cod: 'Thanh toán khi nhận hàng',
            card: 'Thẻ tín dụng/Ghi nợ',
            vnpay: 'VNPAY',
            bank: 'Chuyển khoản ngân hàng'
        };
        return methods[method] || method;
    };

    const toggleOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, order_status: newStatus } : order
        ));
    };

    const filteredOrders = orders.filter(order => {
        // 🔥 FIX: order.status → order.order_status
        const matchesStatus = filterStatus === 'all' || order.order_status === filterStatus;
        const matchesSearch = searchQuery === '' ||
            order.order_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.phone.includes(searchQuery);
        return matchesStatus && matchesSearch;
    });

    const statusCounts = {
        all: orders.length,
        pending: orders.filter(o => o.order_status === 'pending').length,
        confirmed: orders.filter(o => o.order_status === 'confirmed').length,
        completed: orders.filter(o => o.order_status === 'completed').length,
        cancelled: orders.filter(o => o.order_status === 'cancelled').length
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải đơn hàng...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <Package size={48} className="mx-auto text-red-500 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Có lỗi xảy ra</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    const handleWriteComment = (order) => {
        setSelectedOrder(order);
        setSelectedProduct(null);
        setShowProductModal(true);
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
    };

    const handleConfirmSelection = async () => {
        if (!selectedProduct || !selectedOrder) return;

        try {
            const productData = await ProductService.getProductById(selectedProduct.product_id);

            if (!productData.data.slug) {
                alert('Không tìm thấy thông tin sản phẩm. Vui lòng thử lại.');
                return;
            }

            navigate(`/write-comment-order/${productData.data.slug}`, {
                state: {
                    orderId: selectedOrder?.id,
                }
            });

            setShowProductModal(false);
            setSelectedProduct(null);
            setSelectedOrder(null);
        } catch (error) {
            console.error('Error fetching product:', error);
            alert('Có lỗi xảy ra khi tải thông tin sản phẩm. Vui lòng thử lại.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold">ORDER MANAGEMENT</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package size={18} />
                        <span>{filteredOrders.length} orders</span>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white border rounded-lg p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm theo mã đơn, tên khách hàng, SĐT..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <button
                                onClick={() => setShowFilterMenu(!showFilterMenu)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Filter size={18} />
                                <span>Lọc trạng thái</span>
                                <ChevronDown size={16} />
                            </button>

                            {showFilterMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-10">
                                    {Object.entries(statusCounts).map(([status, count]) => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                setFilterStatus(status);
                                                setShowFilterMenu(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between ${filterStatus === status ? 'bg-gray-100 font-semibold' : ''
                                                }`}
                                        >
                                            <span>{status === 'all' ? 'Tất cả' : status}</span>
                                            <span className="text-gray-500 text-sm">({count})</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Status Filters */}
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {Object.entries(statusCounts).map(([status, count]) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === status
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {status === 'all' ? 'Tất cả' : status} ({count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white border rounded-lg p-12 text-center">
                            <Package size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600">Không tìm thấy đơn hàng nào</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div key={order.id} className="bg-white border rounded-lg overflow-hidden">
                                {/* Order Header */}
                                <div className="p-4 bg-gray-50 border-b">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    {/* 🔥 FIX: order.orderCode → order.order_code */}
                                                    <span className="font-bold text-lg">{order.order_code}</span>
                                                    {/* 🔥 FIX: order.status → order.order_status */}
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.order_status)}`}>
                                                        {order.order_status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar size={14} />
                                                    {/* 🔥 FIX: order.createdAt → order.created_at */}
                                                    <span>{formatDate(order.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <div className="text-sm text-gray-600">Tổng tiền</div>
                                                {/* 🔥 FIX: order.payment.amount → order.total */}
                                                <div className="font-bold text-lg">{formatNumber(order.total)} đ</div>
                                            </div>
                                            <button
                                                onClick={() => toggleOrder(order.id)}
                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                            >
                                                {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Details (Expanded) */}
                                {expandedOrder === order.id && (
                                    <div className="p-6">
                                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                                            {/* Customer Info */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <User size={18} className="text-gray-700" />
                                                    <h4 className="font-bold">Thông tin khách hàng</h4>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div>
                                                        <span className="text-gray-600">Tên:</span>{' '}
                                                        <span className="font-medium">{order.full_name}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Email:</span>{' '}
                                                        <span className="font-medium">{order.email}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">SĐT:</span>{' '}
                                                        <span className="font-medium">{order.phone}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Shipping Address */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <MapPin size={18} className="text-gray-700" />
                                                    <h4 className="font-bold">Địa chỉ giao hàng</h4>
                                                </div>
                                                <div className="text-sm">
                                                    {/* 🔥 FIX: order.address → các column riêng */}
                                                    <p className="font-medium">{order.house_number}</p>
                                                    <p className="text-gray-600">{order.ward}, {order.province}</p>
                                                    {order.note && (
                                                        <p className="text-gray-600 mt-2">
                                                            <span className="font-medium">Ghi chú:</span> {order.note}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="mb-6">
                                            <h4 className="font-bold mb-4">Sản phẩm đã đặt</h4>
                                            <div className="space-y-3">
                                                {/* 🔥 FIX: Thêm check items tồn tại */}
                                                {order.items && order.items.length > 0 ? (
                                                    order.items.map((item) => (
                                                        // 🔥 FIX: key={index} → key={item.id}
                                                        <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                                                {item.image && (
                                                                    // 🔥 FIX: item.name → item.product_name
                                                                    <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                {/* 🔥 FIX: item.name → item.product_name */}
                                                                <h5 className="font-medium">{item.product_name}</h5>
                                                                <p className="text-sm text-gray-600">
                                                                    {item.size && `Size: ${item.size}`}
                                                                    {item.color && ` • ${item.color}`}
                                                                </p>
                                                                <div className="flex justify-between items-center mt-1">
                                                                    <span className="text-sm text-gray-600">Số lượng: {item.quantity}</span>
                                                                    {/* 🔥 FIX: Dùng item.total */}
                                                                    <span className="font-semibold">
                                                                        {formatNumber(item.total || (item.price * item.quantity))} đ
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 text-sm">Không có sản phẩm</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Payment Summary */}
                                        <div className="border-t pt-4">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <CreditCard size={18} className="text-gray-700" />
                                                        <h4 className="font-bold">Thanh toán</h4>
                                                    </div>
                                                    {/* 🔥 FIX: order.payment.method → order.payment_method */}
                                                    <p className="text-sm text-gray-600">
                                                        {getPaymentMethodText(order.payment_method)}
                                                    </p>
                                                    {/* 🔥 THÊM: Hiển thị trạng thái thanh toán */}
                                                    <p className="text-sm mt-2">
                                                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${order.payment_status === 'paid'
                                                            ? 'bg-green-100 text-green-800'
                                                            : order.payment_status === 'failed'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {order.payment_status === 'paid' ? 'Đã thanh toán' :
                                                                order.payment_status === 'failed' ? 'Thanh toán thất bại' :
                                                                    'Chờ thanh toán'}
                                                        </span>
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Tạm tính:</span>
                                                        <span className="font-medium">{formatNumber(order.subtotal)} đ</span>
                                                    </div>
                                                    {order.discount > 0 && (
                                                        <div className="flex justify-between text-sm text-red-500">
                                                            <span>Giảm giá:</span>
                                                            <span className="font-medium">-{formatNumber(order.discount)} đ</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Phí vận chuyển:</span>
                                                        {/* 🔥 FIX: order.deliveryFee → order.delivery_fee */}
                                                        <span className="font-medium">{formatNumber(order.delivery_fee)} đ</span>
                                                    </div>
                                                    <div className="flex justify-between pt-2 border-t">
                                                        <span className="font-bold">Tổng cộng:</span>
                                                        {/* 🔥 FIX: order.payment.amount → order.total */}
                                                        <span className="font-bold text-lg">{formatNumber(order.total)} đ</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 🔥 THÊM: Thông tin VNPAY (nếu có) */}
                                        {order.payment && order.payment_method === 'vnpay' && (
                                            <div className="mt-6 border-t pt-4">
                                                <h4 className="font-bold mb-3">Thông tin giao dịch VNPAY</h4>
                                                <div className="grid md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                                                    <div>
                                                        <span className="text-gray-600">Mã giao dịch:</span>{' '}
                                                        <span className="font-medium">{order.payment.transaction_no || 'N/A'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Ngân hàng:</span>{' '}
                                                        <span className="font-medium">{order.payment.bank_code || 'N/A'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Loại thẻ:</span>{' '}
                                                        <span className="font-medium">{order.payment.card_type || 'N/A'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Ngày thanh toán:</span>{' '}
                                                        <span className="font-medium">
                                                            {order.payment.pay_date
                                                                ? formatDate(order.payment.pay_date)
                                                                : 'N/A'
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 mt-6 pt-6 border-t">
                                            {/* 🔥 FIX: order.status → order.order_status */}
                                            {order.order_status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                                        className="flex-1 bg-orange-200 text-orange-900 py-3 rounded-lg font-medium hover:bg-orange-300 transition-colors"
                                                    >
                                                        Cập nhật đơn hàng
                                                    </button>
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                        className="px-6 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
                                                    >
                                                        Hủy đơn
                                                    </button>
                                                </>
                                            )}

                                            {order.order_status === 'confirmed' && (
                                                <button
                                                    disabled
                                                    className="flex-1 bg-blue-100 text-blue-600 py-3 rounded-lg font-medium cursor-not-allowed"
                                                >
                                                    🚚 Đang giao hàng
                                                </button>
                                            )}

                                            {order.order_status === 'completed' && (
                                                <>
                                                    <button
                                                        disabled
                                                        className="flex-1 bg-green-100 text-green-600 py-3 rounded-lg font-medium cursor-not-allowed"
                                                    >
                                                        ✓ Đơn hàng hoàn thành
                                                    </button>
                                                    <button
                                                        onClick={() => handleWriteComment(order)}
                                                        className="px-6 bg-yellow-500 text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center gap-2"
                                                    >
                                                        <MessageSquare size={18} />
                                                        Write Comment
                                                    </button>
                                                </>
                                            )}

                                            {order.order_status === 'cancelled' && (
                                                <button
                                                    disabled
                                                    className="flex-1 bg-gray-200 text-gray-500 py-3 rounded-lg font-medium cursor-not-allowed"
                                                >
                                                    ✗ Đã hủy
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Product Selection Modal */}
            <Modal
                title={
                    <div>
                        <h3 className="text-xl font-bold">Chọn sản phẩm để đánh giá</h3>
                        {/* 🔥 FIX: selectedOrder?.orderCode → selectedOrder?.order_code */}
                        <p className="text-sm text-gray-600 mt-1">Đơn hàng: {selectedOrder?.order_code || '—'}</p>
                    </div>
                }
                open={showProductModal}
                onCancel={() => {
                    setShowProductModal(false);
                    setSelectedProduct(null);
                    setSelectedOrder(null);
                }}
                footer={[
                    <button
                        key="cancel"
                        onClick={() => {
                            setShowProductModal(false);
                            setSelectedProduct(null);
                            setSelectedOrder(null);
                        }}
                        className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors mr-3"
                    >
                        Hủy
                    </button>,
                    <button
                        key="submit"
                        onClick={handleConfirmSelection}
                        disabled={!selectedProduct}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${selectedProduct
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        Viết đánh giá
                    </button>
                ]}
                width={700}
                centered
            >
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {(selectedOrder?.items ?? []).map((item, index) => {
                        const key = item.id || item.product_id || index;
                        return (
                            <label
                                key={key}
                                className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                            >
                                {/* Radio button */}
                                <input
                                    type="radio"
                                    name="productSelect"
                                    checked={selectedProduct === item}
                                    onChange={() => setSelectedProduct(item)}
                                    className="w-5 h-5 mr-4 cursor-pointer accent-yellow-500"
                                />

                                {/* Product Image */}
                                <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden mr-4 flex-shrink-0">
                                    {item.image ? (
                                        // 🔥 FIX: item.name → item.product_name
                                        <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No image</div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="flex-1">
                                    {/* 🔥 FIX: item.name → item.product_name */}
                                    <h5 className="font-medium text-lg">{item.product_name || 'Sản phẩm'}</h5>

                                    <p className="text-sm text-gray-600 mt-1">
                                        {item.size && `Size: ${item.size}`}
                                        {item.color && ` • ${item.color}`}
                                    </p>

                                    <div className="flex justify-between
                                    items-center mt-2">
                                        <span className="text-sm text-gray-600">Số lượng: {item.quantity ?? 1}</span>
                                        {/* 🔥 FIX: Dùng item.total */}
                                        <span className="font-semibold text-yellow-600">
                                            {formatNumber(item.total || (item.price * item.quantity))} đ
                                        </span>
                                    </div>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </Modal>
        </div>
    );
}
export default OrderManagement;