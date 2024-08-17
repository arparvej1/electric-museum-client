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
  // ---------------- rating start ---------------------
  const [thisRating, setThisRating] = useState(0);

  const loadRating = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_VERCEL_API}/productRating/${_id}`);
      // console.log('thisRating', response.data.averageRating);
      setThisRating(Number(response.data.averageRating));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadRating();
  }, []);
  // ---------------- rating end ---------------------


  return (
    <div className='border-2 rounded-2xl p-5 flex flex-col justify-between'>
      <div className='col-span-1 space-y-3 my-5'>
          <h3 className='font-semibold text-2xl'>{ProductName}</h3>
        <div className='flex justify-center items-center'>
          <Link to={`/product/${_id}`}>
            <img className='rounded-2xl' src={ProductImage} alt={ProductName} />
          </Link>
        </div>
        <div className='flex flex-col gap-2 justify-center'>
          <p><span className='font-semibold'></span> {useDateTimeFormat(ProductCreationDateAndTime)}</p>
          <h3 className='font-semibold text-2xl'>{Category}</h3>
          <p><span className='font-semibold'>Brand Name:</span> {BrandName}</p>
          <p><span className='font-semibold'>Price:</span> {Price}</p>
          <label className="flex gap-1 w-full items-center">
            <span className="font-semibold">Rating: </span>
            {thisRating > 0 ? (
              <ReactStars
                count={5}
                value={thisRating}
                size={24}
                edit={false}
                emptyIcon={<i className="far fa-star"></i>}
                halfIcon={<i className="fa fa-star-half-alt"></i>}
                fullIcon={<i className="fa fa-star"></i>}
                activeColor="#ffd700"
              />
            ) : (
              <span>No Rating Fund.</span>
            )}
          </label>
          <p><span className='font-semibold'>Description:</span> {Description}</p>

          <div>
            {
              isAdmin &&
              <ProductUpdate
                product={product}
              ></ProductUpdate>
            }
          </div>

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