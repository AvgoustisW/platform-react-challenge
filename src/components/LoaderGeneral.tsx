import { Cat } from "lucide-react";

interface LoaderGeneralProps {
	text?: string;
}
const LoaderGeneral = ({ text = "" }: LoaderGeneralProps) => {
	return (
		<div className="flex justify-center items-center h-64">
			<Cat className="h-8 w-8 animate-spin text-primary" />
			<span className="ml-2">{text}</span>
		</div>
	);
};

export default LoaderGeneral;
