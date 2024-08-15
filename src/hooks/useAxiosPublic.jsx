import axios from "axios";

const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_VERCEL_API
})

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;