import {
	Badge,
	Box,
	Button,
	Container,
	Flex,
	Heading,
	Icon,
	SimpleGrid,
	Stack,
	Text,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { FiCalendar, FiDollarSign, FiTool, FiUsers } from "react-icons/fi";

export const Route = createFileRoute("/landing")({
	component: LandingPage,
});

export default function LandingPage() {
	return (
		<Box bg="gray.50">
			{/* NAVBAR */}
			<Box
				py={4}
				px={8}
				bg="white"
				borderBottom="1px solid"
				borderColor="gray.200"
			>
				<Flex justify="space-between" align="center">
					<Heading size="md">GarageOS</Heading>
					<Stack direction="row" gap={4}>
						<Button variant="ghost">Product</Button>
						<Button variant="ghost">Pricing</Button>
						<Button variant="ghost">Login</Button>
						<Button colorScheme="blue">Get Started</Button>
					</Stack>
				</Flex>
			</Box>

			{/* HERO */}
			<Container maxW="6xl" py={20} textAlign="center">
				<Heading size="2xl" mb={4}>
					The Operating System for{" "}
					<Text as="span" color="blue.500">
						Mechanic Garages
					</Text>
				</Heading>
				<Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto">
					Manage repairs, appointments, invoices, and customers in one place.
					Built for modern garages that want to scale.
				</Text>

				<Stack direction="row" justify="center" mt={8}>
					<Button size="lg" colorScheme="blue">
						Start Free
					</Button>
					<Button size="lg" variant="outline">
						Book Demo
					</Button>
				</Stack>

				{/* Mock Preview */}
				<Box
					mt={12}
					borderRadius="xl"
					bg="white"
					p={6}
					shadow="md"
					border="1px solid"
					borderColor="gray.200"
				>
					<Text color="gray.500">Dashboard Preview (replace with image)</Text>
				</Box>
			</Container>

			{/* FEATURES */}
			<Container maxW="6xl" py={20}>
				<Heading textAlign="center" mb={12}>
					Everything your garage needs
				</Heading>

				<SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
					<FeatureCard
						icon={FiCalendar}
						title="Appointments"
						desc="Schedule repairs and manage availability."
					/>
					<FeatureCard
						icon={FiTool}
						title="Repair Orders"
						desc="Track jobs, parts, and progress."
					/>
					<FeatureCard
						icon={FiDollarSign}
						title="Invoices & Payments"
						desc="Bill customers and track payments."
					/>
					<FeatureCard
						icon={FiUsers}
						title="Customers"
						desc="Manage client history and vehicles."
					/>
				</SimpleGrid>
			</Container>

			{/* WORKFLOW SECTION */}
			<Box bg="white" py={20}>
				<Container maxW="6xl">
					<SimpleGrid columns={{ base: 1, md: 2 }} gap={10}>
						<Box>
							<Heading mb={4}>Automate your workflow</Heading>
							<Text color="gray.600" mb={4}>
								From appointment to invoice, everything is connected.
							</Text>

							<Stack>
								<Badge colorScheme="green">Auto reminders</Badge>
								<Badge colorScheme="blue">Job tracking</Badge>
								<Badge colorScheme="purple">Real-time updates</Badge>
							</Stack>
						</Box>

						<Box
							bg="gray.100"
							borderRadius="xl"
							h="250px"
							display="flex"
							alignItems="center"
							justifyContent="center"
						>
							Preview
						</Box>
					</SimpleGrid>
				</Container>
			</Box>

			{/* CLIENT PORTAL */}
			<Container maxW="6xl" py={20}>
				<SimpleGrid columns={{ base: 1, md: 2 }} gap={10}>
					<Box
						bg="gray.100"
						borderRadius="xl"
						h="250px"
						display="flex"
						alignItems="center"
						justifyContent="center"
					>
						UI
					</Box>

					<Box>
						<Heading mb={4}>Client Portal</Heading>
						<Text color="gray.600">
							Let customers track their vehicle status, approve quotes, and
							download invoices without calling your garage.
						</Text>
					</Box>
				</SimpleGrid>
			</Container>

			{/* BILLING */}
			<Box bg="white" py={20}>
				<Container maxW="6xl" textAlign="center">
					<Heading mb={6}>Get paid faster</Heading>
					<Text color="gray.600" mb={10}>
						Send invoices instantly and accept online payments.
					</Text>

					<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
						<Box p={6} bg="gray.50" borderRadius="xl">
							<Text>Oil Change</Text>
							<Text fontWeight="bold">€80</Text>
						</Box>
						<Box p={6} bg="gray.50" borderRadius="xl">
							<Text>Brake Repair</Text>
							<Text fontWeight="bold">€240</Text>
						</Box>
					</SimpleGrid>
				</Container>
			</Box>

			{/* TESTIMONIALS */}
			<Container maxW="6xl" py={20}>
				<Heading textAlign="center" mb={12}>
					Trusted by garages
				</Heading>

				<SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
					<Testimonial
						text="We increased efficiency by 30%."
						author="Garage Pro"
					/>
					<Testimonial text="Invoices are now instant." author="AutoFix" />
					<Testimonial text="Clients love the portal." author="SpeedCar" />
				</SimpleGrid>
			</Container>

			{/* CTA */}
			<Box bg="gray.900" color="white" py={20} textAlign="center">
				<Heading mb={4}>Ready to modernize your garage?</Heading>
				<Text mb={6} color="gray.300">
					Start managing your business smarter today.
				</Text>
				<Button size="lg" colorScheme="blue">
					Start Free
				</Button>
			</Box>

			{/* FOOTER */}
			<Box py={10} textAlign="center" color="gray.500">
				© 2026 GarageOS
			</Box>
		</Box>
	);
}

/* COMPONENTS */

function FeatureCard({ icon, title, desc }: any) {
	return (
		<Box
			p={6}
			bg="white"
			borderRadius="xl"
			shadow="sm"
			border="1px solid"
			borderColor="gray.200"
		>
			<Icon as={icon} boxSize={6} mb={3} />
			<Heading size="sm" mb={2}>
				{title}
			</Heading>
			<Text color="gray.600">{desc}</Text>
		</Box>
	);
}

function Testimonial({ text, author }: any) {
	return (
		<Box p={6} bg="white" borderRadius="xl" shadow="sm">
			<Text mb={4}>"{text}"</Text>
			<Text fontWeight="bold">{author}</Text>
		</Box>
	);
}
