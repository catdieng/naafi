import { Box, Heading, Text } from "@chakra-ui/react"

import AddOrganization from "@/components/Organizations/AddOrganization"

function NoOrganization() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, teal.400, teal.600)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        No Organization
      </Text>
      <Text color={"gray.500"} mb={6}>
        You don't have an organization assigned to your account. Please
        subscribe to a plan or ask your administrator to invite you.
      </Text>
      <AddOrganization />
    </Box>
  )
}

export default NoOrganization
