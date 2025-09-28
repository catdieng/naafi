import { Box, HStack, Input } from "@chakra-ui/react";
import { useId } from "react";
import { useFormContext } from "react-hook-form";
import type { InvoiceCreate } from "@/client";
import { Field } from "../ui/field";

const EditInvoiceInfo = () => {
	const {
		formState: { errors },
		register,
	} = useFormContext<InvoiceCreate>();

	return (
		<Box py={2}>
			<Field
				py={2}
				invalid={!!errors.invoice_number}
				errorText={errors.invoice_number?.message}
				label="Invoice number"
				helperText="e.g. INV-00123"
			>
				<Input
					id={useId()}
					{...register("invoice_number")}
					placeholder="Enter invoice number"
					type="text"
				/>
			</Field>
			<HStack py={2}>
				<Field
					invalid={!!errors.issue_date}
					errorText={errors.issue_date?.message}
					label="Issue date"
				>
					<Input
						id={useId()}
						type="date"
						{...register("issue_date", {
							setValueAs: (val) => (val === "" ? null : val),
						})}
					/>
				</Field>
				<Field
					invalid={!!errors.due_date}
					errorText={errors.due_date?.message}
					label="Due date"
				>
					<Input
						id={useId()}
						type="date"
						{...register("due_date", {
							setValueAs: (val) => (val === "" ? null : val),
						})}
					/>
				</Field>
			</HStack>
		</Box>
	);
};

export default EditInvoiceInfo;
