import createHydrationStatus, {
	useHydrationCompleted,
} from "./createHydrationStatus";

const { HydrationStatusProvider, useHydrationStatus, Server, Client } =
	createHydrationStatus();

export {
	HydrationStatusProvider,
	useHydrationStatus,
	Server,
	Client,
	useHydrationCompleted,
};
