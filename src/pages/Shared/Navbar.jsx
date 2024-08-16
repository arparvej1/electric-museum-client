import { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../../provider/AuthProvider';
import { RxAvatar } from "react-icons/rx";
import { FaSignOutAlt } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";

const Navbar = () => {
  const { user, logOut, avatarIcon } = useContext(AuthContext);
  const location = useLocation();

  // -------- theme start -----------------
  const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const localTheme = localStorage.getItem('theme');
    document.querySelector('html').setAttribute('data-theme', localTheme);
    setTheme(localTheme);
  }, [theme])

  const handleTheme = e => {
    if (e.target.checked) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };
  // -------- theme end -----------------

  const handleLogOut = () => {
    logOut()
      .then(console.log('Successfully LogOut.'))
      .catch(error => console.log(error))
  }
  const navLinks = <>
    {
      location.pathname === "/" ? <></> : <li><NavLink to='/'>Home</NavLink></li>
    }
    {/* <li><NavLink to='/all-products'>All Products</NavLink></li> */}
  </>
  const pNavLinks = <>
    {
      user && <>
        <li><NavLink to='/profile'>Profile</NavLink></li>
      </>
    }
  </>

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow bg-base-100 rounded-box w-52">
            {navLinks}
          </ul>
        </div>
        <Link to='/' className="btn bg-gradient-to-r from-sky-400 to-blue-500 text-xl md:text-2xl text-white">ElectricMuseum</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-lg">
          {navLinks}
        </ul>
      </div>
      <div className="navbar-end">
        {
          user ?
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <div data-tooltip-id="my-tooltip-1" style={{ backgroundColor: "#999" }}>
                    <img alt={user.email} src={user.photoURL || (avatarIcon && "https://i.ibb.co/ZT5tByN/avatar-15-blue.jpg")} />
                  </div>
                </div>
              </div>
              <ReactTooltip
                id="my-tooltip-1"
                className='z-50'
                place="bottom"
                content={user.displayName || user.email}
              />
              <ul tabIndex={0} className="mt-3 z-[50] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li className='my-2'>
                  {user.email}
                </li>
                {pNavLinks}
                <li><span onClick={handleLogOut}>LogOut
                  <span className="badge"><FaSignOutAlt /></span>
                </span></li>
              </ul>
            </div>
            :
            <Link to='/login' className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-9 rounded-full">
                  <RxAvatar className='text-4xl' />
                </div>
              </div>
            </Link>
        }
        <div className='hidden md:block'>
          {
            user ? <span onClick={handleLogOut} className='ml-2 btn md:text-lg'>LogOut <FaSignOutAlt /></span> : <Link className='btn md:text-lg' to='/login'>Login</Link>
          }
        </div>
        {/* --------- theme start -------- */}
        <label className="ml-2 cursor-pointer grid place-items-center">
          <input
            type="checkbox"
            onChange={handleTheme}
            checked={theme === 'light' ? false : true}
            className="toggle theme-controller bg-base-content row-start-1 col-start-1 col-span-2" />
          <svg className="col-start-1 row-start-1 stroke-base-100 fill-base-100" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
          <svg className="col-start-2 row-start-1 stroke-base-100 fill-base-100" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        </label>
        {/* --------- theme end -------- */}
      </div>
    </div>
  );
};

export default Navbar;