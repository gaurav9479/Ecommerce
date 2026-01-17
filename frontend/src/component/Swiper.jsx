
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';

const AdSlider = () => {
  const adImages = [
    '/ads/ad1.jpg',
    '/ads/ad2.jpg',
    '/ads/ad3.jpg',
  ];

  return (
    <div className="w-full max-h-64 overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        slidesPerView={1}
        className="rounded-lg"
      >
        {adImages.map((src, index) => (
          <SwiperSlide key={index}>
            <img src={src} alt={`Ad ${index + 1}`} className="w-full h-64 object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AdSlider;
