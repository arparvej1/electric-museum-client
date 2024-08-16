import PropTypes from 'prop-types';
import ReactStars from "react-rating-stars-component";
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductUpdate from './ProductUpdate/ProductUpdate';
import useDateTimeFormat from '../../hooks/useDateTimeFormat';
import { Link } from 'react-router-dom';

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


  return (
    <div className='border-2 rounded-2xl p-5 flex flex-col justify-between'>
      <div className='col-span-1 space-y-3 my-5'>
        <Link to={`/product/${_id}`}>
          <h3 className='font-semibold text-2xl hover:underline'>{ProductName}</h3>
        </Link>
        <div className='flex justify-center items-center'>
          <img className='rounded-2xl' src={ProductImage} alt={ProductName} />
        </div>
        <div className='flex flex-col gap-2 justify-center'>
          <p><span className='font-semibold'></span> {useDateTimeFormat(ProductCreationDateAndTime)}</p>
          <h3 className='font-semibold text-2xl'>{Category}</h3>
          <p><span className='font-semibold'>Brand Name:</span> {BrandName}</p>
          <p><span className='font-semibold'>Ratings:</span> {Ratings}</p>
          <p><span className='font-semibold'>Price:</span> {Price}</p>
          <p><span className='font-semibold'>Description:</span> {Description}</p>

          <div>
            {
              isAdmin &&
              <ProductUpdate
                product={product}
              ></ProductUpdate>
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