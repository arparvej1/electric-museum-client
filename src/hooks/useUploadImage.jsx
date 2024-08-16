import useAxiosPublic from "./useAxiosPublic";


const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const useUploadImage = () => {
  const axiosPublic = useAxiosPublic();

  const uploadImage_imgbb = async (uploadImage) => {
    const data = uploadImage.files[0];
    console.log(data)
    // image upload to imgbb and then get an url
    const imageFile = { image: data }
    const res = await axiosPublic.post(image_hosting_api, imageFile, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    });
    if (!res.data.success) {
      return false
    }
    // console.log('with image url', res.data);
    return res.data.data.display_url;
  };
  return uploadImage_imgbb;
};

export default useUploadImage;