import React from "react";

export function useHydrationCompleted() {
	// Once useEffect() has been called, we know the app has been hydrated.
	const [hydration_completed, setHydrationCompleted] = React.useState(false);
	React.useEffect(() => {
		setHydrationCompleted(true);
	}, []);

	return hydration_completed;
}
