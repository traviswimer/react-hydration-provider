import React from "react";
import { useComponentHydrated } from "./useComponentHydrated.js";

export default function createHydrationProvider(
	HydrationContext: React.Context<boolean>
) {
	return function HydrationProvider({ children }: React.PropsWithChildren) {
		const hydrated = useComponentHydrated();
		return (
			<HydrationContext.Provider value={hydrated}>
				{children}
			</HydrationContext.Provider>
		);
	};
}
