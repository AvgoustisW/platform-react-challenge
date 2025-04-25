import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Router from "./router";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			refetchOnWindowFocus: false,
		},
	},
});

const App: React.FC = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Router />
		</QueryClientProvider>
	);
};

export default App;
