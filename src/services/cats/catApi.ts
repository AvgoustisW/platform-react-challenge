export interface CatImage {
	id: string;
	url: string;
	width: number;
	height: number;
	breeds?: CatBreed[];
}

export interface CatBreed {
	id: string;
	name: string;
	temperament: string;
	origin: string;
	description: string;
	life_span: string;
	weight: {
		imperial: string;
		metric: string;
	};
	wikipedia_url?: string;
}

export interface Favorite {
	id: number;
	image_id: string;
	sub_id?: string;
	created_at: string;
	image?: CatImage;
}

const API_URL = import.meta.env.VITE_CAT_API_URL;
const API_KEY = import.meta.env.VITE_CAT_API_KEY;
export const SUB_ID = import.meta.env.VITE_CAT_SUB_ID;

const fetchFromCatApi = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
	const headers = new Headers(options.headers);
	headers.set("x-api-key", API_KEY);

	if (options.method === "POST" && !headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json");
	}

	const response = await fetch(`${API_URL}${endpoint}`, {
		...options,
		headers,
	});

	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}

	return response.json();
};

export const fetchRandomCats = (limit: number = 10, page: number = 0): Promise<CatImage[]> => {
	return fetchFromCatApi<CatImage[]>(`/images/search?limit=${limit}&page=${page}&has_breeds=1`);
};

export const fetchCatBreeds = (): Promise<CatBreed[]> => {
	return fetchFromCatApi<CatBreed[]>("/breeds");
};

export const fetchCatById = (id: string): Promise<CatImage> => {
	return fetchFromCatApi<CatImage>(`/images/${id}`);
};

export const fetchCatsByBreed = (breedId: string, limit: number = 10): Promise<CatImage[]> => {
	return fetchFromCatApi<CatImage[]>(`/images/search?breed_ids=${breedId}&limit=${limit}`);
};

export const fetchFavorites = (): Promise<Favorite[]> => {
	return fetchFromCatApi<Favorite[]>(`/favourites?attach_image=1&sub_id=${SUB_ID}`);
};

export const addToFavorites = (imageId: string): Promise<{ id: number }> => {
	return fetchFromCatApi<{ id: number }>("/favourites", {
		method: "POST",
		body: JSON.stringify({
			image_id: imageId,
			sub_id: SUB_ID,
		}),
	});
};

export const removeFromFavorites = (favouriteId: string): Promise<{ message: string }> => {
	return fetchFromCatApi<{ message: string }>(`/favourites/${favouriteId}`, {
		method: "DELETE",
	});
};

export enum CatQueryKeys {
	CATS = "cats",
	BREEDS = "breeds",
	BREED_CATS = "breedCats",
	CAT = "catById",
	FAVORITES = "favorites",
}
