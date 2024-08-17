import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import required modules
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import ReactStars from "react-rating-stars-component";


const ReviewCard = ({ reviews }) => {

  return (
    <div>
      {/* ---------- slider review start ------------ */}
      <div className='my-6 md:my-10'>
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          loop={true}
          navigation={true}
          modules={[Autoplay, Navigation, Pagination]}
          className="mySwiper">
          {
            reviews.map((review, idx) => (
              <SwiperSlide
                key={idx}
              >
                <div className={`w-full flex flex-col gap-3 justify-center items-center pb-6 mb-5`}>
                  <div className='border-2 rounded-full'>
                    <img className="w-32 h-32 rounded-full p-2" src={review.reviewerImage} />
                  </div>
                  <p className='w-10/12 md:w-8/12 text-xl md:text-2xl courgette-regular text-center'>
                    {review.comment}
                  </p>
                  <div className="flex justify-center md:w-3/12 mx-auto">
                    <ReactStars
                      size={24}
                      activeColor="#ffd700"
                      value={review.rating}
                      edit={false}
                    />
                  </div>
                  <div className="text-center md:w-3/12 mx-auto">{review.reviewDate}</div>
                  <div className="text-center divider md:w-3/12 mx-auto">{review.reviewerName}</div>
                </div>
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
      {/* ---------- slider review End ------------ */}
    </div>
  );
};

ReviewCard.propTypes = {
  reviews: PropTypes.array.isRequired
};

export default ReviewCard;