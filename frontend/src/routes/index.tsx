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
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import ThemeToggle from "@/components/Common/ThemeToggle";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Switch } from "@/components/ui/switch";
import HeroImage from "/assets/images/hero.png";
import NafiIcon from "/assets/images/naafi-icon.svg";

export const Route = createFileRoute("/")({
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

// -----------------------------
// MARKETING LAYOUT
// -----------------------------
function MarketingLayout({ children }: { children: React.ReactNode }) {
	const bg = useColorModeValue("white", "black");
	const color = useColorModeValue("black", "white");

	return (
		<Box bg={bg} color={color} minH="100vh">
			{children}
		</Box>
	);
}

// -----------------------------
// NAVBAR
// -----------------------------
export default function Navbar() {
	const bg = useColorModeValue("white", "black");
	const color = useColorModeValue("black", "white");

	return (
		<Box
			as="nav"
			bg={bg}
			color={color}
			minH="50px"
			py={2}
			px={4}
			position="fixed"
			top={0}
			w="full"
			zIndex={100}
		>
			<Container maxW="6xl">
				<Flex align="center">
					<Flex flex={1} gap={2} align="center">
						<Image src={NafiIcon} alt="Logo" width="32px" />
						<Text fontSize="lg" fontWeight="semibold">
							naafi
						</Text>
					</Flex>
					<Stack direction="row" gap={1}>
						<ThemeToggle />
					</Stack>
				</Flex>
			</Container>
		</Box>
	);
}

// -----------------------------
// HERO SECTION
// -----------------------------
function Hero() {
	const headingColor = useColorModeValue("black", "white");
	const textColor = useColorModeValue("gray.700", "gray.300");
	const btnBg = useColorModeValue("black", "white");
	const btnColor = useColorModeValue("white", "black");

	return (
		<Container minH={400} mt={12} bg="transparent">
			<MotionBox
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				textAlign="center"
			>
				<Flex
					alignItems="center"
					direction={{ base: "column-reverse", md: "row" }}
					gap={12}
				>
					<Box>
						<Heading
							fontSize={{ base: "3xl", md: "4xl" }}
							fontWeight="bolder"
							color={headingColor}
						>
							From tasks to invoices effortlessly.
						</Heading>
						<Text mt={6} fontSize="xl" color={textColor} maxW="3xl" mx="auto">
							Run your garage with clarity. Appointments, invoices, expenses —
							all in one place.
						</Text>
						<Stack
							direction={{ base: "column", sm: "row" }}
							gap={4}
							mt={10}
							justify="center"
						>
							<Button size="lg" bg={btnBg} color={btnColor}>
								Start Free Trial
							</Button>
						</Stack>
					</Box>
					<Box>
						<Image src={HeroImage} alt="Garage management illustration" />
					</Box>
				</Flex>
			</MotionBox>
		</Container>
	);
}

// -----------------------------
// FEATURE CARD
// -----------------------------
function Feature({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	const bg = useColorModeValue("white", "black");
	const color = useColorModeValue("black", "white");
	const borderColor = useColorModeValue("black", "white");

	return (
		<MotionBox
			whileHover={{ y: -6 }}
			transition={{ type: "spring", stiffness: 300 }}
			p={6}
			border="1px solid"
			borderColor={borderColor}
			rounded="2xl"
			bg={bg}
			color={color}
		>
			<Heading fontSize="xl" mb={2}>
				{title}
			</Heading>
			<Text opacity={0.8}>{children}</Text>
		</MotionBox>
	);
}

// -----------------------------
// FEATURES SECTION
// -----------------------------
function Features() {
	const bg = useColorModeValue("gray.50", "gray.900");

	return (
		<Box bg={bg} color="inherit" py={24}>
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

// -----------------------------
// PRICING CARD
// -----------------------------
function PriceCard({
	title,
	price,
	highlighted,
}: {
	title: string;
	price: string;
	highlighted?: boolean;
}) {
	const bg = useColorModeValue("white", "black");
	const color = useColorModeValue("black", "white");
	const borderColor = useColorModeValue("gray.300", "gray.600");

	const highlightedBg = useColorModeValue("black", "white");
	const highlightedColor = useColorModeValue("white", "black");
	const highlightedBorder = useColorModeValue("black", "white");

	return (
		<MotionBox
			whileHover={{ scale: 1.03 }}
			p={8}
			rounded="2xl"
			border="1px solid"
			borderColor={highlighted ? highlightedBorder : borderColor}
			bg={highlighted ? highlightedBg : bg}
			color={highlighted ? highlightedColor : color}
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
				bg={highlighted ? color : highlightedBg}
				color={highlighted ? highlightedBg : highlightedColor}
			>
				Choose Plan
			</Button>
		</MotionBox>
	);
}

// -----------------------------
// PRICING SECTION
// -----------------------------
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

// -----------------------------
// CTA SECTION
// -----------------------------
function CTA() {
	const btnBg = useColorModeValue("black", "white");
	const btnColor = useColorModeValue("white", "black");

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
				<Button size="lg" bg={btnBg} color={btnColor}>
					Create My Garage
				</Button>
			</MotionBox>
		</Container>
	);
}

// -----------------------------
// FOOTER
// -----------------------------
function Footer() {
	const borderColor = useColorModeValue("blackAlpha.300", "whiteAlpha.300");

	return (
		<Box borderTop="1px solid" borderColor={borderColor} py={8}>
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
