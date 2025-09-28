import { Flex, Heading, Text } from "@chakra-ui/react"

interface PageHeaderProps {
  title: string
  description?: string
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <Flex my={4} direction="column" gap={2}>
      <Heading size="2xl" fontWeight="bold">
        {title}
      </Heading>
      <Text fontSize="sm" color="gray.400" fontWeight="medium">
        {description}
      </Text>
    </Flex>
  )
}

export default PageHeader
