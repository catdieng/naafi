import { createContext, type ReactNode, useContext } from "react";

import useNavbar from "../hooks/useNavbar";

const NavbarContext = createContext<ReturnType<typeof useNavbar> | null>(null);

export function NavbarProvider({ children }: { children: ReactNode }) {
	const nav = useNavbar("nav-folded");

	return (
		<NavbarContext.Provider value={nav}>{children}</NavbarContext.Provider>
	);
}

export function useNav() {
	const ctx = useContext(NavbarContext);
	if (!ctx) {
		throw new Error("useNav");
	}

	return ctx;
}
