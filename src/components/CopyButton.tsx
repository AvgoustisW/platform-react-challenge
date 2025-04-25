import { Check, Copy } from "lucide-react";
import { Button } from "./ui/Button";
import { useState } from "react";

const CopyButton = ({ value, text = "Share this link" }: { value: string; text?: string }) => {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy: ", err);
		}
	};

	return (
		<Button onClick={copyToClipboard} className="min-w-[170px]">
			{copied ? "Copied to clipboard" : text}
			{copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
			<span className="sr-only">Copy to clipboard</span>
		</Button>
	);
};

export default CopyButton;
