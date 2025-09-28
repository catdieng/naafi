import { Box, Flex, Separator, Text } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import type { InvoiceCreate, ItemsPublic } from "@/client";

type TaxDetail = {
	tax_id: number;
	item_id: number;
	name: string;
	rate: number;
	type: "percentages" | "fixed";
	amount: number;
};

const InvoiceTotals = () => {
	const queryClient = useQueryClient();
	const { watch } = useFormContext<InvoiceCreate>();
	const items = watch("items") || [];

	const servicesAll = queryClient.getQueryData<ItemsPublic>(["itemsAll"]);

	const serviceMap = new Map<number, ItemsPublic["results"][number]>(
		(servicesAll?.results || []).map((service) => [service.id, service]),
	);

	const initialAccumulator = {
		subtotal: 0,
		totalTax: 0,
		grandTotal: 0,
		taxBreakdown: [] as TaxDetail[],
	};

	const { subtotal, totalTax, grandTotal, taxBreakdown } = items.reduce(
		(acc, item) => {
			const quantity = Number(item.quantity) || 0;
			const unitPrice = Number(item.unit_price) || 0;
			const itemSubtotal = quantity * unitPrice;

			const service = serviceMap.get(Number(item.service_id));
			if (!service) return acc;

			const taxes = service.applicable_taxes ?? [];

			const itemTaxDetails = taxes.map((tax) => {
				const amount =
					tax.rate_type === "percentages"
						? itemSubtotal * (tax.rate / 100)
						: tax.rate;

				return {
					tax_id: tax.id,
					item_id: Number(item.service_id),
					name: tax.name,
					rate: tax.rate,
					type: tax.rate_type,
					amount,
				};
			});

			const itemTotalTax = itemTaxDetails.reduce((sum, t) => sum + t.amount, 0);

			acc.subtotal += itemSubtotal;
			acc.totalTax += itemTotalTax;
			acc.grandTotal += itemSubtotal + itemTotalTax;
			acc.taxBreakdown.push(...itemTaxDetails);

			return acc;
		},
		{ ...initialAccumulator }, // clone to avoid accidental mutation
	);

	const groupedTaxes = (taxes: TaxDetail[]) => {
		const summaryMap = new Map<
			number,
			{
				tax_id: number;
				name: string;
				rate: number;
				type: string;
				amount: number;
			}
		>();

		for (const tax of taxes) {
			const existing = summaryMap.get(tax.tax_id);

			if (existing) {
				existing.amount += tax.amount;
			} else {
				summaryMap.set(tax.tax_id, {
					tax_id: tax.tax_id,
					name: tax.name,
					rate: tax.rate,
					type: tax.type,
					amount: tax.amount,
				});
			}
		}

		return Array.from(summaryMap.values());
	};

	const groupedTaxArray = groupedTaxes(taxBreakdown);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(value);
	};

	return (
		<Box ml="auto" maxW="xs" borderRadius="md" w="50%" borderWidth="1px">
			<Flex justifyContent="space-between" p={2}>
				<Text>Subtotal:</Text>
				<Text>{formatCurrency(subtotal)}</Text>
			</Flex>
			{Object.values(groupedTaxArray).map((tax) => (
				<Flex key={tax.tax_id} justifyContent="space-between" p={2}>
					<Text>
						{tax.name} (
						{tax.type === "percentages"
							? `${tax.rate}%`
							: formatCurrency(tax.rate)}
						):
					</Text>
					<Text>{formatCurrency(tax.amount)}</Text>
				</Flex>
			))}

			<Flex justifyContent="space-between" p={2}>
				<Text>Tax:</Text>
				<Text>{formatCurrency(totalTax)}</Text>
			</Flex>
			<Separator />

			<Flex justify="space-between" fontWeight="bold" p={4} borderRadius="md">
				<Text>Total:</Text>
				<Text>{formatCurrency(grandTotal)}</Text>
			</Flex>
		</Box>
	);
};

export default InvoiceTotals;
