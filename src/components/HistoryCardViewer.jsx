import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import info from '../info.js';

const HistoryCardViewer = () => {
  const [loadedImages, setLoadedImages] = useState({});
  const [swiperInstance, setSwiperInstance] = useState(null);
  const dropdownRef = useRef(null);

  // 将对象转换为数组并添加id
  const cards = Object.entries(info).map(([dynasty, data], index) => ({
    id: index + 1,
    title: dynasty,
    year: data.起止年份,
    image: data.img,
    description: data.总结诗句,
    details: {
      founder: data.开国皇帝,
      lastEmperor: data.末代皇帝,
      centralImage: data.中心图案,
      details: data.详情
    }
  }));

  // 移除 useEffect 中的动态导入逻辑，因为图片现在在 public 目录下
  useEffect(() => {
    // 为所有卡片创建公共路径的图片 URL
    const publicImages = {};
    cards.forEach((card) => {
      publicImages[card.image] = `/assets${card.image}`; // 直接使用图片路径
    });
    setLoadedImages(publicImages);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectCard = (index) => {
    setCurrentIndex(index);
    if (swiperInstance) {
      swiperInstance.slideTo(index);
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 下拉菜单按钮和内容 - 调整位置和宽度 */}
      <div className="w-full max-w-md mx-auto relative">
        <div className="absolute top-8 right-8 z-20" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-white rounded-full p-3 shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-[280px] bg-white rounded-2xl shadow-2xl max-h-[70vh] overflow-y-auto">
              {cards.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => selectCard(index)}
                  className={`w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl
                    ${index === currentIndex ? 'text-blue-700 bg-blue-50' : 'text-gray-700'}`}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-lg">{card.title}</span>
                    <span className="text-sm text-gray-500 mt-1">{card.year}</span>
                  </div>
                  {index === currentIndex && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 主内容区域 - 调整最大宽度为移动端友好的尺寸 */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-md mx-auto"> {/* 将 max-w-6xl 改为 max-w-md */}
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation={false}
              pagination={{ clickable: true }}
              onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
              initialSlide={currentIndex}
              slidesPerView={1}
              allowTouchMove={true}
              onSwiper={setSwiperInstance}
              onClick={() => setIsDropdownOpen(false)}
            >
              {cards.map((card, index) => (
                <SwiperSlide 
                  key={index}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <img
                    src={loadedImages[card.image]} // 现在直接使用图片路径
                    alt={card.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Failed to load image for ${card.title}`);
                      e.target.src = ''; 
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* 文字内容 - 使用相同的最大宽度 */}
          <div className="p-4 bg-white w-full max-w-md mx-auto">
            <h2 className="text-5xl font-light mb-3 tracking-wide text-gray-900">
              {cards[currentIndex].title}
            </h2>
            <p className="text-xl font-light text-gray-600 mb-6">
              {cards[currentIndex].year}
            </p>
            <div className="space-y-3">
             
              <p className="text-lg font-light italic mt-4 leading-relaxed text-gray-800">
                {cards[currentIndex].details.details}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCardViewer;