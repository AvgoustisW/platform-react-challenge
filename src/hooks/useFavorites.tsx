import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	fetchFavorites,
	addToFavorites,
	removeFromFavorites,
	Favorite,
	CatImage,
	SUB_ID,
	CatQueryKeys,
} from "@/services/cats/catApi";

export const useFavorites = () => {
	const queryClient = useQueryClient();

	const favoritesQuery = useQuery({
		queryKey: [CatQueryKeys.FAVORITES],
		queryFn: fetchFavorites,
	});

	// Helper function to check if a cat is favorited
	const isFavorite = (imageId: string): boolean => {
		const favorites = queryClient.getQueryData<Favorite[]>([CatQueryKeys.FAVORITES]) || [];
		return favorites.some((fav) => fav.image_id === imageId);
	};

	const getFavoriteId = (imageId: string): number | null => {
		const favorites = queryClient.getQueryData<Favorite[]>([CatQueryKeys.FAVORITES]) || [];
		const favorite = favorites.find((fav) => fav.image_id === imageId);
		return favorite ? favorite.id : null;
	};

	// TODO race conditioning
	const addFavoriteMutation = useMutation({
		mutationFn: (id: string) => addToFavorites(id),
		onMutate: async (id) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: [CatQueryKeys.FAVORITES] });

			// Snapshot the previous value
			const previousFavorites = queryClient.getQueryData<Favorite[]>([CatQueryKeys.FAVORITES]) || [];

			const cat = queryClient.getQueryData<CatImage>([CatQueryKeys.CAT, id]);

			// Create an optimistic favorite
			const optimisticFavorite: Favorite = {
				id: Date.now(), // Temporary ID
				image_id: id,
				sub_id: SUB_ID,
				created_at: new Date().toISOString(),
				image: cat as CatImage,
			};

			// Optimistically update the favorites list
			queryClient.setQueryData<Favorite[]>([CatQueryKeys.FAVORITES], [...previousFavorites, optimisticFavorite]);
			// Return the previous favorites for potential rollback
			return { previousFavorites };
		},
		onError: (err, variables, context) => {
			// Show a toast message here
			console.error(err, variables, context);
			if (context?.previousFavorites) {
				queryClient.setQueryData([CatQueryKeys.FAVORITES], context.previousFavorites);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [CatQueryKeys.FAVORITES] });
		},
	});

	// TODO race conditioning
	const removeFavoriteMutation = useMutation({
		mutationFn: async (variables: { imageId: string; favoriteId: number }) => {
			const { favoriteId } = variables;

			return removeFromFavorites(favoriteId.toString());
		},
		onMutate: async (variables: { imageId: string; favoriteId: number }) => {
			const { imageId } = variables;

			await queryClient.cancelQueries({ queryKey: [CatQueryKeys.FAVORITES] });

			const previousFavorites = queryClient.getQueryData<Favorite[]>([CatQueryKeys.FAVORITES]) || [];

			queryClient.setQueryData<Favorite[]>(
				[CatQueryKeys.FAVORITES],
				previousFavorites.filter((fav) => fav.image_id !== imageId)
			);

			return { previousFavorites };
		},
		onError: (err, variables, context) => {
			// Show a toast message here
			console.error(err, variables, context);
			if (context?.previousFavorites) {
				queryClient.setQueryData([CatQueryKeys.FAVORITES], context.previousFavorites);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [CatQueryKeys.FAVORITES] });
		},
	});

	const removeFavorite = (imageId: string) => {
		const favoriteId = getFavoriteId(imageId);
		if (!favoriteId) {
			console.error(`No favorite found with image ID: ${imageId}`);
			return;
		}

		removeFavoriteMutation.mutate({ imageId, favoriteId });
	};

	return {
		favorites: favoritesQuery.data || [],
		isLoading: favoritesQuery.isLoading,
		isLoadingFavoriteMutation: addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
		error: favoritesQuery.error,
		isFavorite,
		addFavorite: addFavoriteMutation.mutate,
		removeFavorite,
		isPending: addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
	};
};
