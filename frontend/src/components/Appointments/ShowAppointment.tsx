import {
	Badge,
	Box,
	Card,
	Container,
	Flex,
	Icon,
	Separator,
	Stack,
	Text,
} from "@chakra-ui/react";
import {
	FaArrowRight,
	FaBoxes,
	FaCarAlt,
	FaClock,
	FaEdit,
	FaUserAlt,
} from "react-icons/fa";
import { Button } from "../ui/button";
import {
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogRoot,
	DialogTitle,
} from "../ui/dialog";
import DeleteAppointment from "./DeleteAppointment";
import { useAppointmentContext } from "./ProviderAppointment";

const ShowAppointment = () => {
	const { mode, setMode, selectedAppointment, setSelectedAppointment } =
		useAppointmentContext();

	const isOpen = !!selectedAppointment && mode === "view";

	const handleClose = () => {
		setMode(null);
		setSelectedAppointment(null);
	};

	// Small helper to format date and time consistently
	const formatDate = (dateStr?: string) =>
		dateStr
			? new Date(dateStr).toLocaleDateString(undefined, {
					weekday: "short",
					month: "short",
					day: "numeric",
					year: "numeric",
				})
			: "-";

	const formatTime = (dateStr?: string) =>
		dateStr
			? new Date(dateStr).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
				})
			: "-";

	const onEdit = () => {
		setMode("edit");
	};

	return (
		<DialogRoot
			scrollBehavior="inside"
			size={{ base: "xs", md: "lg" }}
			placement="center"
			open={isOpen}
			onOpenChange={({ open }) => !open && handleClose()}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Appointment</DialogTitle>
					<DialogCloseTrigger />
				</DialogHeader>

				<Box>
					<Container>
						<Flex align="center" gap={4}>
							<Icon as={FaUserAlt} boxSize={6} color="gray.400" />
							<Box>
								<Text fontWeight="bold" textStyle="sm" color="gray.400">
									Customer
								</Text>
								<Text textStyle="sm" fontWeight="bold">
									{selectedAppointment?.customer?.full_name || "—"}
								</Text>
							</Box>
						</Flex>
					</Container>
				</Box>

				<Separator my={4} />

				<Box>
					<Container>
						<Flex align="center" gap={4}>
							<Icon as={FaCarAlt} boxSize={6} color="gray.400" />
							<Box>
								<Text fontWeight="bold" textStyle="sm" color="gray.400">
									Vehicle
								</Text>
								<Text textStyle="sm" fontWeight="bold">
									{selectedAppointment?.vehicle?.brand_name}{" "}
									{selectedAppointment?.vehicle?.model_name}{" "}
									{selectedAppointment?.vehicle?.year}{" "}
									{selectedAppointment?.vehicle?.license_plate}{" "}
									{selectedAppointment?.vehicle?.vin}
								</Text>
							</Box>
						</Flex>
					</Container>
				</Box>

				<Separator my={4} />

				<Box width="100%">
					<Container width="100%">
						<Flex width="100%" gap={4} align="center">
							<Icon as={FaClock} boxSize={6} color="gray.400" />
							<Flex width="100%" justify="space-between" alignItems="center">
								<Box flex="2">
									<Text fontWeight="bold" textStyle="sm" color="gray.400">
										{formatDate(selectedAppointment?.start)}
									</Text>
									<Text fontWeight="bold">
										{formatTime(selectedAppointment?.start)}
									</Text>
								</Box>
								<Icon flex="1" as={FaArrowRight} boxSize={6} color="gray.400" />
								<Box flex="2">
									<Text fontWeight="bold" textStyle="sm" color="gray.400">
										{formatDate(selectedAppointment?.end)}
									</Text>
									<Text fontWeight="bold">
										{formatTime(selectedAppointment?.end)}
									</Text>
								</Box>
							</Flex>
						</Flex>
					</Container>
				</Box>

				<Separator my={4} />

				<Box width="100%">
					<Container width="100%">
						<Flex width="100%" gap={4} align="center">
							<Icon as={FaBoxes} boxSize={6} color="gray.400" />
							<Box width="100%">
								<Text fontWeight="bold" textStyle="sm" color="gray.400">
									Services
								</Text>
								{selectedAppointment?.services?.length ? (
									<Stack direction="row">
										{selectedAppointment.services.map((service) => (
											<Badge key={service.id}>
												<Text fontWeight="medium">{service.name}</Text>
											</Badge>
										))}
									</Stack>
								) : (
									<Text fontWeight="bold" fontSize="sm">
										No services
									</Text>
								)}
							</Box>
						</Flex>
					</Container>
				</Box>

				<Separator my={4} />

				<Box width="100%">
					<Container width="100%">
						<Flex align="center" width="100%" gap={4}>
							<Icon as={FaEdit} boxSize={6} color="gray.400" />
							<Box width="100%">
								<Text fontWeight="bold" textStyle="md" color="gray.400">
									Description
								</Text>
								<Box>
									{/* <Card.Root variant="subtle">
										<Card.Body>
											<Card.Description>
												<Text fontSize="smaller">
													{selectedAppointment?.description || "N/A"}
												</Text>
											</Card.Description>
										</Card.Body>
									</Card.Root> */}
								</Box>
							</Box>
						</Flex>
					</Container>
				</Box>

				<Separator my={4} />

				<DialogFooter flex={1} justifyContent="space-between">
					{selectedAppointment?.id && (
						<DeleteAppointment
							id={selectedAppointment?.id}
							onDelete={handleClose}
						/>
					)}
					<Button variant="solid" onClick={onEdit}>
						Edit
					</Button>
				</DialogFooter>
			</DialogContent>
		</DialogRoot>
	);
};

export default ShowAppointment;
