import {
  createBrowserRouter,
} from "react-router-dom";
import Root from "../layouts/Root";
import Home from "../pages/Home/Home";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Login from "../pages/User/Login/Login";
import Register from "../pages/User/Register/Register";
import Profile from "../pages/User/Profile/Profile";
import PrivateRoutes from "../PrivateRoutes/PrivateRoutes";
import DetailsProduct from "../pages/Products/DetailsProduct";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: '/',
        element: <Home></Home>
      },
      {
        path: '/login',
        element: <Login></Login>
      },
      {
        path: '/product/:productId',
        element: <DetailsProduct></DetailsProduct>,
        loader: ({ params }) => fetch(`${import.meta.env.VITE_VERCEL_API}/product/${params.productId}`)
      },
      {
        path: '/register',
        element: <Register></Register>
      },
      {
        path: '/profile',
        element: <PrivateRoutes><Profile></Profile></PrivateRoutes>
      },
    ]
  }
]);

export default router;
