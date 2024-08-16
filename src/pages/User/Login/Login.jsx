import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaGithub } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from "react-hook-form";
import { Helmet } from 'react-helmet-async';
import { FcGoogle } from 'react-icons/fc';
import { GoLock } from 'react-icons/go';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { MdMailOutline } from 'react-icons/md';
import { AuthContext } from '../../../provider/AuthProvider';
import axios from 'axios';

const Login = () => {
  const { user, signInUser, signInWithGoogle, registerCheck, setAlreadyLogin, textDot, setTextDot } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loginFailedMsg, setLoginFailedMsg] = useState('');
  const location = useLocation();

  const { register, setFocus } = useForm();
  useEffect(() => {
    setFocus("focusEmail");
  }, [setFocus]);

  useEffect(() => {
    registerCheck();
    if (user && !location.state) {
      navigate('/');
    }
  }, [user]);

  const [passwordShow, setPasswordShow] = useState(false);
  const handlePasswordShow = () => {
    setPasswordShow(!passwordShow);
  }

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setTextDot('...');

    // create user in firebase
    signInUser(email, password)
      .then(result => {
        console.log(result.user.email);
        console.log('Successfully Login!');
        e.target.reset();
        setLoginFailedMsg('');
        setAlreadyLogin(true);
        setTextDot('');
        navigate(location?.state ? location.state : '/');
      })
      .catch(error => {
        console.log(error);
        toast.error('Email & Password Not Match!');
        setLoginFailedMsg('Please enter correct Email & Password.');
        setTextDot('');
      });
  }

  const handleLoginWithGoogle = () => {
    signInWithGoogle()
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        console.log(result);
        console.log('Login Success!');
        setAlreadyLogin(true);
        navigate(location?.state ? location.state : '/');
        checkEmailExists(email) // Check if the email already exists in the database
          .then(emailExists => {
            if (!emailExists) {
              // If email does not exist, add the user to the database
              const userData = { email, name: displayName, photo_url: photoURL };
              addUserToDatabase(userData);
            } else {
              console.log('Email already exists in the database. Skipping user addition.');
            }
          })
          .catch(error => {
            console.error('Error checking if email exists:', error);
          });
      })
      .catch(error => {
        console.error('Google sign-in failed:', error);
      });
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_VERCEL_API}/checkEmail/${email}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking if email exists:', error);
      throw error;
    }
  };

  const addUserToDatabase = (userData) => {
    // --------- send server start -----
    axios.post(`${import.meta.env.VITE_VERCEL_API}/userRegister`, userData)
      .then(function (response) {
        console.log('User added to the database:', response.data);
      })
      .catch(function (error) {
        console.error('Error adding user to the database:', error);
      });
    // --------- send server end -----
  };

  return (
    <>
      <Helmet>
        <title> Login | ElectricMuseum </title>
      </Helmet>
      <div className='flex flex-col md:flex-row max-w-7xl mx-auto mt-8'>
        <div className='hidden md:block'>
        </div>
        {/* ------ */}
        <div className='md:w-2/3 lg:w-2/5 rounded-2xl bg-base-200 p-5 md:p-10 md:mx-auto bg-[url("https://wallpapercave.com/wp/wp2939993.jpg")] bg-cover'>
          <h3 className="text-3xl font-semibold mb-6 text-center text-white">
            Login Now!
          </h3>
          <form onSubmit={handleLogin} className='flex flex-col gap-3 '>
            <div>
              <span className='text-white'>Email:</span>
              <label className="flex items-center input input-bordered gap-3" htmlFor="email">
                <MdMailOutline />
                <input type="email" {...register("focusEmail")} name='email' placeholder="Email" className="w-full" required />
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
              <p className='pt-1 text-red-500'>{loginFailedMsg}</p>
            </div>
            <div>
              <input type="submit" value={`Login${textDot}`} className="btn btn-accent w-full  font-semibold text-xl" />
            </div>
          </form>
          <div className="mt-4 text-sm text-gray-300 text-center">
            <p>
              New user?{" "}
              <Link state={location?.state} to='/register' className="font-semibold hover:underline">Register here</Link>
            </p>
          </div>
          <div className="text-sm text-gray-300 text-center">
            <div className="divider">OR</div>
          </div>
          <div>
            <h3 className='text-center text-gray-200'>Join with social accounts.</h3>
            <div className="mt-4 flex flex-wrap gap-3 items-center justify-center">
              <div>
                <button
                  onClick={handleLoginWithGoogle}
                  className="flex gap-2 btn border border-gray-200 bg-white"
                >
                  <FcGoogle className='text-2xl' />
                  Google
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;