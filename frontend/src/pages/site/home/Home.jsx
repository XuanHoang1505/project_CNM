import { Star, Check, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import ProductService from "@/services/site/ProductService";
import HeroImage from "@/assets/site/images/hero_image.jpg";
import { useNavigate } from "react-router-dom";

function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch data từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Gọi song song các API
        const [newProductsRes, topSellingRes] = await Promise.all([
          ProductService.getNewProducts(4),
          ProductService.getBestsellerProducts(4),
        ]);

        setNewArrivals(newProductsRes.data || []);
        setTopSelling(topSellingRes.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const dressStyles = [
    {
      name: "Casual",
      image:
        "https://res.cloudinary.com/did9xvglm/image/upload/v1765456212/casual_ejlkjc.jpg",
    },
    {
      name: "Formal",
      image:
        "https://res.cloudinary.com/did9xvglm/image/upload/v1765456412/formal_t1uiki.jpg",
    },
    {
      name: "Party",
      image:
        "https://res.cloudinary.com/did9xvglm/image/upload/v1765456412/party_vpdpmx.jpg",
    },
    {
      name: "Gym",
      image:
        "https://res.cloudinary.com/did9xvglm/image/upload/v1765456412/gym_wrj1fo.png",
    },
  ];

  const brands = ["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"];

  const testimonials = [
    {
      name: "Sarah M.",
      rating: 5,
      text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    },
    {
      name: "Alex K.",
      rating: 5,
      text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
    },
    {
      name: "James L.",
      rating: 5,
      text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
    },
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating)
          ? "fill-yellow-400 text-yellow-400"
          : i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
          }`}
      />
    ));
  };

  // Component hiển thị product card
  const ProductCard = ({ product }) => (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200"
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={
            product.main_image ||
            "https://via.placeholder.com/300x400?text=No+Image"
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-2 text-gray-800">
          {product.name}
        </h3>
        <div className="flex items-center mb-2">
          <div className="flex">{renderStars(product.rating || 4.5)}</div>
          <span className="text-sm text-gray-600 ml-2">
            {product.rating || 4.5}/5
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">{product.price}đ</span>
          {product.compare_price && (
            <>
              <span className="text-gray-400 line-through text-sm">
                {product.compare_price}đ
              </span>
              <span className="text-red-500 text-xs bg-red-100 px-2 py-1 rounded-full font-medium">
                -
                {Math.round(
                  ((product.compare_price - product.price) /
                    product.compare_price) *
                  100
                )}
                %
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="animate-pulse bg-white rounded-xl overflow-hidden shadow">
      <div className="bg-gray-200 h-72"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section style={{ background: "#F2F0F1" }}>
        <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-4">
              FIND CLOTHES THAT MATCHES YOUR STYLE
            </h1>
            <p className="text-gray-600 mb-6">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </p>
            <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800">
              Shop Now
            </button>
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-3xl font-bold">200+</div>
                <div className="text-gray-600 text-sm">
                  International Brands
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold">2,000+</div>
                <div className="text-gray-600 text-sm">
                  High-Quality Products
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold">30,000+</div>
                <div className="text-gray-600 text-sm">Happy Customers</div>
              </div>
            </div>
          </div>
          <img src={HeroImage} alt="Hero" className="w-full rounded-lg" />
        </div>
      </section>

      {/* Brands */}
      <section className="bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center flex-wrap gap-8">
          {brands.map((brand, i) => (
            <div key={i} className="text-white text-2xl font-bold">
              {brand}
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-center mb-12">NEW ARRIVALS</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {loading ? (
            // Hiển thị skeleton loading
            [...Array(4)].map((_, i) => <LoadingSkeleton key={i} />)
          ) : newArrivals.length > 0 ? (
            // Hiển thị sản phẩm từ API
            newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            // Thông báo không có sản phẩm
            <div className="col-span-4 text-center py-8 text-gray-500">
              Không có sản phẩm mới
            </div>
          )}
        </div>
        <div className="text-center mt-8">
          <button
            className="border border-gray-300 px-8 py-3 rounded-full hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate("/shop")}
          >
            View All
          </button>
        </div>
      </section>

      {/* Top Selling */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-center mb-12">TOP SELLING</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {loading ? (
            // Hiển thị skeleton loading
            [...Array(4)].map((_, i) => <LoadingSkeleton key={i} />)
          ) : topSelling.length > 0 ? (
            // Hiển thị sản phẩm từ API
            topSelling.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            // Thông báo không có sản phẩm
            <div className="col-span-4 text-center py-8 text-gray-500">
              Không có sản phẩm bán chạy
            </div>
          )}
        </div>
        <div className="text-center mt-8">
          <button
            className="border border-gray-300 px-8 py-3 rounded-full hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate("/shop")}
          >
            View All
          </button>
        </div>
      </section>

      {/* Browse by Dress Style */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gray-200 rounded-3xl p-12">
          <h2 className="text-4xl font-bold text-center mb-12">
            BROWSE BY DRESS STYLE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dressStyles.map((style, i) => (
              <div
                key={i}
                className="relative rounded-2xl h-64 overflow-hidden cursor-pointer hover:shadow-lg transition group"
                onClick={() => navigate("/shop")}
              >
                <img
                  src={style.image}
                  alt={style.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <span className="absolute top-8 left-8 text-2xl font-bold text-white drop-shadow-lg">
                  {style.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold">OUR HAPPY CUSTOMERS</h2>
          <div className="flex gap-2">
            <button className="border rounded-full p-2 hover:bg-gray-50">
              ←
            </button>
            <button className="border rounded-full p-2 hover:bg-gray-50">
              →
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="flex mb-4">{renderStars(item.rating)}</div>
              <div className="flex items-center mb-4">
                <span className="font-semibold">{item.name}</span>
                <Check className="w-4 h-4 text-green-500 ml-2" />
              </div>
              <p className="text-gray-600 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-black text-white rounded-3xl p-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <h2 className="text-3xl font-bold">
            STAY UPTO DATE ABOUT OUR LATEST OFFERS
          </h2>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="relative">
              <Mail className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full md:w-80 pl-12 pr-4 py-3 rounded-full text-black"
              />
            </div>
            <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
