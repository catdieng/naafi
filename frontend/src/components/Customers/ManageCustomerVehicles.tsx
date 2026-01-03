import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import type { CustomerPublic, VehiclePublic } from "@/client";
import AddVehicule from "@/components/Vehicles/AddVehicule";
import DeleteVehicle from "@/components/Vehicles/DeleteVehicule";
import EditVehicle from "@/components/Vehicles/EditVehicle";
import ListVehicle from "@/components/Vehicles/ListVehicle";
import {
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogRoot,
	DialogTitle,
} from "../ui/dialog";

interface ManageCustomerVehiclesProps {
	customer: CustomerPublic;
	open: boolean;
	onClose: () => void;
}

const ManageCustomerVehicles = ({
	customer,
	open,
	onClose,
}: ManageCustomerVehiclesProps) => {
	const [editedVehicule, setEditedVehicle] = useState<
		VehiclePublic | undefined
	>();
	const [deletingId, setDeletingId] = useState<number | undefined>();

	return (
		<DialogRoot
			scrollBehavior="inside"
			size="cover"
			placement="center"
			open={open}
			onOpenChange={({ open }) => !open && onClose()}
		>
			<DialogContent>
				<DialogCloseTrigger />
				<DialogHeader>
					<DialogTitle>Manage Vehicles for {customer.full_name}</DialogTitle>
				</DialogHeader>
				<DialogBody>
					<Flex justify="end" mb={4}>
						<AddVehicule customerId={customer.id} />
					</Flex>
					<ListVehicle
						onEdit={(vehicle) => {
							setEditedVehicle(vehicle);
						}}
						onDelete={(vehicleId) => setDeletingId(vehicleId)}
						customerId={customer.id}
					/>
					{editedVehicule && (
						<EditVehicle
							open
							customerId={customer.id}
							vehicle={editedVehicule}
							onClose={() => {
								setEditedVehicle(undefined);
							}}
						/>
					)}
					{deletingId && (
						<DeleteVehicle
							open
							customerId={customer.id}
							id={deletingId}
							onClose={() => {
								setDeletingId(undefined);
							}}
						/>
					)}
				</DialogBody>
				<DialogFooter></DialogFooter>
			</DialogContent>
		</DialogRoot>
	);
};

export default ManageCustomerVehicles;
