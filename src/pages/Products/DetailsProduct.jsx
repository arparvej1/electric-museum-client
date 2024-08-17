import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLoaderData, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import useDateTimeFormat from "../../hooks/useDateTimeFormat";
import AddReview from "./Reviews/AddReview";
import ReactStars from "react-rating-stars-component";

const DetailsProduct = () => {
  const { user } = useAuth();
  const product = useLoaderData();
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      <Helmet>
        <title> {ProductName} | Electric Museum </title>
      </Helmet>
      {/* ---------------- product details ------------------- */}
      <div>
        <div className="flex flex-col md:flex-row gap-12 mt-10 justify-center">
          <div className="bg-base-300 rounded-3xl p-8 flex justify-center">
            <img className="max-h-96" src={ProductImage} alt={ProductName} />
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-4xl">{ProductName}</h3>
            <hr />
            <p className="text-justify"><span className="font-bold">Brand Name:</span> {BrandName}</p>
            <p className="text-justify"><span className="font-bold">Category:</span> {Category}</p>
            <p className="text-justify"><span className="font-bold">Price:</span> {Price}</p>
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
            <p className="text-justify"><span className="font-bold">Added Date:</span> {useDateTimeFormat(ProductCreationDateAndTime)}</p>
          </div>
        </div>
        <hr className="my-5" />
        <div className="flex flex-col gap-4">
          <p className="text-justify"><span className="font-bold">Description:</span> {Description}</p>
          <hr />
          <div>
            <AddReview
              product={product}
              loadRating={loadRating}
            ></AddReview>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default DetailsProduct;