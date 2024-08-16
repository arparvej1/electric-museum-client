import { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../provider/AuthProvider';

const Profile = () => {
  const { user, alreadyUpdate, setAlreadyUpdate } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (alreadyUpdate) {
      toast.success('Successfully Update!');
      setAlreadyUpdate(false);
    }
  }, []);

  return (
    <div className='md:4/5 mx-auto mb-5'>
      <Helmet>
        <title> My Profile | Electric Museum </title>
      </Helmet>
      <div className='flex flex-col gap-3'>
        <h3 className='font-bold text-4xl'>My Profile</h3>
        <div className='flex flex-col md:flex-row items-center gap-5 bg-base-200 p-8 rounded-xl'>
          <div className=''>
            <img className='w-32 h-32 rounded-full' src={user?.photoURL || "https://i.ibb.co/ZT5tByN/avatar-15-blue.jpg"} alt={user?.displayName} />
          </div>
          <div className='flex flex-col gap-2'>
            <h3 className='text-xl font-semibold'>{user?.displayName}</h3>
            <p>{user?.email}</p>
          </div>
          <div className='text-right  navbar-end'>
            {/* <Link to='/update-profile' className='text-xl font-semibold underline btn btn-ghost text-blue-600'>Edit Profile</Link> */}
          </div>
        </div>
        <div className='grid lg:grid-cols-2 gap-3'>
          {/* ----- Personal Information ------ */}
          <div className='flex flex-col gap-3 md:gap-5 bg-base-200 p-6 md:p-8 rounded-xl'>
            <h3 className='font-semibold text-xl md:text-2xl underline'>Personal Information</h3>
            <div className='flex flex-col gap-3 md:text-xl'>
              <div>
                <p>Full Name:</p>
                <p className=' font-semibold'>{user?.displayName || 'Full Name Not Found!'}</p>
              </div>
              <div>
                <p>Email:</p>
                <p className=' font-semibold'>{user?.email}</p>
              </div>
            </div>
          </div>
          {/* ----- Accounts Information ------ */}
          <div className='flex flex-col  gap-3 md:gap-5 bg-base-200 p-6 md:p-8 rounded-xl'>
            <h3 className='font-semibold text-xl md:text-2xl underline'>Accounts Information</h3>
            <div className='flex flex-col gap-3 md:text-xl'>
              <div>
                <p>Account Creation Date & Time:</p>
                <p className=' font-semibold'>{user?.metadata.creationTime}</p>
              </div>
              <div>
                <p>Last Login:</p>
                <p className=' font-semibold'>{user?.metadata.lastSignInTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;