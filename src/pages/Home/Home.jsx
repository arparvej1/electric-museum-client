import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import './home.css';
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
// --------------- Swiper Start ------------------------
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import required modules
import axios from "axios";
import ProductsCard from "../Products/ProductsCard";
// --------------- Swiper End ------------------------

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const callLoadProducts = async () => {
    axios.get(`${import.meta.env.VITE_VERCEL_API}/products`)
      .then(function (response) {
        // handle success
        setProducts(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  };

  useEffect(() => {
    if (products.length < 1) {
      callLoadProducts();
    }
    console.log('products', products);
  }, [products]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // ---------------- review start ---------------------
  const [reviews, setReviews] = useState([]);
  const loadReview = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_VERCEL_API}/reviews`);
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

  const handleSubscribeEmail = (e) => {
    e.preventDefault();
    const form = e.target;
    const subscribeEmail = form.subscribeEmail.value;
    const subscribeItem = { subscribeEmail }
    console.log(subscribeEmail);

    // --------- send server start -----
    axios.get(`${import.meta.env.VITE_VERCEL_API}/checkSubscriber?email=${subscribeEmail}`)
      .then(function (response) {
        console.log(response.data);
        if (!response.data.subscribed) {
          axios.post(`${import.meta.env.VITE_VERCEL_API}/subscriber`, subscribeItem)
            .then(function (response) {
              console.log(response.data);
              if (response.data.acknowledged) {
                Swal.fire({
                  title: 'Success!',
                  text: 'Thanks for Subscribed!',
                  icon: 'success',
                  confirmButtonText: 'Okay'
                })
              }
              form.reset();
            })
            .catch(function (error) {
              console.log(error);
            });
        } else toast.warn('You are already subscribed!')
        form.reset();
      })
      .catch(function (error) {
        console.log(error);
      });
    // --------- send server end -----
  }

  return (
    <div>
      <Helmet>
        <title> Electric Museum </title>
      </Helmet>
      {/* ---------- slider banner start ------------ */}

      {/* ---------- slider banner End ------------ */}
      {/* ------------ products card start ------------- */}
      <div className="my-5 md:my-10 lg:my-24">
        < h3 className="font-semibold md:mt-10 text-xl md:text-2xl lg:text-3xl text-base-content mx-auto text-center">Lorem ipsum dolor sit amet consectetur adipisicing.</h3>
        <p className="my-5 md:my-8 text-center md:w-2/3 mx-auto">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex dignissimos, deserunt, sequi doloribus nam ratione odio debitis consequuntur reprehenderit tempora enim aut hic praesentium qui quis distinctio fugiat eos ad!</p>
      </div>

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {
            products.map(product => <ProductsCard
              key={product._id} product={product}
            ></ProductsCard>)
          }
        </div>
      {/* ------------- products card end -------------- */}
      {/* ---------- review section start --------- */}
      <div>

      </div>
      {/* ---------- review section end --------- */}
      {/* Subscriber start */}
      <div className="my-5 md:my-10 lg:my-20">
        <p className="max-w-2xl text-center my-5 px-5 md:mt-10 lg:mt-24 mx-auto">
          Illuminate your product discovery with Electric Museum. Explore now for the latest innovations and expertly curated collections. Don’t miss out on the electrifying experience!
        </p>
        <div className="max-w-96 px-5 mx-auto">
          <form onSubmit={handleSubscribeEmail} className="flex flex-col gap-5">
            <div>
              <label className="flex flex-col gap-1 w-full">
                <span></span>
                <input type="email" name="subscribeEmail" placeholder="Enter your email.." className="input input-bordered w-full" required />
              </label>
            </div>
            <div className="gap-5">
              <label className="flex flex-col gap-1 w-full">
                <input type="submit" value="Subscribe" className="btn bg-secondary text-secondary-content w-full" />
              </label>
            </div>
          </form>
        </div>
      </div>
      {/* Subscriber end */}
      <ToastContainer />
    </div>
  );
};

export default Home;