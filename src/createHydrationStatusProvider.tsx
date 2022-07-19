import React from "react";
import { useHydrationCompleted } from "./useHydrationCompleted";

export default function createHydrationStatusProvider(
	HydrationStatusContext: React.Context<any>
) {
	return function HydrationStatusProvider({
		children,
	}: React.PropsWithChildren) {
		const hydration_completed = useHydrationCompleted();
		return (
			<HydrationStatusContext.Provider value={hydration_completed}>
				{children}
			</HydrationStatusContext.Provider>
		);
	};
}
