import { NavLink } from "react-router-dom";
import { Cat, PawPrint, Heart } from "lucide-react";

const Navigation = () => {
	return (
		<nav className="fixed top-0 left-0 right-0 flex justify-center items-center bg-background/95 backdrop-blur-sm z-50 border-b-3 border-primary py-3">
			<div className="flex items-center space-x-2 px-4">
				<NavLink
					to="/"
					className={({ isActive }) =>
						`flex items-center px-4 py-2 rounded-md transition-colors ${
							isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
						}`
					}
				>
					<Cat className="mr-2 h-4 w-4" />
					<span>Random Cats</span>
				</NavLink>

				<NavLink
					to="/breeds"
					className={({ isActive }) =>
						`flex items-center px-4 py-2 rounded-md transition-colors ${
							isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
						}`
					}
				>
					<PawPrint className="mr-2 h-4 w-4" />
					<span>Breeds</span>
				</NavLink>

				<NavLink
					to="/favorites"
					className={({ isActive }) =>
						`flex items-center px-4 py-2 rounded-md transition-colors ${
							isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
						}`
					}
				>
					<Heart className="mr-2 h-4 w-4" />
					<span>Favorites</span>
				</NavLink>
			</div>
		</nav>
	);
};

export default Navigation;
