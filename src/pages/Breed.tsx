import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import CatDetailsModal from "@/components/Cat/CatDetailsModal";
import {
	fetchCatBreeds,
	fetchCatsByBreed,
	fetchCatById,
	CatImage,
	CatBreed,
	CatQueryKeys,
} from "@/services/cats/catApi";
import { useFavorites } from "@/hooks/useFavorites";
import LoaderGeneral from "@/components/LoaderGeneral";
import ErrorGeneral from "@/components/ErrorGeneral";
import CatGrid from "@/components/Cat/CatGrid";

const Breed = () => {
	const { breedId } = useParams<{ breedId: string }>();
	const navigate = useNavigate();
	const [selectedBreed, setSelectedBreed] = useState<CatBreed | null>(null);
	const [selectedCat, setSelectedCat] = useState<CatImage | undefined>(undefined);
	const [searchParams, setSearchParams] = useSearchParams();
	const catIdFromUrl = searchParams.get("catId");

	const { addFavorite, removeFavorite, isFavorite } = useFavorites();

	const {
		data: breeds,
		isLoading: isLoadingBreeds,
		error: breedsError,
	} = useQuery({
		queryKey: [CatQueryKeys.BREEDS],
		queryFn: fetchCatBreeds,
	});

	const { data: breedCats, isLoading: isLoadingBreedCats } = useQuery({
		queryKey: [CatQueryKeys.BREED_CATS, breedId],
		queryFn: () => fetchCatsByBreed(breedId || ""),
		enabled: !!breedId,
	});

	const { data: catDetails, isLoading: isLoadingCatDetails } = useQuery({
		queryKey: [CatQueryKeys.CAT, catIdFromUrl],
		queryFn: () => fetchCatById(catIdFromUrl || ""),
		enabled: !!catIdFromUrl && !(breedCats || []).some((cat) => cat.id === catIdFromUrl),
	});

	useEffect(() => {
		if (breedId && breeds) {
			const foundBreed = breeds.find((breed) => breed.id === breedId);
			if (foundBreed) {
				setSelectedBreed(foundBreed);
			}
		}
	}, [breedId, breeds]);

	useEffect(() => {
		if (catIdFromUrl) {
			// First check if the cat is in the breedCats list
			const catFromList = breedCats?.find((cat) => cat.id === catIdFromUrl);

			if (catFromList) {
				setSelectedCat(catFromList);
			} else if (catDetails?.id === catIdFromUrl) {
				// If not in list but we have fetched it separately
				setSelectedCat(catDetails);
			}
		}
	}, [catIdFromUrl, breedCats, catDetails]);

	const handleCatSelect = (cat: CatImage) => {
		setSelectedCat(cat);
		setSearchParams({ catId: cat.id });
	};

	const handleCatModalClose = () => {
		setSelectedCat(undefined);
		setSearchParams({});
	};

	const handleToggleFavorite = (id: string) => {
		if (isFavorite(id)) {
			removeFavorite(id);
		} else {
			addFavorite(id);
		}
	};

	const shareUrl = selectedCat ? `${window.location.origin}/breeds/${breedId}?catId=${selectedCat.id}` : undefined;

	if (isLoadingBreeds) return <LoaderGeneral />;
	if (breedsError) return <ErrorGeneral text="Failed to load breed information" />;
	if (!selectedBreed) return <ErrorGeneral text="Breed not found" />;

	return (
		<>
			<div className="mb-6 gap-4 flex flex-col-reverse items-center justify-between md:flex-row">
				<div>
					<h2 className="text-2xl font-semibold text-primary">{selectedBreed.name}</h2>
					<p className="text-muted-foreground">Origin: {selectedBreed.origin}</p>
				</div>
				<Button
					onClick={() => {
						navigate("/breeds");
					}}
				>
					← Back to Breeds
				</Button>
			</div>

			<div className="mb-6">
				<p className="mb-4">{selectedBreed.description}</p>
				<div className="flex flex-wrap gap-4 text-sm">
					<span>
						<strong>Temperament:</strong> {selectedBreed.temperament}
					</span>
					<span>
						<strong>Life Span:</strong> {selectedBreed.life_span} years
					</span>
					<span>
						<strong>Weight:</strong> {selectedBreed.weight.metric} kg
					</span>
					{selectedBreed.wikipedia_url && (
						<a
							href={selectedBreed.wikipedia_url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:underline flex items-center"
						>
							<Info className="h-4 w-4 mr-1" />
							More on Wikipedia
						</a>
					)}
				</div>
			</div>

			{isLoadingBreedCats ? (
				<div className="flex justify-center items-center h-64">
					<LoaderGeneral />
				</div>
			) : breedCats && breedCats.length > 0 ? (
				<CatGrid cats={breedCats} onCatSelect={handleCatSelect} />
			) : (
				<p className="text-center py-12 text-muted-foreground">No images found for this breed.</p>
			)}

			{selectedCat && (
				<CatDetailsModal
					cat={selectedCat}
					isOpen={!!selectedCat}
					onClose={handleCatModalClose}
					onFavorite={() => handleToggleFavorite(selectedCat.id)}
					onRemove={isFavorite(selectedCat.id) ? () => handleToggleFavorite(selectedCat.id) : undefined}
					isLoading={isLoadingCatDetails}
					shareUrl={shareUrl}
				/>
			)}
		</>
	);
};

export default Breed;
