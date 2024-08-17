import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLoaderData, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import useDateTimeFormat from "../../hooks/useDateTimeFormat";
import AddReview from "./Reviews/AddReview";

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

  // ---------------- review start ---------------------
  const [reviews, setReviews] = useState([]);
  const loadReview = async () => {
    try {
      const response = await axios.get(`/reviewsFilter?scholarshipId=${_id}`);
      // console.log(response.data);
      setReviews(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // loadReview();
  }, []);
  // ---------------- review end ---------------------

  return (
    <>
      <Helmet>
        <title> {ProductName} | Electric Museum </title>
      </Helmet>
      {/* ---------------- scholarship details ------------------- */}
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
            <p className="text-justify"><span className="font-bold">Ratings:</span> {Ratings}</p>
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
            ></AddReview>
          </div>
        </div>
      </div>
      
      <ToastContainer />
    </>
  );
};

export default DetailsProduct;