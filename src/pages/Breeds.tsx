import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { fetchCatBreeds, CatBreed, CatQueryKeys } from "@/services/cats/catApi";
import LoaderGeneral from "@/components/LoaderGeneral";
import ErrorGeneral from "@/components/ErrorGeneral";
import { Badge } from "@/components/ui/Badge";

const Breeds = () => {
	const navigate = useNavigate();

	const {
		data: breeds,
		isLoading: isLoadingBreeds,
		error: breedsError,
	} = useQuery({
		queryKey: [CatQueryKeys.BREEDS],
		queryFn: fetchCatBreeds,
	});

	const handleBreedSelect = (breed: CatBreed) => {
		navigate(`/breeds/${breed.id}`);
	};

	if (isLoadingBreeds) return <LoaderGeneral />;
	if (breedsError) return <ErrorGeneral text="Failed to load cat breeds" />;

	return (
		<>
			<h1 className="text-3xl font-bold mb-8 text-primary">Cat Breeds</h1>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{breeds?.map((breed) => (
					<Card
						key={breed.id}
						className="hover:shadow-md transition-shadow cursor-pointer"
						onClick={() => handleBreedSelect(breed)}
					>
						<CardContent className="p-4">
							<div className="flex justify-between items-start mb-2">
								<h3 className="text-lg font-medium">{breed.name}</h3>

								<Info className="h-4 w-4 text-primary" />
							</div>
							<p className="text-sm text-muted-foreground mb-2">Origin: {breed.origin}</p>
							<div className="flex flex-wrap gap-1 mt-2">
								{breed.temperament
									?.split(",")
									.slice(0, 3)
									.map((trait, i) => (
										<Badge key={i} variant="default">
											{trait.trim()}
										</Badge>
									))}

								{breed.temperament?.split(",").length > 3 && (
									<span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
										+{breed.temperament.split(",").length - 3} more
									</span>
								)}
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</>
	);
};

export default Breeds;
