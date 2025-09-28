import { Table } from "@chakra-ui/react"
import { SkeletonText } from "../ui/skeleton"

interface PendingProps {
    columns: string[]
}

const Pending = ({ columns }: PendingProps) => (
    <Table.Root size={{ base: "sm", md: "md"}}>
        <Table.Header>
            <Table.Row>
                {columns.map((column) => (
                    <Table.ColumnHeader key={column} w="sm">{column}</Table.ColumnHeader>
                ))}
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {[...Array(5)].map(() => (
                <Table.Row key={crypto.randomUUID()}>
                    {columns.map((column) => (
                        <Table.Cell key={`pending-cell-${column}-${crypto.randomUUID()}`}>
                            <SkeletonText noOfLines={1} />
                        </Table.Cell>
                    ))}
                </Table.Row>
            ))}
        </Table.Body>
    </Table.Root>
)

export default Pending