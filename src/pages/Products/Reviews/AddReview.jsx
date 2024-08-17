import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ReactStars from "react-rating-stars-component";
import useAuth from '../../../hooks/useAuth';
import LoginModel from '../../User/Login/LoginModel';
import PropTypes from 'prop-types';
import useAxiosSecure from '../../../../backup/hooks/useAxiosSecure';

const AddReview = ({ product }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { _id } = product;
  // ---------------- review start ---------------------

  // const [reviews, setReviews] = useState([]);
  // const loadReview = async () => {
  //   try {
  //     const response = await axiosSecure.get(`/myReviews/${user.email}`);
  //     // console.log('reviews', response.data);
  //     setReviews(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   loadReview();
  // }, []);

  // const [thisScholarship, setThisScholarship] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await axiosSecure.get(`/scholarship/${scholarshipId}`);
  //       setThisScholarship(res.data);
  //       // console.log('single scholarship', res.data);
  //     } catch (error) {
  //       console.error('Error fetching applied scholarships:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const [reviewRating, setReviewRating] = useState(0);
  const [ratingMsg, setRatingMsg] = useState('');
  const ratingChanged = (newRating) => {
    setReviewRating(newRating);
    setRatingMsg('');
  };
  const [reviewOneTime, setReviewOneTime] = useState(true);

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!user) {
      document.getElementById('login_modal').showModal();
    }

    if (reviewRating < 1) {
      return setRatingMsg('Please kindly provide a rating.');
    } else {
      setRatingMsg('');
    }

    if (!reviewOneTime) return;
    setReviewOneTime(false);

    const form = e.target;
    const comment = form.comment.value;
    const reviewDate = form.reviewDate.value;

    const completeReview = {
      reviewerImage: user.photoURL,
      reviewerName: user.displayName,
      reviewerEmail: user.email,
      reviewDate,
      rating: parseInt(reviewRating),
      comment,
      productId: _id
    };

    console.log(completeReview);
    // --------- send server start ----- 
    await axiosSecure.post(`/reviews`, completeReview)
      .then(function (response) {
        console.log(response.data);
        if (response.data.acknowledged) {
          toast.success('Thanks for Review!');
          // loadReview();
          form.reset();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    // --------- send server end -----
  };
  // ---------------- review end ---------------------

  return (
    <div>
      <h3 className="font-bold text-lg text-center">Review</h3>
      <form
        onSubmit={handleAddReview}
        className="flex flex-col gap-5 w-full md:w-3/5 lg:w-1/2 mx-auto">
        <div className="grid grid-cols-1 gap-5">
          <label className="flex flex-col gap-1 w-full">
            <span>Comment</span>
            <textarea name="comment" placeholder="Write your review here" className="textarea textarea-bordered h-24 w-full" required ></textarea>
          </label>
          <label className="flex gap-1 w-full items-center">
            <span>Rating: </span>
            <ReactStars
              count={5}
              onChange={ratingChanged}
              size={24}
              emptyIcon={<i className="far fa-star"></i>}
              halfIcon={<i className="fa fa-star-half-alt"></i>}
              fullIcon={<i className="fa fa-star"></i>}
              activeColor="#ffd700"
            />
          </label>
          {ratingMsg && <p className="text-red-500">{ratingMsg}</p>}
          <label className="flex flex-col gap-1 w-full">
            <span>Review Date</span>
            <input type="date" name="reviewDate" value={new Date().toISOString().substring(0, 10)} className="input input-bordered w-full" required />
          </label>
        </div>
        <div className="gap-5">
          <label className="flex flex-col gap-1 w-full">
            <input type="submit" value="Submit" className="btn bg-secondary text-secondary-content w-full" />
          </label>
        </div>
      </form>
      {/* ------- Login Form Start ---------- */}
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="login_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <LoginModel></LoginModel>
        </div>
      </dialog>
      {/* ------- Login Form End ---------- */}
    </div>
  );
};


AddReview.propTypes = {
  product: PropTypes.object.isRequired
};

export default AddReview;