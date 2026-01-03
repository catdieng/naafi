import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import React, { Suspense } from "react";

import NotFound from "@/components/Common/NotFound";

const loadDevtools = () =>
	Promise.all([
		import("@tanstack/react-router-devtools"),
		import("@tanstack/react-query-devtools"),
	]).then(([routerDevtools, reactQueryDevtools]) => {
		return {
			default: () => (
				<>
					<routerDevtools.TanStackRouterDevtools />
					<reactQueryDevtools.ReactQueryDevtools />
				</>
			),
		};
	});

const TanStackDevtools =
	process.env.NODE_ENV === "production" ? () => null : React.lazy(loadDevtools);

export const Route = createRootRoute({
	head: () => ({
		title: "Naafi",
		meta: [
			{
				title: "Naafi",
			},
			{
				name: "description",
				content: "Naafi Application",
			},
		],
	}),
	component: () => (
		<>
			<HeadContent />
			<Outlet />
			<Suspense>
				<TanStackDevtools />
			</Suspense>
		</>
	),
	notFoundComponent: () => <NotFound />,
});
