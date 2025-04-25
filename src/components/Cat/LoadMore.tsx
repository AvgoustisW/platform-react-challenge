import React from "react";
import { Button } from "@/components/ui/Button";
import { CatIcon } from "lucide-react";

interface LoadMoreProps {
	onLoadMore: () => void;
	hasMore: boolean;
	isLoading: boolean;
}

const LoadMore: React.FC<LoadMoreProps> = ({ onLoadMore, hasMore, isLoading }) => {
	return (
		<div className="mt-8 flex justify-center">
			<Button onClick={onLoadMore} disabled={!hasMore || isLoading}>
				{isLoading ? (
					<>
						<CatIcon className=" h-4 w-4 animate-spin" />
						Pss pss pss
					</>
				) : hasMore ? (
					<>
						<CatIcon className=" h-4 w-4" />
						More Cats!{" "}
					</>
				) : (
					"No more cats to load"
				)}
			</Button>
		</div>
	);
};

export default LoadMore;
