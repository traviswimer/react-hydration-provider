import React, { PropsWithChildren } from "react";
import { ClientAndServer } from "./ClientAndServer";

export function ClientOnly({ children }: PropsWithChildren) {
	return <ClientAndServer Client={children} />;
}
