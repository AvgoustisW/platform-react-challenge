import { useState, useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { createSearchParams, useLocation, useSearchParams } from "react-router-dom";
import CatDetailsModal from "@/components/Cat/CatDetailsModal";
import { fetchRandomCats, fetchCatById, CatImage, CatQueryKeys } from "@/services/cats/catApi";
import CatGrid from "../components/Cat/CatGrid";
import LoadMore from "../components/Cat/LoadMore";
import { useFavorites } from "@/hooks/useFavorites";
import LoaderGeneral from "@/components/LoaderGeneral";
import ErrorGeneral from "@/components/ErrorGeneral";

const Home = () => {
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const [selectedCat, setSelectedCat] = useState<CatImage | undefined>(undefined);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const catIdFromUrl = searchParams.get("catId");

	const { addFavorite, removeFavorite } = useFavorites();

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteQuery({
		queryKey: [CatQueryKeys.CATS],
		queryFn: ({ pageParam = 0 }) => fetchRandomCats(10, pageParam),
		getNextPageParam: (_, allPages) => allPages.length,
		initialPageParam: 0,
	});

	const allCats = data?.pages.flat() || [];
	const existingCat = catIdFromUrl ? allCats.find((cat) => cat.id === catIdFromUrl) : undefined;

	const { data: catDetails, isLoading: isLoadingCatDetails } = useQuery({
		queryKey: [CatQueryKeys.CAT, catIdFromUrl],
		queryFn: () => fetchCatById(catIdFromUrl || ""),
		enabled: !!catIdFromUrl && !existingCat,
	});

	const handleCatSelect = (cat: CatImage) => {
		setSelectedCat(cat);
		setIsModalOpen(true);
		setSearchParams({ catId: cat.id });
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		setSearchParams({});
	};

	const handleAddToFavorites = () => {
		if (selectedCat) addFavorite(selectedCat.id);
	};

	const handleRemoveFromFavorites = () => {
		if (selectedCat) removeFavorite(selectedCat.id);
	};

	useEffect(() => {
		// This effect run only if we have a catIdFromUrl and catDetails from the get catById present
		// in case we want to share a cat that does not exist in the initial random cat data
		if (catIdFromUrl && catDetails?.id === catIdFromUrl) {
			setSelectedCat(catDetails);
			setIsModalOpen(true);
		}
	}, [catIdFromUrl, catDetails]);

	const shareUrl = selectedCat
		? `${window.location.origin}${location.pathname}?${createSearchParams({
				catId: selectedCat.id,
		  })}`
		: undefined;

	if (isLoading) return <LoaderGeneral />;
	if (error) return <ErrorGeneral text="Failed to load cats" />;

	return (
		<>
			<h1 className="text-3xl font-bold mb-8 text-primary">Cats</h1>

			<CatGrid cats={allCats} onCatSelect={handleCatSelect} />

			<LoadMore onLoadMore={() => fetchNextPage()} hasMore={!!hasNextPage} isLoading={isFetchingNextPage} />

			{selectedCat && (
				<CatDetailsModal
					cat={selectedCat}
					isOpen={isModalOpen}
					onClose={handleModalClose}
					onFavorite={handleAddToFavorites}
					onRemove={selectedCat.id ? handleRemoveFromFavorites : undefined}
					isLoading={isLoadingCatDetails}
					shareUrl={shareUrl}
				/>
			)}
		</>
	);
};

export default Home;
