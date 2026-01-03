import { Badge, Card, Flex, Heading, Tag } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Kanban } from "react-kanban-kit";

import {
	APPOINTMENT_STATUSES,
	type ApiError,
	type AppointmentStatus,
	AppointmentsService,
	type AppointmentUpdate,
} from "@/client";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import IntervalSelector from "../Common/IntervalSelector";

function getAppointments({ start, end }: { start: string; end: string }) {
	return {
		queryFn: () => AppointmentsService.readAppointments({ start, end }),
		queryKey: ["appointments", "activity", start, end],
	};
}

const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
	todo: "To do",
	in_progress: "In progress",
	waiting_parts: "Waiting parts",
	done: "Done",
	cancelled: "Cancelled",
};

const KanbanActivity = () => {
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();

	const [selectedRanges, setSelectedRanges] = useState<{
		start: Date;
		end: Date;
	} | null>(null);

	const { data: appointments } = useQuery({
		...getAppointments({
			start: selectedRanges?.start.toISOString() ?? "",
			end: selectedRanges?.end.toISOString() ?? "",
		}),
		enabled: !!selectedRanges,
	});

	const columns = APPOINTMENT_STATUSES.map((status) => {
		const cards =
			appointments?.results
				.filter((a) => a.status === status)
				.map(({ id, customer, description, vehicle }) => ({
					id: String(id),
					title: `${vehicle?.brand_name ?? ""} ${vehicle?.model_name ?? ""}`,
					type: "card",
					parentId: status,
					content: {
						customer: customer?.full_name,
						license_plate: vehicle?.license_plate,
						description,
					},
				})) ?? [];

		return {
			id: status,
			title: APPOINTMENT_STATUS_LABELS[status],
			children: cards.map((c) => c.id),
			totalChildrenCount: cards.length,
			parentId: "root",
			cards,
		};
	});

	const dataSource = {
		root: {
			id: "root",
			title: "Root",
			children: APPOINTMENT_STATUSES.slice(),
			totalChildrenCount: APPOINTMENT_STATUSES.length,
			parentId: null,
		},

		...columns.reduce(
			(acc, col) => {
				acc[col.id] = {
					id: col.id,
					title: col.title,
					children: col.children.slice(),
					totalChildrenCount: col.totalChildrenCount,
					parentId: "root",
				};

				col.cards.forEach((card) => {
					acc[card.id] = {
						...card,
						parentId: col.id,
					};
				});

				return acc;
			},
			{} as Record<string, any>,
		),
	};

	const mutation = useMutation({
		mutationFn: (data: { id: number; requestBody: AppointmentUpdate }) =>
			AppointmentsService.updateAppointment({
				id: data.id,
				requestBody: data.requestBody,
			}),
		onSuccess: () => {
			showSuccessToast("Appointment status updated successfully");
			queryClient.invalidateQueries({
				queryKey: ["appointments", "activity"],
			});
		},
		onError: (error: ApiError) => {
			handleError(error);
		},
	});

	const configMap = {
		card: {
			render: ({ data }: any) => (
				<Card.Root size="sm">
					<Card.Header>
						<Card.Title as="h6">{data.title}</Card.Title>
					</Card.Header>

					<Card.Body>
						<Card.Description>
							<Tag.Root>
								<Tag.Label>{data.content?.customer}</Tag.Label>
							</Tag.Root>
							<br />
							{data.content?.license_plate && (
								<strong>{data.content.license_plate}</strong>
							)}
							<br />
							{data.content?.description}
						</Card.Description>
					</Card.Body>

					<Card.Footer>
						{data.content?.priority && (
							<Tag.Root>
								<Tag.Label>{data.content.priority}</Tag.Label>
							</Tag.Root>
						)}
					</Card.Footer>
				</Card.Root>
			),
			isDraggable: true,
		},
	};

	return (
		<>
			<IntervalSelector
				onIntervalChange={(range) => {
					setSelectedRanges(range);
				}}
			/>

			<Kanban
				dataSource={dataSource}
				configMap={configMap}
				renderColumnHeader={(column) => (
					<Flex justify="space-between" align="center">
						<Heading size="sm">{column.title}</Heading>
						<Badge variant="surface">{column.totalChildrenCount}</Badge>
					</Flex>
				)}
				onCardMove={(move) => {
					mutation.mutate({
						id: Number(move.cardId),
						requestBody: { status: move.toColumnId as AppointmentStatus },
					});
				}}
			/>
		</>
	);
};

export default KanbanActivity;
