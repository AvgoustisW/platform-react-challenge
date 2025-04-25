import { Button } from "./ui/Button";

interface ErrorGeneralProps {
	text?: string;
	onTryAgain?: () => void;
}
const ErrorGeneral = ({
	text = "Failed operation",
	onTryAgain = () => window.location.reload(),
}: ErrorGeneralProps) => (
	<div className="text-center p-8">
		<p className="text-destructive mb-4">{text}</p>
		<Button onClick={onTryAgain}>Try Again</Button>
	</div>
);

export default ErrorGeneral;
