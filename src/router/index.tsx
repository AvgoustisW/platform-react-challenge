import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/router/layouts/Layout";
import Home from "@/pages/Home";
import Breeds from "@/pages/Breeds";
import Breed from "@/pages/Breed";
import Favorites from "@/pages/Favorites";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: "breeds",
				element: <Breeds />,
			},
			{
				path: "breeds/:breedId",
				element: <Breed />,
			},
			{
				path: "favorites",
				element: <Favorites />,
			},
		],
	},
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
