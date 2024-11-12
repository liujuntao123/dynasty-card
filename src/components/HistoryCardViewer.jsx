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
      details: data.详情.replace(/\[[\u4e00-\u9fa5 ]*\d+\]|\[参\d+\]|\[书\d+\]|\[注 \d+\]/g, '')
    }
  }));

  // 移除 useEffect 中的动态导入逻辑，因为图片现在在 public 目录下
  useEffect(() => {
    // 为所卡片创建公共路径的图片 URL
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

          {/* 文字内容区域 - 更新样式 */}
          <div className="px-6 py-6 bg-gradient-to-b from-white to-gray-50 w-full max-w-md mx-auto rounded-b-2xl shadow-sm">
            {/* 标题区域 - 重新设计的样式 */}
            <div className="mb-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-5xl font-bold text-gray-900 tracking-tight font-serif">
                  {cards[currentIndex].title}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-12 bg-gray-400"></div>
                  <span className="text-lg text-gray-500 font-medium tracking-wider">
                    {cards[currentIndex].year}
                  </span>
                </div>
              </div>
            </div>

            {/* 详细内容 - 引用样式效果 */}
            <div className="space-y-7">
              {cards[currentIndex].details.details.split('\n').map((paragraph, index) => (
                <div key={index} className="pl-4 border-l-4 border-gray-200 hover:border-gray-300 transition-colors"> 
                  <p className={`
                    relative mb-0 leading-relaxed
                    ${index === 0 
                      ? "text-xl text-gray-800 font-medium tracking-wide mb-8 first-letter:text-3xl first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:leading-none" 
                      : "text-lg text-gray-600 font-normal tracking-wide"}
                  `}>
                    {paragraph}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCardViewer;