import { FacebookOutlined, GithubOutlined, InstagramOutlined, TwitterOutlined } from "@ant-design/icons";

const Footer = () => {
    return (
        < footer className="bg-gray-100 py-12" >
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                    <div className="col-span-2">
                        <h3 className="text-2xl font-bold mb-4">SHOP.CO</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            We have clothes that suits your style and which you're proud to wear. From women to men.
                        </p>
                        <div className="flex gap-3">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200">
                                <TwitterOutlined />
                            </div>
                            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800">
                               <FacebookOutlined />
                            </div>
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200">
                                <InstagramOutlined />
                            </div>
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200">
                                <GithubOutlined />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">COMPANY</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-black">About</a></li>
                            <li><a href="#" className="hover:text-black">Features</a></li>
                            <li><a href="#" className="hover:text-black">Works</a></li>
                            <li><a href="#" className="hover:text-black">Career</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">HELP</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-black">Customer Support</a></li>
                            <li><a href="#" className="hover:text-black">Delivery Details</a></li>
                            <li><a href="#" className="hover:text-black">Terms & Conditions</a></li>
                            <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">FAQ</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-black">Account</a></li>
                            <li><a href="#" className="hover:text-black">Manage Deliveries</a></li>
                            <li><a href="#" className="hover:text-black">Orders</a></li>
                            <li><a href="#" className="hover:text-black">Payments</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">RESOURCES</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-black">Free eBooks</a></li>
                            <li><a href="#" className="hover:text-black">Development Tutorial</a></li>
                            <li><a href="#" className="hover:text-black">How to - Blog</a></li>
                            <li><a href="#" className="hover:text-black">Youtube Playlist</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                    <p>Shop.co © 2000-2023, All Rights Reserved</p>
                    <div className="flex gap-3">
                        <div className="bg-white px-3 py-2 rounded border">
                            <img src="/api/placeholder/32/20" alt="Visa" className="h-5" />
                        </div>
                        <div className="bg-white px-3 py-2 rounded border">
                            <img src="/api/placeholder/32/20" alt="Mastercard" className="h-5" />
                        </div>
                        <div className="bg-white px-3 py-2 rounded border">
                            <img src="/api/placeholder/32/20" alt="PayPal" className="h-5" />
                        </div>
                        <div className="bg-white px-3 py-2 rounded border">
                            <img src="/api/placeholder/32/20" alt="Apple Pay" className="h-5" />
                        </div>
                        <div className="bg-white px-3 py-2 rounded border">
                            <img src="/api/placeholder/32/20" alt="Google Pay" className="h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )

}

export default Footer