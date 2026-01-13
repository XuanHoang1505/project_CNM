import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, Tag, ArrowRight, Mail, MapPin } from 'lucide-react';
import { formatNumber } from "@/utils/Formatter";
import DiscountService from '@/services/site/DiscountService';
import AddressService from '@/services/site/AddressService';
import ShippingFeeService from '@/services/admin/ShippingFeeService';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function Cart() {
    const [cartItems, setCartItems] = useState([])
    const [promoCode, setPromoCode] = useState('');
    const [email, setEmail] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(null);

    // Address states
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [houseNumber, setHouseNumber] = useState("");

    const [discountAmount, setDiscountAmount] = useState(0);
    const [allFees, setAllFees] = useState([]);
    // Shipping fee states
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [isLoadingShippingFee, setIsLoadingShippingFee] = useState(false);
    const [shippingFeeError, setShippingFeeError] = useState(null);
    const [isLoadingWards, setIsLoadingWards] = useState(false);


    const navigate = useNavigate();

    // Lấy danh sách tỉnh khi load
    // Lấy danh sách province khi load trang
    useEffect(() => {
        ShippingFeeService.getAll().then((res) => {
            if (res?.data) {
                setAllFees(res.data);

                // Lấy danh sách tỉnh unique
                const provinces = [
                    ...new Map(
                        res.data.map(item => [item.province_code, {
                            code: item.province_code,
                            name: item.province_name
                        }])
                    ).values()
                ];

                setProvinces(provinces);
            }
        });
    }, []);

    // Load wards khi chọn province
    useEffect(() => {
        if (!selectedProvince) {
            setWards([]);
            setSelectedWard('');
            return;
        }

        setIsLoadingWards(true);

        const filteredWards = allFees
            .filter(item => item.province_code === selectedProvince)
            .map(item => ({
                code: item.ward_code,
                name: item.ward_name
            }))
            .filter(item => item.code); // tránh ward null

        setWards(filteredWards);

        setIsLoadingWards(false);
    }, [selectedProvince, allFees]);

    // Lookup shipping fee khi có đủ thông tin địa chỉ
    useEffect(() => {
        if (!selectedProvince || !selectedWard) {
            setDeliveryFee(0);
            setShippingFeeError(null);
            return;
        }

        setIsLoadingShippingFee(true);

        try {
            const matchedWard = allFees.find(
                f => f.province_code === selectedProvince && f.ward_code === selectedWard
            );

            if (matchedWard) {
                setDeliveryFee(matchedWard.fee);
            } else {
                // fallback chỉ theo tỉnh
                const matchedProvince = allFees.find(
                    f => f.province_code === selectedProvince && !f.ward_code
                );

                if (matchedProvince) {
                    setDeliveryFee(matchedProvince.fee);
                } else {
                    setDeliveryFee(15000);
                    setShippingFeeError("Không tìm thấy phí ship, áp dụng mặc định.");
                }
            }
        } catch (e) {
            console.error(e);
            setDeliveryFee(15000);
            setShippingFeeError("Lỗi tìm phí ship.");
        } finally {
            setIsLoadingShippingFee(false);
        }
    }, [selectedProvince, selectedWard, allFees]);


    const getCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart'));
        return cart || [];
    };

    useEffect(() => {
        const cart = getCart();
        setCartItems(cart);
    }, []);

    const updateQuantity = (id, delta, variant) => {
        setCartItems(prevItems => {
            const newCart = prevItems.map(item => {
                const sameVariant =
                    (item.variant?.size === variant?.size) &&
                    (item.variant?.color === variant?.color);

                if (item.id === id && sameVariant) {
                    return { ...item, quantity: Math.max(1, item.quantity + delta) };
                }

                return item;
            });

            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        });
    };

    const removeItem = (id) => {
        setCartItems(items => {
            const updated = items.filter(item => item.id !== id);
            localStorage.setItem("cart", JSON.stringify(updated));
            return updated;
        });
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // Trigger update
        window.dispatchEvent(new Event('cartUpdated'));

        toast.success('Đã xóa sản phẩm khỏi giỏ hàng', {
            icon: '🗑️',
            duration: 2000,
        });
    };

    const handleApplyPromo = async () => {
        const code = promoCode.trim().toUpperCase();
        if (!code) {
            toast.error("Please enter a discount code!");
            return;
        }

        try {
            const res = await DiscountService.getDiscountByCode(code);
            const discountData = res.data ?? res;

            if (!discountData.is_active) {
                toast.error("This discount code is inactive or expired!");
                return;
            }

            if (subtotal < discountData.min_order_value) {
                toast.error(
                    `A minimum order value of ${discountData.min_order_value.toLocaleString()} VND is required to apply this discount code.`
                );
                return;
            }

            let newAmount = 0;

            if (discountData.type === "percent") {
                newAmount = (subtotal * discountData.value) / 100;
            } else if (discountData.type === "fixed") {
                newAmount = discountData.value;
            }

            newAmount = Math.min(newAmount, discountData.max_discount);

            setDiscountAmount(newAmount);
            setAppliedDiscount(discountData);

            toast.success(`Applied successfully! You saved ${newAmount.toLocaleString()} VND`);

        } catch (error) {
            toast.error("Invalid or expired discount code!");
            console.error(error);
        }
    };

    // Kiểm tra địa chỉ đã đầy đủ chưa
    const isAddressComplete = houseNumber.trim() && selectedProvince && selectedWard;

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal - discountAmount + deliveryFee;

    const handleGoToCheckout = () => {
        const provinceObj = provinces.find(p => p.code === selectedProvince);
        const wardObj = wards.find(w => w.code === selectedWard);

        const address = {
            houseNumber,
            province: provinceObj?.name || "",
            ward: wardObj?.name || "",
            province_code: selectedProvince,
            ward_code: selectedWard,
            discountAmount: discountAmount || 0,
            deliveryFee: deliveryFee || 0,
            total: total || 0,
        };

        localStorage.setItem("detailCart", JSON.stringify(address));
        navigate("/checkout");
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-600">
                <span>Home</span> <span className="mx-2">›</span> <span className="text-black">Cart</span>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-8">YOUR CART</h2>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items & Address */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Cart Items List */}
                        <div className="space-y-4">
                            {cartItems.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 border rounded-lg">
                                    Your cart is empty
                                </div>
                            ) : (
                                cartItems.map((item, index) => (
                                    <div key={`${item.id}-${index}`} className="border rounded-lg p-4 flex gap-4">
                                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                            {item.image && (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                                    <p className="text-sm text-gray-600">Size: {item.variant.size || 'N/A'}</p>
                                                    <p className="text-sm text-gray-600">Color: {item.variant.color || 'N/A'}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id, item.variant)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center mt-4">
                                                <p className="text-xl font-bold">{formatNumber(item.price * item.quantity)} đ</p>
                                                <div className="flex items-center gap-4 bg-gray-100 rounded-full px-4 py-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1, item.variant)}
                                                        className="hover:text-gray-600"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1, item.variant)}
                                                        className="hover:text-gray-600"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Shipping Address */}
                        {cartItems.length > 0 && (
                            <div className="border rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin size={20} className="text-gray-700" />
                                    <h3 className="text-xl font-bold">Địa Chỉ Giao Hàng</h3>
                                </div>

                                <div className="space-y-4">
                                    {/* House Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số nhà, tên đường <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={houseNumber}
                                            onChange={(e) => setHouseNumber(e.target.value)}
                                            placeholder="Ví dụ: 123 Nguyễn Trãi"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        />
                                    </div>

                                    {/* Province */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tỉnh/Thành phố <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={selectedProvince}
                                            onChange={(e) => {
                                                setSelectedProvince(e.target.value);
                                                setSelectedWard(''); // Reset ward khi đổi province
                                            }}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                                        >
                                            <option value="">Chọn Tỉnh/Thành phố</option>
                                            {provinces.map((province) => (
                                                <option key={province.code} value={province.code}>
                                                    {province.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Ward */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phường/Xã <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={selectedWard}
                                            onChange={(e) => setSelectedWard(e.target.value)}
                                            disabled={!selectedProvince || wards.length === 0}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Chọn Phường/Xã</option>
                                            {wards.map((ward) => (
                                                <option key={ward.code} value={ward.code}>
                                                    {ward.name}
                                                </option>
                                            ))}
                                        </select>

                                        {selectedProvince && wards.length > 0 && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Tìm thấy {wards.length} phường/xã
                                            </p>
                                        )}
                                    </div>

                                    {/* Loading shipping fee */}
                                    {isLoadingShippingFee && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                                            <span className="text-blue-600 text-sm">
                                                🔄 Đang tính phí giao hàng...
                                            </span>
                                        </div>
                                    )}

                                    {/* Shipping fee error */}
                                    {shippingFeeError && (
                                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
                                            <span className="text-orange-600 text-sm">
                                                ⚠️ {shippingFeeError}
                                            </span>
                                        </div>
                                    )}

                                    {/* Warning if address incomplete */}
                                    {!isAddressComplete && !isLoadingShippingFee && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                                            <span className="text-yellow-600 text-sm">
                                                ⚠️ Vui lòng nhập đầy đủ địa chỉ để tính phí giao hàng
                                            </span>
                                        </div>
                                    )}

                                    {/* Success message when address is complete */}
                                    {isAddressComplete && !isLoadingShippingFee && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                                            <span className="text-green-600 text-sm">
                                                ✓ Địa chỉ đã được xác nhận. Phí giao hàng: {formatNumber(deliveryFee)} đ
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="border rounded-lg p-6 sticky top-4">
                            <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">{formatNumber(subtotal)} đ</span>
                                </div>

                                {subtotal > 0 && discountAmount > 0 && (
                                    <div className="flex justify-between text-red-500 mt-2">
                                        <span>Discount (-{appliedDiscount?.value}%)</span>
                                        <span className="font-semibold">- {discountAmount.toLocaleString()} đ</span>
                                    </div>
                                )}

                                {/* Delivery Fee - Show when address is complete */}
                                {isAddressComplete && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Delivery Fee
                                            {isLoadingShippingFee && " (đang tải...)"}
                                        </span>
                                        <span className="font-semibold">{formatNumber(deliveryFee)} đ</span>
                                    </div>
                                )}

                                <div className="border-t pt-4 flex justify-between text-lg">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-bold">{formatNumber(total)} đ</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mb-4">
                                <div className="flex-1 relative">
                                    <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Add promo code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    />
                                </div>
                                <button
                                    onClick={handleApplyPromo}
                                    className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800"
                                >
                                    Apply
                                </button>
                            </div>

                            <button
                                disabled={!isAddressComplete || cartItems.length === 0 || isLoadingShippingFee}
                                onClick={handleGoToCheckout}
                                className="w-full bg-black text-white py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                Go to Checkout
                                <ArrowRight size={20} />
                            </button>

                            {!isAddressComplete && cartItems.length > 0 && (
                                <p className="text-xs text-gray-500 text-center mt-2">
                                    Vui lòng nhập địa chỉ giao hàng để tiếp tục
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Newsletter */}
            <div className="bg-black text-white mt-16">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <h3 className="text-3xl font-bold max-w-md">
                            STAY UPTO DATE ABOUT OUR LATEST OFFERS
                        </h3>
                        <div className="w-full md:w-auto space-y-3">
                            <div className="relative">
                                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full md:w-80 pl-12 pr-4 py-3 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-gray-300"
                                />
                            </div>
                            <button className="w-full md:w-80 bg-white text-black py-3 rounded-full font-medium hover:bg-gray-100">
                                Subscribe to Newsletter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
                    © 2024 SHOP.CO. All rights reserved.
                </div>
            </div>
        </div>
    );
}

export default Cart;