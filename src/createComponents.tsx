import React, { PropsWithChildren } from "react";

export default function createComponents(useHydrationStatus: Function) {
	function Server({ children }: PropsWithChildren) {
		const hydration_status = useHydrationStatus();
		return !hydration_status ? <>{children}</> : null;
	}
	function Client({ children }: PropsWithChildren) {
		const hydration_status = useHydrationStatus();
		return hydration_status ? <>{children}</> : null;
	}

	return {
		Server,
		Client,
	};
}
