import React, { useEffect, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import CatCard from "@/components/Cat/CatCard";
import { CatImage } from "@/services/cats/catApi";
import { useFavorites } from "@/hooks/useFavorites";

interface CatGridProps {
	cats: CatImage[];
	onCatSelect: (cat: CatImage) => void;
}

const CatGrid: React.FC<CatGridProps> = ({ cats, onCatSelect }) => {
	const { addFavorite, removeFavorite, isFavorite: isFavoriteCat } = useFavorites();
	const [columnCount, setColumnCount] = useState(getColumnCount());

	// Calculate number of columns based on screen width
	function getColumnCount() {
		if (typeof window === "undefined") return 1;
		const width = window.innerWidth;
		if (width < 640) return 1; // sm breakpoint
		if (width < 768) return 2; // md breakpoint
		if (width < 1024) return 3; // lg breakpoint
		return 4;
	}

	useEffect(() => {
		const handleResize = () => {
			setColumnCount(getColumnCount());
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const rowCount = Math.ceil(cats.length / columnCount);

	// Initialize virtualizer using the window as the scroll container
	const rowVirtualizer = useWindowVirtualizer({
		count: rowCount,
		estimateSize: () => 300, // estimated row height in pixels
		overscan: 5, // number of items to render before/after visible window
	});

	const handleToggleFavorite = (id: string, isFavorite: boolean) => {
		if (isFavorite) {
			removeFavorite(id);
		} else {
			addFavorite(id);
		}
	};

	return (
		<div className="w-full">
			<div
				style={{
					height: `${rowVirtualizer.getTotalSize()}px`,
					width: "100%",
					position: "relative",
				}}
			>
				{rowVirtualizer.getVirtualItems().map((virtualRow) => {
					const rowStartIndex = virtualRow.index * columnCount;

					return (
						<div
							key={virtualRow.index}
							className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 absolute w-full"
							style={{
								transform: `translateY(${virtualRow.start}px)`,
							}}
						>
							{Array.from({ length: columnCount }).map((_, columnIndex) => {
								const catIndex = rowStartIndex + columnIndex;
								const cat = cats[catIndex];

								if (!cat) return null;

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
				})}
			</div>
		</div>
	);
};

export default CatGrid;
