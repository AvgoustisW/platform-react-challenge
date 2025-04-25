import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import CatDetailsModal from "@/components/Cat/CatDetailsModal";
import { fetchCatById, CatImage, CatQueryKeys } from "@/services/cats/catApi";
import { useFavorites } from "@/hooks/useFavorites";
import LoaderGeneral from "@/components/LoaderGeneral";
import ErrorGeneral from "@/components/ErrorGeneral";
import CatGrid from "@/components/Cat/CatGrid";

const Favorites = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [selectedCat, setSelectedCat] = useState<CatImage | undefined>(undefined);
	const navigate = useNavigate();
	const catIdFromUrl = searchParams.get("catId");

	const { favorites, isLoading, error, removeFavorite } = useFavorites();

	const { data: catDetails, isLoading: isLoadingCatDetails } = useQuery({
		queryKey: [CatQueryKeys.CAT, catIdFromUrl],
		queryFn: () => fetchCatById(catIdFromUrl || ""),
		enabled: !!catIdFromUrl,
	});

	const handleCatSelect = (cat: CatImage) => {
		setSelectedCat(cat);
		setSearchParams({ catId: cat.id });
	};

	const handleModalClose = () => {
		setSelectedCat(undefined);
		setSearchParams({});
	};

	const handleRemoveFavorite = (id: string) => {
		removeFavorite(id);
		if (selectedCat && selectedCat.id === id) {
			handleModalClose();
		}
	};

	useEffect(() => {
		if (catIdFromUrl && catDetails) {
			setSelectedCat(catDetails);
		}
	}, [catIdFromUrl, catDetails]);

	const shareUrl = selectedCat
		? `${window.location.origin}${window.location.pathname}?catId=${selectedCat.id}`
		: undefined;

	if (isLoading) {
		return <LoaderGeneral text="Loading your favorites..." />;
	}

	if (error) {
		return <ErrorGeneral text="Failed to load your favorites" />;
	}

	const favoriteCats = favorites
		.filter((favorite) => Boolean(favorite.image))
		.map((favorite) => favorite.image) as CatImage[];

	if (favoriteCats && favoriteCats.length === 0) {
		return (
			<>
				<h1 className="text-3xl font-bold mb-8 text-primary">Your Favorite Cats</h1>
				<div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
					<Heart className="mx-auto h-12 w-12 text-muted" />
					<p className="mt-4 text-xl text-muted-foreground">You don't have any favorite cats yet.</p>
					<Button className="mt-6" onClick={() => navigate("/")}>
						Find cats to favorite
					</Button>
				</div>
			</>
		);
	}

	return (
		<>
			<h1 className="text-3xl font-bold mb-8 text-primary">Your Favorite Cats</h1>
			<CatGrid cats={favoriteCats} onCatSelect={handleCatSelect} />

			{selectedCat && (
				<CatDetailsModal
					cat={selectedCat}
					isOpen={!!selectedCat}
					onClose={handleModalClose}
					onFavorite={() => handleRemoveFavorite(selectedCat.id)}
					onRemove={() => handleRemoveFavorite(selectedCat.id)}
					isLoading={isLoadingCatDetails}
					shareUrl={shareUrl}
				/>
			)}
		</>
	);
};

export default Favorites;
