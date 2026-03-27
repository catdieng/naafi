import { createFileRoute, redirect } from "@tanstack/react-router";

import AuthenticatedLayout from "@/components/Layout/AuthenticatedLayout";
import { isLoggedIn } from "@/hooks/useAuth";

export const Route = createFileRoute("/_layout")({
	component: AuthenticatedLayout,
	beforeLoad: async () => {
		if (!isLoggedIn()) {
			throw redirect({
				to: "/login",
			});
		}
	},
});
