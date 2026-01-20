import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

const FeaturedCarousel = ({ products }) => {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={25}
      slidesPerView={1}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
      }}
      className="pb-12"
    >
      {products.map((product) => (
        <SwiperSlide key={product.id}>
          <Link
            to={`/products/${product.id}`}
            className="block bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/20 transition"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="h-56 w-full object-contain bg-black p-4"
            />

            <div className="p-4 space-y-2">
              <h3 className="font-semibold line-clamp-1">
                {product.name}
              </h3>
              <p className="text-indigo-400 font-bold text-lg">
                ₹ {product.price}
              </p>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default FeaturedCarousel;
