import { Flex, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

import { useNav } from "@/providers/NavbarProvider";
import NafiIcon from "/assets/images/naafi-icon.svg";

function Navbar() {
	const display = useBreakpointValue({ base: "none", md: "flex" });
	const { isFolded } = useNav();

	return (
		<Flex
			display={display}
			justify="space-between"
			position="sticky"
			color="white"
			align="center"
			w="100%"
			top={0}
			p={4}
		>
			<Link to="/">
				<Flex gap={2} alignItems="center">
					<Image src={NafiIcon} alt="Logo" width="32px" />{" "}
					<Text
						textStyle="xl"
						color="black"
						fontWeight="bold"
						opacity={isFolded ? 0 : 1}
						transform={isFolded ? "translateX(-8px)" : "translateX(0)"}
						transition="opacity 0.2s ease, transform 0.2s ease"
					>
						naafi
					</Text>
				</Flex>
			</Link>
		</Flex>
	);
}

export default Navbar;
