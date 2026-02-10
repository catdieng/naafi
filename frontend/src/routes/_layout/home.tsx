import {
	Box,
	Button,
	Container,
	Flex,
	Heading,
	Image,
	SimpleGrid,
	Stack,
	Text,
} from "@chakra-ui/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import ThemeToggle from "@/components/Common/ThemeToggle";
import { Switch } from "@/components/ui/switch";
import HeroImage from "/assets/images/hero.png";
import NafiIcon from "/assets/images/naafi-icon.svg";

export const Route = createFileRoute("/_layout/home")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<MarketingLayout>
			<Navbar />
			<Hero />
			<Features />
			<Pricing />
			<CTA />
			<Footer />
		</MarketingLayout>
	);
}

const MotionBox = motion.create(Box);

function MarketingLayout({ children }: { children: React.ReactNode }) {
	return (
		<Box bg="white" color="white" minH="100vh">
			{children}
		</Box>
	);
}

export default function Navbar() {
	return (
		<Box
			as="nav"
			bg="bg.subtle"
			color="fg.muted"
			minH="50px"
			py="2"
			px="4"
			position="fixed"
			top="0"
			w="full"
			zIndex="100"
		>
			<Container>
				<Flex align="center">
					{/* Logo */}
					<Flex flex="1" gap={2}>
						<Image src={NafiIcon} alt="Logo" width="32px" />{" "}
						<Text fontSize="lg" fontWeight="semibold" color="fg.default">
							naafi
						</Text>
					</Flex>

					{/* Actions */}
					<Stack direction="row" gap="1">
						<ThemeToggle />
					</Stack>
				</Flex>
			</Container>
		</Box>
	);
}

function Hero() {
	return (
		<Container minH={400} mt={12} bg="white">
			<MotionBox
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				textAlign="center"
			>
				<Flex alignItems="center">
					<Box>
						<Heading
							color="gray.800"
							fontSize={{ base: "4xl", md: "3xl" }}
							fontWeight="bolder"
						>
							From tasks to invoices effortlessly.
						</Heading>
						<Text mt={6} fontSize="xl" color="gray.500" maxW="3xl" mx="auto">
							Run your garage with clarity. Appointments, invoices, expenses —
							all in one place.
						</Text>
						<Stack
							direction={{ base: "column", sm: "row" }}
							gap={4}
							mt={10}
							justify="center"
						>
							<Button size="lg">Start Free Trial</Button>
						</Stack>
					</Box>
					<Box>
						<Image src={HeroImage} alt="hero" />
					</Box>
				</Flex>
			</MotionBox>
		</Container>
	);
}

function Feature({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<MotionBox
			whileHover={{ y: -6 }}
			transition={{ type: "spring", stiffness: 300 }}
			p={6}
			border="1px solid"
			borderColor="gray.300"
			rounded="2xl"
		>
			<Heading fontSize="xl" mb={2}>
				{title}
			</Heading>
			<Text opacity={0.8}>{children}</Text>
		</MotionBox>
	);
}

function Features() {
	return (
		<Box bg="#f5f5f5" color="black" py={24}>
			<Container maxW="6xl">
				<Heading textAlign="center" mb={16}>
					Everything your garage needs
				</Heading>
				<SimpleGrid columns={{ base: 1, md: 3 }} gap={10}>
					<Feature title="Appointments">
						Smart scheduling with status tracking.
					</Feature>
					<Feature title="Invoices">
						Automatic taxes, totals, and due dates.
					</Feature>
					<Feature title="Customers & Vehicles">
						Complete service history per vehicle.
					</Feature>
					<Feature title="Expenses">
						Track suppliers, payments, and costs.
					</Feature>
				</SimpleGrid>
			</Container>
		</Box>
	);
}

function PriceCard({
	title,
	price,
	highlighted,
}: {
	title: string;
	price: string;
	highlighted?: boolean;
}) {
	return (
		<MotionBox
			whileHover={{ scale: 1.03 }}
			p={8}
			rounded="2xl"
			border="1px solid"
			borderColor={highlighted ? "white" : "whiteAlpha.300"}
			bg={highlighted ? "white" : "transparent"}
			color={highlighted ? "black" : "white"}
		>
			<Heading fontSize="xl" mb={4}>
				{title}
			</Heading>
			<Heading fontSize="4xl" mb={4}>
				{price}
			</Heading>
			<Text mb={6}>Per garage / month</Text>
			<Button
				w="full"
				bg={highlighted ? "black" : "white"}
				color={highlighted ? "white" : "black"}
			>
				Choose Plan
			</Button>
		</MotionBox>
	);
}
function Pricing() {
	const [yearly, setYearly] = useState(false);

	return (
		<Container maxW="6xl" py={32} textAlign="center">
			<Heading mb={4}>Simple pricing</Heading>
			<Text opacity={0.7} mb={10}>
				One plan. No hidden fees.
			</Text>

			<Flex align="center" justify="center" gap={3} mb={12}>
				<Text opacity={!yearly ? 1 : 0.5}>Monthly</Text>
				<Switch checked={yearly} onCheckedChange={() => setYearly(!yearly)} />
				<Text opacity={yearly ? 1 : 0.5}>Yearly (2 months free)</Text>
			</Flex>

			<SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
				<PriceCard title="Starter" price={yearly ? "€29" : "€39"} />
				<PriceCard highlighted title="Pro" price={yearly ? "€59" : "€79"} />
				<PriceCard title="Enterprise" price="Custom" />
			</SimpleGrid>
		</Container>
	);
}

function CTA() {
	return (
		<Container maxW="6xl" py={24} textAlign="center">
			<MotionBox
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
			>
				<Heading mb={4}>Ready to get started?</Heading>
				<Text mb={8} opacity={0.8}>
					Create your garage workspace in minutes.
				</Text>
				<Button size="lg" bg="white" color="black">
					Create My Garage
				</Button>
			</MotionBox>
		</Container>
	);
}

function Footer() {
	return (
		<Box borderTop="1px solid" borderColor="whiteAlpha.300" py={8}>
			<Container maxW="6xl">
				<Flex justify="space-between" wrap="wrap" gap={4}>
					<Text fontSize="sm" opacity={0.6}>
						© {new Date().getFullYear()} Naafi
					</Text>
					<Stack direction="row" gap={6} fontSize="sm">
						<Text>Privacy</Text>
						<Text>Terms</Text>
						<Text>Contact</Text>
					</Stack>
				</Flex>
			</Container>
		</Box>
	);
}
