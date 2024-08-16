import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../provider/AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from "react-hook-form";
import { Helmet } from 'react-helmet-async';
import { CiUser } from "react-icons/ci";
import { MdMailOutline } from "react-icons/md";
import { GoLock } from "react-icons/go";
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import axios from 'axios';
import useUploadImage from '../../../hooks/useUploadImage';


const Register = () => {
  const { user, createUser, updateUserInfo, setAvatarIcon, setLoading, alreadyRegister, setAlreadyRegister, logOut, textDot, setTextDot } = useContext(AuthContext);
  const navigate = useNavigate();
  const [passwordMsg, setPasswordMsg] = useState('');
  const location = useLocation();
  const uploadImage_imgbb = useUploadImage();

  const [passwordShow, setPasswordShow] = useState(false);
  const handlePasswordShow = () => {
    setPasswordShow(!passwordShow);
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    // password validation checking
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setPasswordMsg('Password must be 6+ characters with uppercase & a special character.');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error('Password must contain at least one uppercase letter');
      setPasswordMsg('Password must be 6+ characters with uppercase & a special character.');
      return;
    }

    if (!/[!@#$%^&*()\[\]{};:,<.>=\\|/?`~+\-=_"'!]/.test(password)) {
      toast.error('Password must contain at least one special character');
      setPasswordMsg('Password must be 6+ characters with uppercase & a special character.');
      return;
    }
    
    const uploadImage = form.profilePicture;
    const profilePicture = await uploadImage_imgbb(uploadImage);
    if (!profilePicture) return toast.warning("Your picture can't upload.");

    const newRegister = { name, photo_url: profilePicture, email };

    setPasswordMsg('');

    setTextDot('...');
    console.log("newRegister", newRegister);

    // create user in firebase
    createUser(email, password)
      .then(result => {
        setLoading(true);
        setAlreadyRegister(true);
        // --------- send server start -----
        axios.post(`${import.meta.env.VITE_VERCEL_API}/userRegister`, newRegister)
          .then(function (response) {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
        // --------- send server end -----
        logOut();
        updateUserInfo(result.user, name, profilePicture)
          .then(() => {
            setAvatarIcon(true);
            form.reset();
            setTextDot('');
            console.log('Registration Successfully!');
            navigate(location?.state ? location.state : '/login');
          })
          .catch(error => {
            setTextDot('');
            console.log(error);
          });
      })
      .catch(error => {
        setTextDot('');
        toast.error('Registration failed!');
        console.log(error);
      });
    console.log('Request Registration');
  }

  const { register, setFocus } = useForm()
  useEffect(() => {
    setFocus("fullName")
  }, [setFocus])

  useEffect(() => {
    if (user && !location.state && !alreadyRegister) {
      navigate('/');
    }
  }, [user]);

  return (
    <>
      <Helmet>
        <title> Register | Electric Museum </title>
      </Helmet>

      <div className='flex flex-col md:flex-row max-w-7xl mx-auto mt-8'>
        {/* ------ */}
        <div className='md:w-2/3 lg:w-2/5 rounded-2xl bg-base-200 p-5 md:p-10 md:mx-auto bg-[url("https://wallpapercave.com/wp/wp2939993.jpg")] bg-cover'>
          <h3 className="text-3xl font-semibold mb-6 text-center text-white">
            New Account?
          </h3>
          <form onSubmit={handleRegister} className='flex flex-col gap-3 '>
            <div>
              <span className='text-white'>Full Name:</span>
              <label className="flex items-center input input-bordered gap-3" htmlFor="name">
                <CiUser />
                <input type="text" {...register("fullName")} name='name' placeholder="Full Name" className="w-full" required />
              </label>
            </div>
            <div>
              <span className='text-white'>Profile Picture:</span>
              <label htmlFor="profilePicture">
                <input type="file" name="profilePicture" className="file-input file-input-bordered w-full" required />
              </label>
            </div>
            <div>
              <span className='text-white'>Email:</span>
              <label className="flex items-center input input-bordered gap-3" htmlFor="email">
                <MdMailOutline />
                <input type="email" name='email' placeholder="Email" className="w-full" required />
              </label>
            </div>
            <div>
              <span className='text-white'>Password:</span>
              <label className="flex items-center input input-bordered gap-3" htmlFor="email">
                <GoLock />
                <div className="flex justify-between items-center w-full bg-transparent">
                  <input type={passwordShow ? 'text' : 'password'} name='password' placeholder="Password" className="w-full" required /><span onClick={handlePasswordShow}>{passwordShow ? <VscEye /> : <VscEyeClosed />}</span>
                </div>
              </label>
              {
                !passwordMsg == '' ?
                  <p className='mt-2 bg-blue-300 bg-opacity-75 p-3 rounded-2xl text-red-500'>{passwordMsg}</p> : undefined
              }
            </div>
            <div>
              <input type="submit" value={`Register${textDot}`} className="btn btn-accent w-full font-semibold text-xl" />
            </div>
          </form>
          <div className="mt-4 text-sm text-gray-300 text-center">
            <p>
              Already have an account?{" "}
              <Link state={location?.state} to='/login' className="text-gray-200 font-semibold hover:underline">Login here</Link>
            </p>
          </div>
        </div>
      </div>
      <div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Register;