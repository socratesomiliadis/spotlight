import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import AwardThumnail from '../AwardThumbnail';

export default function AwardsSlider() {
  return (
    <Swiper
      grabCursor={true}
      spaceBetween={60}
      className="w-full"
      slidesPerView={3}
      loop
    >
      <SwiperSlide>
        <AwardThumnail
          image="/static/images/Linear.png"
          projectTitle="Linear"
          awardTitle="Website of the Day"
          projectLink="/linear"
        />
      </SwiperSlide>
      <SwiperSlide>
        <AwardThumnail
          image="/static/images/Vercel.png"
          projectTitle="Vercel"
          awardTitle="Website of the Day"
          projectLink="/vercel"
        />
      </SwiperSlide>
      <SwiperSlide>
        <AwardThumnail
          image="/static/images/Rauno.png"
          projectTitle="Rauno"
          awardTitle="Website of the Day"
          projectLink="/rauno"
        />
      </SwiperSlide>
      <SwiperSlide>
        <AwardThumnail
          image="/static/images/Linear.png"
          projectTitle="Linear"
          awardTitle="Website of the Day"
          projectLink="/linear"
        />
      </SwiperSlide>
      <SwiperSlide>
        <AwardThumnail
          image="/static/images/Vercel.png"
          projectTitle="Vercel"
          awardTitle="Website of the Day"
          projectLink="/vercel"
        />
      </SwiperSlide>
      <SwiperSlide>
        <AwardThumnail
          image="/static/images/Rauno.png"
          projectTitle="Rauno"
          awardTitle="Website of the Day"
          projectLink="/rauno"
        />
      </SwiperSlide>
    </Swiper>
  );
}
