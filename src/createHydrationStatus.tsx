import React from "react";
import createHydrationStatusProvider from "./createHydrationStatusProvider";
import createComponents from "./createComponents";
export { useHydrationCompleted } from "./useHydrationCompleted";

export default function createHydrationStatus() {
	const HydrationStatusContext = React.createContext(false);

	const HydrationStatusProvider = createHydrationStatusProvider(
		HydrationStatusContext
	);

	const useHydrationStatus = () => {
		const status = React.useContext(HydrationStatusContext);
		return status;
	};

	const { Server, Client } = createComponents(useHydrationStatus);

	return {
		HydrationStatusContext,
		HydrationStatusProvider,
		useHydrationStatus,
		Server,
		Client,
	};
}
