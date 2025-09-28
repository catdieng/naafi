import { Flex, Image, Text, useBreakpointValue } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"

import NafiIcon from "/assets/images/naafi-icon.svg"
import UserMenu from "./UserMenu"

function Navbar() {
  const display = useBreakpointValue({ base: "none", md: "flex" })

  return (
    <Flex
      display={display}
      justify="space-between"
      position="sticky"
      color="white"
      align="center"
      bg="bg.muted"
      w="100%"
      top={0}
      p={4}
    >
      <Link to="/">
        <Flex gap={2} alignItems="center">
          <Image src={NafiIcon} alt="Logo" maxH="32px" />{" "}
          <Text textStyle="xl" color="black" fontWeight="bold">
            Naafi
          </Text>
        </Flex>
      </Link>
      <Flex gap={2} alignItems="center">
        <UserMenu />
      </Flex>
    </Flex>
  )
}

export default Navbar
