import { useContext } from "react";
import { FaGithub, FaYoutube, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../../provider/AuthProvider";

const Footer = () => {
  const { user } = useContext(AuthContext);
  return (
    <footer className="p-10 bg-base-200 text-base-content rounded">
      <div className="max-w-screen-xl mx-5 xl:px-5 2xl:px-0 xl:mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 text-center md:text-start gap-3">
          <div className="flex flex-col gap-2 md:col-span-2">
            <p className="font-semibold">Office Address:</p>
            <p className="md:w-3/4">
              <strong>Electric Museum Headquarters</strong> <br />
              Bhai Bhai Market,
              Jalal Shopping er Uddar Pase,
              Board Bazar, Gazipur.
            </p>
            <p>Phone: 01407067103</p>
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <p className="font-semibold">Useful Links</p>
            <nav className="flex flex-col gap-2">
              <Link to='/' className="link-hover">Home</Link>
              {!user ?
                <Link to='/register' className="link-hover">Register</Link>
                : <Link to='/profile' className="link-hover">Profile</Link>}
            </nav>
          </div>
          <div className="flex flex-col text-center md:text-start gap-2 md:col-span-1">
            <p className="font-semibold">Follow Us</p>
            <div className="flex justify-center md:justify-start gap-5">
              <Link><FaYoutube className="text-2xl text-[#FF0000]" /></Link>
              <Link><FaGithub className="text-2xl" /></Link>
              <Link><FaTwitter className="text-2xl text-[#1DA1F2]" /></Link>
            </div>
          </div>
        </div>
      </div>
      <aside className="text-center mt-5 md:mt-10">
        <p>Copyright © 2024 - All right reserved by <Link to='/'><strong>Electric Museum</strong></Link></p>
      </aside>
    </footer>
  );
};

export default Footer;