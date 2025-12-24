import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function CODReturn() {
    const [params] = useSearchParams();
    const orderCode = params.get("order");

    return (
        <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="green"
                        className="w-16 h-16"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75l2.25 2.25L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-green-700">Đặt hàng thành công!</h1>

                <p className="mt-3 text-gray-700">
                    Cảm ơn bạn đã đặt hàng. Nhân viên sẽ sớm liên hệ để xác nhận.
                </p>

                <div className="mt-5 bg-gray-50 p-4 rounded-lg border">
                    <p className="text-sm text-gray-500">Mã đơn hàng của bạn</p>
                    <p className="text-lg font-semibold text-gray-900">
                        {orderCode || "Không tìm thấy mã đơn hàng"}
                    </p>
                </div>

                <Link
                    to="/"
                    className="mt-6 inline-block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
                >
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
}
