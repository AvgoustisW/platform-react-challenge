import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/router/Layout";
import Home from "@/pages/Home";
import Breeds from "@/pages/Breeds";
import Breed from "@/pages/Breed";
import Favorites from "./pages/Favorites";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			refetchOnWindowFocus: false,
		},
	},
});

const App: React.FC = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Home />} />
						<Route path="breeds" element={<Breeds />} />
						<Route path="breeds/:breedId" element={<Breed />} />
						<Route path="favorites" element={<Favorites />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	);
};

export default App;
