import React, { memo } from "react";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CatImage } from "@/services/cats/catApi";

interface CatCardProps {
	cat: CatImage;
	onClick: () => void;
	onFavorite: (id: string) => void;
	isFavorite: boolean;
	isLoading?: boolean;
}

const CatCard: React.FC<CatCardProps> = memo(
	({ cat, onClick, onFavorite, isFavorite, isLoading }) => {
		const handleActionClick = (e: React.MouseEvent) => {
			e.stopPropagation();
			onFavorite(cat.id);
		};

		return (
			<Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer rounded-sm">
				<CardContent className="p-0 relative">
					<img
						src={cat.url}
						alt={cat.breeds && cat.breeds.length > 0 ? cat.breeds[0].name : "Cat"}
						className="w-full h-60 object-cover"
						onClick={onClick}
					/>

					<Button
						size="icon"
						variant={`${isFavorite ? "default" : "outline"}`}
						className="absolute top-2 right-2"
						onClick={isLoading ? undefined : handleActionClick}
						disabled={isLoading}
					>
						<Heart className={`h-5 w-5`} />
					</Button>
				</CardContent>
			</Card>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.cat.id === nextProps.cat.id &&
			prevProps.cat.url === nextProps.cat.url &&
			prevProps.isFavorite === nextProps.isFavorite &&
			prevProps.isLoading === nextProps.isLoading
		);
	}
);

export default CatCard;
