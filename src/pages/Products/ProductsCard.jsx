import PropTypes from 'prop-types';
import ReactStars from "react-rating-stars-component";
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProductsCard = ({ product, isAdmin }) => {
  const {
    _id,
    ProductName,
    BrandName,
    ProductImage,
    Description,
    Price,
    Category,
    Ratings,
    ProductCreationDateAndTime
  } = product;
  // ----------- rating start -------------
  const [rating, setRating] = useState(0);
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return sum / reviews.length;
  };
  const loadReview = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_VERCEL_API}/reviewsFilter?scholarshipId=${_id}`);
      console.log(response.data);
      const reviews = response.data;
      const averageRating = calculateAverageRating(reviews);
      setRating(averageRating);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // loadReview();
  }, []);
  // ----------- rating end -------------

  // --------- copy -------------
  const [copyMessage, setCopyMessage] = useState('');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyMessage('Copied!');
      setTimeout(() => setCopyMessage(''), 2000); // Clear the message after 2 seconds
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  // Inline styles
  const containerStyle = {
    position: 'relative'
  };

  const buttonStyle = {
    color: 'red',
    cursor: 'pointer'
  };

  const copyMessageStyle = {
    position: 'absolute',
    top: '-30px', // Position above the button
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '3px',
    fontSize: '14px',
    visibility: copyMessage ? 'visible' : 'hidden',
    opacity: copyMessage ? 1 : 0,
    transition: 'opacity 0.5s'
  };

  // ----- end copy ----------
  return (
    <div className='border-2 rounded-2xl p-5 flex flex-col justify-between'>
      <div className='col-span-1 space-y-3 my-5'>
        <h3 className='font-semibold text-2xl'>{ProductName}</h3>
        <div className='flex justify-center items-center'>
          <img className='rounded-2xl' src={ProductImage} alt={ProductName} />
        </div>
        <div className='flex flex-col gap-2 justify-center'>
          <p><span className='font-semibold'></span> {ProductCreationDateAndTime}</p>
          <h3 className='font-semibold text-2xl'>{Category}</h3>
          <p><span className='font-semibold'>Brand Name:</span> {BrandName}</p>
          <p><span className='font-semibold'>Ratings:</span> {Ratings}</p>
          <p><span className='font-semibold'>Price:</span> {Price}</p>
          <p><span className='font-semibold'>Description:</span> {Description}</p>

          <div>
            {
              isAdmin &&
              <div style={containerStyle}>
                <button
                  style={buttonStyle}
                  onClick={() => copyToClipboard(ProductName + ", " + BrandName)}
                >
                  {ProductName}, {BrandName}
                </button>
                <div style={copyMessageStyle}>
                  {copyMessage}
                </div>
              </div>
            }
          </div>

          {/* -- TODO: Update rating -- */}
          {rating ?
            <p>
              <label className="flex gap-1 w-full items-center">
                <span>Rating: </span>
                <ReactStars
                  size={24}
                  activeColor="#ffd700"
                  value={rating}
                  edit={false}
                />
              </label>
            </p>
            : <></>}
        </div>
      </div>
    </div>
  );
};

ProductsCard.propTypes = {
  product: PropTypes.object,
  isAdmin: PropTypes.bool
};

export default ProductsCard;