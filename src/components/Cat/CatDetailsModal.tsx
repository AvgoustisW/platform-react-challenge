import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Heart, ExternalLink, HeartCrack } from "lucide-react";
import { CatImage } from "@/services/cats/catApi";
import { useFavorites } from "@/hooks/useFavorites";
import CopyButton from "../CopyButton";
import { Badge } from "../ui/Badge";
import LoaderGeneral from "../LoaderGeneral";
import { Link, useLocation } from "react-router-dom";

interface CatDetailsModalProps {
	cat?: CatImage;
	isOpen: boolean;
	onClose: () => void;
	onFavorite?: () => void;
	onRemove?: () => void;
	isLoading?: boolean;
	shareUrl?: string;
	isFavorite?: boolean;
}

const CatDetailsModal: React.FC<CatDetailsModalProps> = ({
	cat,
	isOpen,
	onClose,
	onFavorite,
	onRemove,
	isLoading = false,
	shareUrl,
	isFavorite: propIsFavorite,
}) => {
	const { isFavorite } = useFavorites();
	const location = useLocation();

	if (!cat && !isLoading) return null;

	const breed = cat?.breeds && cat.breeds.length > 0 ? cat.breeds[0] : undefined;
	const isFavorited = propIsFavorite !== undefined ? propIsFavorite : cat ? isFavorite(cat.id) : false;

	const titleText = breed ? (
		location.pathname.includes(`/breeds/${breed.id}`) ? (
			<div className="text-2xl text-primary flex items-center gap-2">{breed.name}</div>
		) : (
			<Link className="text-2xl text-primary flex items-center gap-2" to={`/breeds/${breed.id}`}>
				{breed.name} <ExternalLink className="w-6 h-6" />
			</Link>
		)
	) : (
		"Cat Details"
	);
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-[95vw] md:max-w-5xl max-h-[90vh] overflow-y-auto p-4 md:p-6 mx-auto">
				{isLoading ? (
					<div className="flex items-center justify-center py-12">
						<LoaderGeneral text="Searching through archives" />
					</div>
				) : (
					<>
						<DialogHeader className="mb-4">
							<DialogTitle>{titleText}</DialogTitle>
							<DialogDescription>{breed ? `Origin: ${breed.origin}` : "Details about this cat"}</DialogDescription>
						</DialogHeader>

						<div className="flex flex-col md:flex-row gap-4">
							<div className="w-full md:w-1/2">
								<img
									src={cat?.url}
									alt={breed?.name || "Cat"}
									className="w-full rounded-md object-contain max-h-[40vh] md:max-h-[50vh]"
								/>
							</div>

							{breed && (
								<div className="w-full md:w-1/2 space-y-3">
									{breed.wikipedia_url && (
										<div>
											<a
												href={breed.wikipedia_url}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center text-primary hover:underline"
											>
												<ExternalLink className="h-4 w-4 mr-1" />
												Wikipedia
											</a>
										</div>
									)}
									<div className="grid grid-cols-1 gap-2 text-sm">
										<div>
											<span className="font-medium">Temperament:</span>{" "}
											<div className="flex flex-wrap gap-1 mt-1">
												{breed.temperament?.split(",").map((trait, i) => (
													<Badge key={i} variant="default">
														{trait.trim()}
													</Badge>
												))}
											</div>
										</div>
										<div>
											<span className="font-medium">Life Span:</span>{" "}
											<div className="flex flex-wrap gap-1 mt-1">
												<Badge variant="default">{breed.life_span} years</Badge>
											</div>
										</div>
										<div>
											<span className="font-medium">Weight:</span>{" "}
											<div className="flex flex-wrap gap-1 mt-1">
												<Badge variant="default">{breed.weight.metric} kg</Badge>
											</div>
										</div>
									</div>
									<p className="text-sm">{breed.description}</p>
								</div>
							)}
						</div>

						<DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
							<div className="flex w-full sm:w-auto gap-2 flex-col sm:flex-row">
								{shareUrl && <CopyButton text="Share this cat" value={shareUrl} />}
								{onFavorite && (
									<Button
										onClick={isFavorited ? onRemove : onFavorite}
										disabled={isLoading}
										variant={isFavorited ? "outline" : "default"}
										className="w-full sm:w-auto"
									>
										{isFavorited ? "Remove favorite" : "Add to favorites"}
										{isFavorited ? <HeartCrack className="ml-2 h-4 w-4" /> : <Heart className="ml-2 h-4 w-4" />}
									</Button>
								)}
							</div>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default CatDetailsModal;
