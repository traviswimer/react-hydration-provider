"use client";
import createHydration, { useComponentHydrated } from "./createHydration.js";

const { HydrationContext, HydrationProvider, useHydrated, Server, Client } =
	createHydration();

export {
	HydrationContext,
	HydrationProvider,
	useHydrated,
	Server,
	Client,
	createHydration,
	useComponentHydrated,
};
