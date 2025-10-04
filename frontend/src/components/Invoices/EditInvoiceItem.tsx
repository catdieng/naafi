import { Table, useListCollection } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useEffectEvent, useMemo } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { FiPlusCircle } from "react-icons/fi";
import { type InvoiceCreate, type InvoiceUpdate, ItemsService } from "@/client";
import Pending from "../Pending/Pending";
import { Button } from "../ui/button";
import EditInvoiceItemRow from "./EditInvoiceItemRow";

const EditInvoiceItem = () => {
	const { control } = useFormContext<InvoiceCreate | InvoiceUpdate>();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
	});

	const allItems = useWatch({
		control,
		name: "items",
	});

	const selectedServiceIds = useMemo(() => {
		return allItems.map((el) => el.service_id);
	}, [allItems]);

	const { set } = useListCollection<{
		label: string;
		value: string;
	}>({
		initialItems: [],
	});

	const { data: services, isLoading } = useQuery({
		queryKey: ["itemsAll"],
		queryFn: ItemsService.readItemsAll,
	});

	const hydrateServicesCollection = useEffectEvent(() => {
		if (services) {
			set(
				services?.results.map((el) => ({
					label: el.name,
					value: String(el.id),
				})),
			);
		}
	});

	useEffect(() => {
		hydrateServicesCollection();
	}, [services]);

	return isLoading ? (
		<Pending
			columns={["Service", "Quantity", "UnitPrice", "Sub Total", "Actions"]}
		/>
	) : (
		<>
			<Table.Root size="sm" variant="outline" my={4} rounded="md">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader>Service</Table.ColumnHeader>
						<Table.ColumnHeader>Quantity</Table.ColumnHeader>
						<Table.ColumnHeader>Unit Price</Table.ColumnHeader>
						<Table.ColumnHeader>Sub Total</Table.ColumnHeader>
						<Table.ColumnHeader>Actions</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{fields.map((field, index) => (
						<EditInvoiceItemRow
							key={field.id}
							index={index}
							services={services?.results || []}
							selectedServiceIds={selectedServiceIds || []}
							remove={remove}
						/>
					))}
				</Table.Body>
			</Table.Root>
			<br />
			<Button
				variant="plain"
				onClick={() => {
					append({ service_id: "", quantity: "1", unit_price: "0" });
				}}
			>
				<FiPlusCircle /> Add Row
			</Button>
		</>
	);
};

export default EditInvoiceItem;
