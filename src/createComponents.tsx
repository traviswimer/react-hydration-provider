import React from "react";

export type HydrationComponentFunction = (
	props: React.PropsWithChildren
) => JSX.Element | null;

export interface HydrationComponents {
	Server: HydrationComponentFunction;
	Client: HydrationComponentFunction;
}

export default function createComponents(
	useHydrated: Function
): HydrationComponents {
	const Server: HydrationComponentFunction = ({ children }) => {
		const hydrated = useHydrated();
		return !hydrated ? <>{children}</> : null;
	};
	const Client: HydrationComponentFunction = ({ children }) => {
		const hydrated = useHydrated();
		return hydrated ? <>{children}</> : null;
	};

	return {
		Server,
		Client,
	};
}
