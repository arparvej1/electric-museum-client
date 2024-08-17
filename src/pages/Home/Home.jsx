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
import useDateTimeFormat from "../../hooks/useDateTimeFormat";
import ReviewCard from "../Products/Reviews/ReviewCard";
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

  // ----------------- pagination -----------------------
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [count, setCount] = useState(0);

  const numberOfPages = Math.ceil(count / itemsPerPage);
  const pages = [...Array(numberOfPages).keys()];

  // ----- extra filter items
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState(''); // 'desc' for descending, 'asc' for ascending
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const callProductsCount = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_VERCEL_API}/productsCount?filterText=${filterText}&brand=${selectedBrand}&category=${selectedCategory}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
      // handle success
      setCount(response.data.count)
    } catch (error) {
      // handle error
      console.log(error);
    }
  };

  const callLoadProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_VERCEL_API}/productsLimit?page=${currentPage}&size=${itemsPerPage}&filterText=${filterText}&sortBy=${sortBy}&sortOrder=${sortOrder}&brand=${selectedBrand}&category=${selectedCategory}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
      // handle success
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      // handle error
      console.log(error);
    }
  };

  useEffect(() => {
    callProductsCount();
    callLoadProducts();
  }, [currentPage, itemsPerPage, filterText, sortBy, sortOrder, selectedBrand, selectedCategory, minPrice, maxPrice]);

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
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setCurrentPage(0);
    const form = e.target;
    const searchText = form.searchField.value;
    console.log(searchText);
    setFilterText(searchText);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setCurrentPage(0);
    if (value === 'priceLowToHigh') {
      setSortBy('Price');
      setSortOrder('asc');
    } else if (value === 'priceHighToLow') {
      setSortBy('Price');
      setSortOrder('desc');
    } else if (value === 'newest') {
      setSortBy('ProductCreationDateAndTime');
      setSortOrder('desc');
    } else if (value === 'oldest') {
      setSortBy('ProductCreationDateAndTime');
      setSortOrder('asc');
    }
  };


  useEffect(() => {
    async function fetchBrandsAndCategories() {
      try {
        const [brandsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_VERCEL_API}/brands`),
          axios.get(`${import.meta.env.VITE_VERCEL_API}/categories`)
        ]);
        setBrands(brandsResponse.data);
        setCategories(categoriesResponse.data);
        // console.log(brands);
        // console.log(categories);
      } catch (error) {
        console.error('Error fetching brands or categories:', error);
      }
    }
    fetchBrandsAndCategories();
  }, []);

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    if (isNaN(min)) {
      setMinPrice('');
    } else {
      setMinPrice(min);
    }

    if (isNaN(max)) {
      setMaxPrice('');
    } else {
      setMaxPrice(max);
    }

    console.log(min, max, 'min, max');

    setCurrentPage(0);
  };

  return (
    <div>
      <Helmet>
        <title> Electric Museum </title>
      </Helmet>
      {/* ---------- slider banner start ------------ */}

      {/* ---------- slider banner End ------------ */}

      <div className="my-5">
        < h3 className="font-semibold md:mt-10 text-xl md:text-2xl lg:text-3xl text-base-content mx-auto text-center">Explore the Finest Selection of Electrical Products</h3>
        <p className="my-5 md:my-8 text-center md:w-2/3 mx-auto">Discover a wide range of top-quality electrical products. Browse through our collection with easy navigation, categorized sorting, and seamless pagination to find exactly what you need. Whether you're looking for innovative lighting solutions, reliable switches, or custom-built electrical distribution boards, we've got you covered.</p>
      </div>
      <div className="flex justify-center md:gap-10 flex-col-reverse md:flex-row">
        {/* ----- Search start ----- */}
        <div className='my-6 text-center'>
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row justify-center gap-2">
              <label className="input input-bordered flex items-center gap-2">
                <input type="text" name="searchField" className="grow" placeholder="Search" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
              </label>
              <label className="flex flex-col gap-1">
                <input type="submit" value="Search" className="btn bg-primary text-primary-content" />
              </label>
            </div>
          </form>
        </div>
        {/* ----- Search end ----- */}
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
      </div>

      <div className="flex justify-center items-center gap-3 md:gap-10 flex-col-reverse md:flex-row">
        {/* ------- Sort By Start --------- */}
        <div>
          <label className="font-bold">Sort By: </label>
          <select
            className="select select-bordered"
            onChange={handleSortChange}>
            <option selected disabled value="">Default</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="newest">Date Added: Newest first</option>
            <option value="oldest">Date Added: Oldest first</option>
          </select>
        </div>
        {/* ------- Sort By end --------- */}
        {/* -------- Categorization filter start ------ */}
        <div>
          {/* Brand Filter */}
          <label className="font-bold">Brand: </label>
          <select
            className="select select-bordered"
            onChange={handleBrandChange}
            value={selectedBrand}
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div>
          {/* Category Filter */}
          <label className="font-bold">Category: </label>
          <select
            className="select select-bordered"
            onChange={handleCategoryChange}
            value={selectedCategory}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* -------- Categorization filter end ------ */}
      </div>
      <hr className="my-5" />
      <div className="flex justify-center">
        {/* ----- Filter start ----- */}
        <form onSubmit={handleFilter} className="flex flex-col md:flex-row gap-3 justify-center items-center">
          <label className="font-bold">Price Range: </label>
          <div className="flex flex-col md:flex-row gap-2">
            <input type="number" placeholder="Min" className="input input-bordered" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
            <input type="number" placeholder="Max" className="input input-bordered" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
          </div>
          <button type="submit" className='btn'>Apply Filters</button>
        </form>
        {/* ----- Filter end ----- */}
      </div>

      <hr className="my-5" />
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
                      <td className="md:text-sm text-center">Added Date</td>
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
                        <td className="md:text-sm">{useDateTimeFormat(product.ProductCreationDateAndTime)}</td>
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
      {/* Subscriber start */}
      <div className="my-5 md:my-10 lg:my-20">
        <p className="max-w-2xl text-center my-5 px-5 md:mt-10 lg:mt-24 mx-auto">
          Stay updated with the latest innovations in electrical products and technology! Subscribe to our newsletter and be the first to know about new arrivals, special offers, and industry insights. Join the Electric Museum community today!
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