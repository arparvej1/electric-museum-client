import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';


const ErrorPage = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const localTheme = localStorage.getItem('theme');
    document.querySelector('html').setAttribute('data-theme', localTheme);
    setTheme(localTheme);
  }, [theme])
  return (
    <>
      <Helmet>
        <title> 404 error | Page Not Found! | Electric Museum </title>
      </Helmet>
      <div className="max-w-screen-xl mx-5 lg:mx-auto">
        <div>
          <div className='max-w-7xl mx-2 md:mx-4 lg:mx-auto mt-4 mb-5'>
            <div className='flex flex-col justify-center items-center gap-2 p-4'>
              <img className='max-w-96' src="https://i.ibb.co/zxtRk5z/404-error.png" alt="404 error" />
              <h3 className='font-semibold text-3xl my-5'>Page Not Found! </h3>
              <Link className='btn mx-auto rounded-3xl border-2 border-blue-500 bg-primary hover:bg-white hover:text-black text-primary-content md:text-lg' to='/'>Go Home</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;