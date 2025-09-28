import { EmptyState, Flex, VStack } from "@chakra-ui/react"
import type { ReactNode } from "react"
import { FiSearch } from "react-icons/fi"

type EmptyDataProps = {
  action?: ReactNode
  title: string
  description: string
}

const EmptyData = ({ action, description, title }: EmptyDataProps) => (
  <>
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <FiSearch />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>
            {title ?? "You don't have any items yet"}
          </EmptyState.Title>
          <EmptyState.Description>
            {description ?? "Add a new item to get started"}
          </EmptyState.Description>
          {action && (
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              {action}
            </Flex>
          )}
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  </>
)

export default EmptyData
