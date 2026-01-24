import { useCallback, useEffect, useState } from "react";

export const SIDEBAR_WIDTH = {
	open: "250px",
	folded: "64px",
};

function useNavbar(key = "nav-folded", defaultValue = false) {
	const [isFolded, setIsFolded] = useState<boolean>(() => {
		const savedValue = localStorage.getItem(key);
		return savedValue !== null ? JSON.parse(savedValue) : defaultValue;
	});

	const width = isFolded ? SIDEBAR_WIDTH.folded : SIDEBAR_WIDTH.open;

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(isFolded));
	}, [key, isFolded]);

	const toggle = useCallback(() => setIsFolded((prev) => !prev), []);

	return {
		isFolded,
		toggle,
		width,
		fold: () => setIsFolded(true),
		unfold: () => setIsFolded(false),
	};
}

export default useNavbar;
