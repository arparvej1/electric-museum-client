import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import './home.css';
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import 'react-toastify/dist/ReactToastify.css';
// import required modules
import axios from "axios";
import ProductsCard from "../Products/ProductsCard";
import useAuth from "../../hooks/useAuth";
import { FaList } from "react-icons/fa";
import { IoGrid } from "react-icons/io5";
import { Link } from "react-router-dom";
import { BiDetail } from "react-icons/bi";
// --------------- Swiper End ------------------------

const Home = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [displayLayout, setDisplayLayout] = useState(localStorage.getItem('displayLayout') ? localStorage.getItem('displayLayout') : 'grid');

  const handleDisplayLayoutBtn = (layout) => {
    if (layout === 'grid') {
      setDisplayLayout('grid')
    } else {
      setDisplayLayout('list')
    }
  };


  // const callLoadProducts2 = async () => {
  //   axios.get(`${import.meta.env.VITE_VERCEL_API}/products`)
  //     .then(function (response) {
  //       // handle success
  //       setProducts(response.data);
  //       setLoading(false);
  //     })
  //     .catch(function (error) {
  //       // handle error
  //       console.log(error);
  //     })
  // };

  // useEffect(() => {
  //   if (products.length < 1) {
  //     callLoadProducts2();
  //   }
  //   console.log('products', products);
  // }, [products]);

  // ----------------- pagination -----------------------
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [count, setCount] = useState(0);

  const numberOfPages = Math.ceil(count / itemsPerPage);
  const pages = [...Array(numberOfPages).keys()];

  const callProductsCount = async () => {
    await axios.get(`${import.meta.env.VITE_VERCEL_API}/productsCount?filterText=${filterText}`)
      .then(function (response) {
        // handle success
        console.log(response.data.count)
        setCount(response.data.count)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  };

  const callLoadProducts = async () => {
    await axios.get(`${import.meta.env.VITE_VERCEL_API}/productsLimit?page=${currentPage}&size=${itemsPerPage}&filterText=${filterText}&input=${''}`)
      .then(function (response) {
        // handle success
        console.log('response', response.data)
        setProducts(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  };

  useEffect(() => {
    callProductsCount();
    callLoadProducts();
  }, [currentPage, itemsPerPage, filterText]);

  const handleItemsPerPage = e => {
    const val = parseInt(e.target.value);
    console.log(val);
    setItemsPerPage(val);
    setCurrentPage(0);
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  }

  // ------------------- pagination end ------------------

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchUserRole() {
      if (user) {
        const response = await axios.get(`${import.meta.env.VITE_VERCEL_API}/checkAdmin/${user.email}`);
        setIsAdmin(response.data.admin);
        // console.log(response.data);
      } else {
        setIsAdmin(false);
      }
    }
    fetchUserRole();
  }, [user]);

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

      <div className="my-5 md:my-10 lg:my-24">
        < h3 className="font-semibold md:mt-10 text-xl md:text-2xl lg:text-3xl text-base-content mx-auto text-center">Lorem ipsum dolor sit amet consectetur adipisicing.</h3>
        <p className="my-5 md:my-8 text-center md:w-2/3 mx-auto">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex dignissimos, deserunt, sequi doloribus nam ratione odio debitis consequuntur reprehenderit tempora enim aut hic praesentium qui quis distinctio fugiat eos ad!</p>
      </div>
      {/* --------- Display Layout Start ------- */}
      {products.length > 0 ?
        <div className="flex justify-end items-center gap-2 my-5">
          <p className="font-semibold md:text-xl">Display Layout</p>
          <div>
            <span onClick={() => handleDisplayLayoutBtn('list')}
              className={`btn rounded-l-2xl rounded-r-none text-xl md:text-2xl ${displayLayout === 'list' ? 'bg-accent bg-opacity-50' : ''}`}><FaList /></span>
            <span onClick={() => handleDisplayLayoutBtn('grid')}
              className={`btn rounded-l-none rounded-r-2xl text-xl md:text-2xl ${displayLayout === 'grid' ? 'bg-accent bg-opacity-50' : ''}`}><IoGrid /></span>
          </div>
        </div> : <></>}
      {/* --------- Display Layout End ------- */}

      {/* ------------ products card start ------------- */}
      {/* --------------------- display view ------------------------- */}
      {
        displayLayout === 'list' ?
          <div className="max-w-5xl mx-auto">
            {/* products display list view */}
            {products.length > 0 ?
              <div className="overflow-x-auto">
                <table className="table table-xs table-pin-rows table-pin-cols">
                  <thead>
                    <tr>
                      <th></th>
                      <td className="md:text-sm text-center">Image</td>
                      <td className="md:text-sm text-center">Product Name</td>
                      <td className="md:text-sm text-center">Category</td>
                      <td className="md:text-sm text-center">Brand Name</td>
                      <td className="md:text-sm text-center">Price</td>
                      <td className="md:text-sm text-center">Added</td>
                      <td className="md:text-sm text-center">Details</td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      products.map((product, idx) => <tr key={product._id} className="md:text-sm">
                        <th className="md:text-sm">{(currentPage * itemsPerPage) + idx + 1}</th>
                        <td className="md:text-sm">
                          <img className="w-10" src={product.ProductImage} alt="" />
                        </td>
                        <td className="md:text-sm">{product.ProductName}</td>
                        <td className="md:text-sm">{product.Category}</td>
                        <td className="md:text-sm">{product.BrandName}</td>
                        <td className="md:text-sm">{product.Price}</td>
                        <td className="md:text-sm">{product.ProductCreationDateAndTime}</td>
                        <td className="md:text-sm text-center"><Link to={`/product/${product._id}`} className="btn btn-link text-xl"><BiDetail title="View Details" /></Link></td>
                      </tr>)
                    }
                  </tbody>
                </table>
              </div> : <></>}
          </div>
          :
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* products display card view */}
            {
              products.map(product => <ProductsCard
                key={product._id}
                product={product}
                isAdmin={isAdmin}
              ></ProductsCard>)
            }
          </div>
      }

      {!loading && !products.length > 0 &&
        <p className="mb-5 flex justify-center  md:text-xl">
          <img className="md:w-3/4 lg:w-2/4" src="https://i.ibb.co/syjyZ2C/search-result-not-found.gif" alt="Sorry, no products found. Try adjusting your search or check back later." />
        </p>
      }
      {/* ------------- products card end -------------- */}
      {/* ------- pagination start ------- */}
      {
        products.length > 0 ?
          <div className='text-center my-10'>
            <p className="mb-8 font-semibold">Current page: {currentPage + 1}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="btn" onClick={handlePrevPage}>Prev</button>
              {
                pages.map(page => <button
                  // className={currentPage === page ? 'selected' : undefined}
                  className={`btn ${currentPage === page ? 'bg-accent text-accent-content' : undefined}`}
                  onClick={() => setCurrentPage(page)}
                  key={page}
                >{page + 1}</button>)
              }
              <button className="btn" onClick={handleNextPage}>Next</button>
              <select className="btn bg-base-100 border-2 text-base-content w-20" value={itemsPerPage} onChange={handleItemsPerPage}>
                <option value="9">9</option>
                <option value="12">12</option>
                <option value="18">18</option>
                <option value="24">24</option>
                <option value="48">48</option>
              </select>
            </div>
          </div>
          :
          <></>
      }
      {/* ------- pagination end ------- */}
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