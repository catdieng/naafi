import {
	Button,
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { FaPlus } from "react-icons/fa";

const AddInvoice = () => {
	const navigate =  useNavigate()

	return (
		<Button value="add-invoice" size="xs" colorPalette="gray" onClick={() => {
			navigate({ to: 'new'})
		}}>
			<FaPlus fontSize="16px" />
			Add Invoice
		</Button>
	);
};

export default AddInvoice;
