import React from "react";
import createHydrationProvider from "./createHydrationProvider.js";
import createComponents from "./createComponents.js";
import type { HydrationComponents } from "./createComponents.js";
export { useComponentHydrated } from "./useComponentHydrated.js";

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
