import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	type ApiError,
	type AppointmentPublic,
	AppointmentsService,
} from "@/client";
import { useAppointmentContext } from "@/components/Appointments/ProviderAppointment";
import {
	Calendar,
	type CalendarCellRange,
	type CalendarEvent,
	type OnCellClick,
	type OnEventClick,
	type OnEventDrop,
	type OnEventResize,
} from "@/components/Calendar";
import { useCalendarRanges } from "@/hooks/useCalendarRanges";
import useCustomToast from "@/hooks/useCustomToast";
import { dateToDatetimeLocal, handleError } from "@/utils";

interface ListAppointments {
	onSelectedEvent?: (event: AppointmentPublic | undefined) => void;
}

function getAppointments({ start, end }: { start: string; end: string }) {
	return {
		queryFn: () => AppointmentsService.readAppointments({ start, end }),
		queryKey: ["appointments", { start, end }],
	};
}

function ListAppointments({ onSelectedEvent }: ListAppointments) {
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();
	const { selectedRanges, onRangeChange } = useCalendarRanges();
	const { setSelectedAppointment, setSelectedSlot, setMode } =
		useAppointmentContext();
	const { data: appointments } = useQuery({
		...getAppointments({
			start: selectedRanges?.[0].toISOString() ?? "",
			end: selectedRanges?.[1].toISOString() ?? "",
		}),
		enabled: !!selectedRanges,
	});

	const mutation = useMutation<
		AppointmentPublic,
		ApiError,
		{
			id: number;
			data: {
				start: string;
				end: string;
			};
		}
	>({
		mutationFn: ({ id, data }) =>
			AppointmentsService.updateAppointment({ id, requestBody: data }),
		onSuccess: () => {
			showSuccessToast("Appointment updated successfully.");
			queryClient.invalidateQueries({ queryKey: ["appointments"] });
		},
		onError: handleError,
	});

	const onEventDrop: OnEventDrop | OnEventResize = (
		eventId: string,
		newStart: Date,
		newEnd: Date,
	) => {
		mutation.mutate({
			id: Number(eventId),
			data: {
				start: dateToDatetimeLocal(newStart),
				end: dateToDatetimeLocal(newEnd),
			},
		});
	};

	const onSelectEvent: OnEventClick = (event: CalendarEvent) => {
		const selected = appointments?.results.find(
			(a) => a.id === Number(event?.id),
		);
		setMode("view");
		setSelectedAppointment(selected || null);
		onSelectedEvent?.(selected);
	};

	const onSelectedSlot: OnCellClick = (range: CalendarCellRange) => {
		setSelectedAppointment(null);
		setSelectedSlot({ start: range.start, end: range.end });
	};

	return (
		<Calendar
			initialEvents={
				appointments?.results.map((a) => ({
					id: a.id.toString(),
					start: new Date(a.start),
					end: new Date(a.end),
					title: a?.customer?.full_name ?? "",
				})) ?? []
			}
			startHour={8}
			endHour={17}
			onCellClick={onSelectedSlot}
			onEventClick={onSelectEvent}
			onEventDrop={onEventDrop}
			onEventResize={onEventDrop}
			onViewRangeChange={onRangeChange}
		/>
	);
}

export default ListAppointments;
