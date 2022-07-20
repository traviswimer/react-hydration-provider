import React from "react";
import createHydrationProvider from "./createHydrationProvider";
import createComponents from "./createComponents";
import type { HydrationComponents } from "./createComponents";
export { useComponentHydrated } from "./useComponentHydrated";

export default function createHydration() {
	const HydrationContext: React.Context<boolean> = React.createContext(false);

	const HydrationProvider = createHydrationProvider(HydrationContext);

	const useHydrated = (): boolean => {
		return React.useContext(HydrationContext);
	};

	const { Server, Client }: HydrationComponents = createComponents(useHydrated);

	return {
		HydrationContext,
		HydrationProvider,
		useHydrated,
		Server,
		Client,
	};
}
