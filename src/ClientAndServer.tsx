import React from "react";

import { useHydrationCompleted } from "./useHydrationCompleted";

export interface ClientAndServerProps {
	Client?: React.ReactElement;
	Server?: React.ReactElement;
}

export function ClientAndServer({ Client, Server }: ClientAndServerProps) {
	const hydration_completed = useHydrationCompleted();

	let element_to_render: React.ReactElement | null;
	if (hydration_completed) {
		element_to_render = !!Client ? Client : null;
	} else {
		element_to_render = !!Server ? Server : null;
	}

	return element_to_render;
}
