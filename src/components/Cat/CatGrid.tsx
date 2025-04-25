import React from "react";
import CatCard from "@/components/Cat/CatCard";
import { CatImage } from "@/services/cats/catApi";
import { useFavorites } from "@/hooks/useFavorites";

interface CatGridProps {
	cats: CatImage[];
	onCatSelect: (cat: CatImage) => void;
}

const CatGrid: React.FC<CatGridProps> = ({ cats, onCatSelect }) => {
	const { addFavorite, removeFavorite, isFavorite: isFavoriteCat } = useFavorites();

	const handleToggleFavorite = (id: string, isFavorite: boolean) => {
		if (isFavorite) {
			removeFavorite(id);
		} else {
			addFavorite(id);
		}
	};
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
			{cats.map((cat) => {
				const isFavorite = isFavoriteCat(cat.id);
				return (
					<CatCard
						key={cat.id}
						cat={cat}
						onClick={() => onCatSelect(cat)}
						onFavorite={() => handleToggleFavorite(cat.id, isFavorite)}
						isFavorite={isFavorite}
					/>
				);
			})}
		</div>
	);
};

export default CatGrid;
