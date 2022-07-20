import React from "react";

export function useComponentHydrated() {
	// Once useEffect() has been called, we know the app has been hydrated.
	const [hydrated, setHydrated] = React.useState(false);
	React.useEffect(() => {
		setHydrated(true);
	}, []);

	return hydrated;
}
