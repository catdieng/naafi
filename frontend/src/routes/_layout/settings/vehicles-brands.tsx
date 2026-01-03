import { Box, Container, Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { FaEdit, FaList, FaTrash } from "react-icons/fa";
import { type BrandPublic, BrandsService } from "@/client";
import AddBrand from "@/components/Brands/AddBrand";
import DeleteBrand from "@/components/Brands/DeleteBrand";
import EditBrand from "@/components/Brands/EditBrand";
import ManageBrandModels from "@/components/Brands/ManageBrandModels";
import { ActionsMenu } from "@/components/Common/ActionsMenu";
import DrfList from "@/components/Common/DRFList";
import PageHeader from "@/components/Common/PageHeader";
import { MenuItem } from "@/components/ui/menu";

export const Route = createFileRoute("/_layout/settings/vehicles-brands")({
	head: () => ({
		title: "Vehicle Brands Settings",
		meta: [
			{
				title: "Vehicle Brands | Naafi",
			},
			{
				name: "description",
				content: "Manage vehicle brands settings",
			},
		],
	}),
	component: Vehicles,
});

function getVehiculeBrandsQueryOptions({
	ordering,
	page,
	size,
	search,
}: {
	ordering: string;
	page: number;
	size: number;
	search: string;
}) {
	return {
		queryFn: () => BrandsService.readBrands({ ordering, page, size, search }),
		queryKey: ["brands", { ordering, page, size, search }],
	};
}

function Vehicles() {
	const [ordering, setOrdering] = useState("");
	const [page, setPage] = useState(1);
	const [size, setSize] = useState(10);
	const [search, setSearch] = useState("");
	const [editingBrand, setEditingBrand] = useState<BrandPublic | null>(null);
	const [manageBrandModelsBrand, setManageBrandModelsBrand] =
		useState<BrandPublic | null>(null);
	const [deleteBrandId, setDeleteBrandId] = useState<number | null>(null);

	const { data, isLoading } = useQuery({
		...getVehiculeBrandsQueryOptions({ ordering, page, size, search }),
		placeholderData: (prevData) => prevData,
	});

	const columns: ColumnDef<BrandPublic>[] = useMemo(
		() => [
			{
				accessorKey: "id",
				header: "ID",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ row }) => <Text>{row.getValue("id")}</Text>,
				size: 30,
			},
			{
				accessorKey: "name",
				header: "Name",
				enableSorting: true,
				cell: ({ row }) => (
					<Text truncate fontWeight="semibold">
						{row.getValue("name")}
					</Text>
				),
			},
			{
				id: "actions",
				cell: ({ row }) => (
					<ActionsMenu>
						<MenuItem
							value="edit-brand"
							onClick={() => setEditingBrand(row.original)}
						>
							<FaEdit /> Edit
						</MenuItem>
						<MenuItem
							value="manage-models"
							onClick={() => setManageBrandModelsBrand(row.original)}
						>
							<FaList /> Manage Models
						</MenuItem>
						<MenuItem
							value="delete-brand"
							onClick={() => setDeleteBrandId(row.original.id)}
						>
							<FaTrash /> Delete
						</MenuItem>
					</ActionsMenu>
				),
				enableSorting: false,
				enableColumnFilter: false,
				size: 120,
				meta: {
					textAlign: "end",
				},
			},
		],
		[],
	);

	return (
		<Container maxW="full">
			<Flex justifyContent="space-between" alignItems="center" mb={4}>
				<PageHeader
					title="Vehicle Brands"
					description="Manage your vehicle brands"
				/>
				<AddBrand />
			</Flex>
			<Box maxW="full">
				<DrfList<BrandPublic>
					title="Brands"
					columns={columns}
					data={data?.results ?? []}
					totalCount={data?.count ?? 0}
					page={page}
					size={size}
					search={search}
					isLoading={isLoading}
					onSearchChange={setSearch}
					onPageChange={setPage}
					onPageSizeChange={setSize}
					onOrderingChange={setOrdering}
				/>
			</Box>
			{editingBrand && (
				<EditBrand
					brand={editingBrand}
					open={!!editingBrand}
					onClose={() => setEditingBrand(null)}
				/>
			)}
			{manageBrandModelsBrand && (
				<ManageBrandModels
					brand={manageBrandModelsBrand}
					open
					onClose={() => setManageBrandModelsBrand(null)}
				/>
			)}
			{deleteBrandId && (
				<DeleteBrand
					id={deleteBrandId}
					open={!!deleteBrandId}
					onClose={() => setDeleteBrandId(null)}
				/>
			)}
		</Container>
	);
}
