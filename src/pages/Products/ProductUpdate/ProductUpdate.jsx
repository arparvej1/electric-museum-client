import axios from 'axios';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useUploadImage from '../../../hooks/useUploadImage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ProductUpdate = ({ product }) => {
  const {
    _id,
    ProductName,
    BrandName,
    ProductImage,
    Description,
    Price,
    Category,
    Ratings,
    ProductCreationDateAndTime
  } = product;

  // --------- copy -------------
  const [copyMessage, setCopyMessage] = useState('');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyMessage('Copied!');
      setTimeout(() => setCopyMessage(''), 2000); // Clear the message after 2 seconds
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  // Inline styles
  const containerStyle = {
    position: 'relative'
  };

  const buttonStyle = {
    color: 'red',
    cursor: 'pointer'
  };

  const copyMessageStyle = {
    position: 'absolute',
    top: '-30px', // Position above the button
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '3px',
    fontSize: '14px',
    visibility: copyMessage ? 'visible' : 'hidden',
    opacity: copyMessage ? 1 : 0,
    transition: 'opacity 0.5s'
  };
  // ----- end copy ----------

  const uploadImage_imgbb = useUploadImage();

  const handleUpdatePicture = async (e) => {
    e.preventDefault();
    const form = e.target;

    const uploadImage = form.productPicture;
    const productPicture = await uploadImage_imgbb(uploadImage);
    if (!productPicture) return toast.warning("Your picture can't upload.");

    const uploadPicture = { newPicture: productPicture };

    // console.log("uploadPicture", uploadPicture);

    // --------- send server start -----
    axios.put(`${import.meta.env.VITE_VERCEL_API}/newPicture/${_id}`, uploadPicture)
      .then(function (response) {
        console.log(response.data);
        if (response.data.modifiedCount) {
          setNewPic(productPicture);
          toast.success("Upload Successfully.");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    // --------- send server end -----
  };

  return (
    <div>
      {/* ----- end start ---------- */}
      <div style={containerStyle}>
        <button
          style={buttonStyle}
          onClick={() => copyToClipboard(ProductName + ", " + BrandName)}
        >
          {ProductName}, {BrandName}
        </button>
        <div style={copyMessageStyle}>
          {copyMessage}
        </div>
      </div>
      {/* ----- end copy ---------- */}
      {/* ------ change picture start ----- */}
      <div>
        <form onSubmit={handleUpdatePicture} className='flex flex-col gap-3 '>
          <div>
            <span>Update Picture:</span>
            <label htmlFor="productPicture">
              <input type="file" name="productPicture" className="file-input file-input-bordered w-full" required />
            </label>
          </div>
          <div>
            <input type="submit" value={`Update Picture`} className="btn btn-accent w-full font-semibold text-xl" />
          </div>
        </form>
      </div>
      {/* ------ change picture end ----- */}
      <ToastContainer />
    </div>
  );
};

ProductUpdate.propTypes = {
  product: PropTypes.object
};

export default ProductUpdate;