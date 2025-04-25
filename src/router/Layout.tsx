import Navigation from "@/components/Navigation";
import { Outlet } from "react-router-dom";

const Layout = () => {
	return (
		<div className="min-h-screen bg-background flex flex-col bg-cat-pattern">
			<Navigation />

			<main className="flex-grow px-20 mt-26 flex flex-col">
				<Outlet />
			</main>

			<footer className="mt-8 flex items-center justify-center border-t p-4 min-h-[140px]">
				<p className="text-3xl text-center">Dogs 🐕 + 🐶 do not approve of this webapp</p>
			</footer>
		</div>
	);
};

export default Layout;
