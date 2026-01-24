import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {
	type ApiError,
	type AppointmentPublic,
	AppointmentsService,
} from "@/client";
import { useCalendarLocalizer } from "@/hooks/useCalendarLocalizer";
import { useCalendarRanges } from "@/hooks/useCalendarRanges";
import useCustomToast from "@/hooks/useCustomToast";
import { dateToDatetimeLocal, handleError } from "@/utils";
import EventAppointment from "./EventAppointment";
import { useAppointmentContext } from "./ProviderAppointment";

const DnDCalendar = withDragAndDrop<CalendarEvent, object>(Calendar);

interface CalendarEvent {
	id: number;
	start: Date;
	end: Date;
	full_name?: string;
}

export interface ListAppointments {
	onSelectedEvent?: (event: AppointmentPublic | undefined) => void;
}

function getAppointments({ start, end }: { start: string; end: string }) {
	return {
		queryFn: () => AppointmentsService.readAppointments({ start, end }),
		queryKey: ["appointments", { start, end }],
	};
}

export default function ListAppointments({
	onSelectedEvent,
}: ListAppointments) {
	const localizer = useCalendarLocalizer();
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();
	const { setSelectedAppointment, setSelectedSlot, setMode } =
		useAppointmentContext();

	const {
		currentDate,
		currentView,
		selectedRanges,
		minTime,
		maxTime,
		onNavigate,
		onRangeChange,
		onViewChange,
	} = useCalendarRanges();

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

	const onEventDrop = ({ event, start, end }: any) => {
		mutation.mutate({
			id: event.id,
			data: {
				start: dateToDatetimeLocal(start),
				end: dateToDatetimeLocal(end),
			},
		});
	};

	const onSelectEvent = (event: any) => {
		const selected = appointments?.results.find((a) => a.id === event?.id);
		setMode("view");
		setSelectedAppointment(selected || null);
		onSelectedEvent?.(selected);
	};

	const onSelectedSlot = (slot: { start: Date; end: Date }) => {
		setSelectedAppointment(null);
		setSelectedSlot({ start: slot.start, end: slot.end });
	};

	if (!localizer) return <div>Loading calendar...</div>;

	return (
		<DnDCalendar
			view={currentView}
			date={currentDate}
			localizer={localizer}
			events={
				appointments?.results.map((a) => ({
					id: a.id,
					start: new Date(a.start),
					end: new Date(a.end),
					full_name: a?.customer?.full_name,
				})) ?? []
			}
			min={minTime}
			max={maxTime}
			onEventDrop={onEventDrop}
			onRangeChange={onRangeChange}
			onView={onViewChange}
			onNavigate={onNavigate}
			selectable
			onSelectEvent={onSelectEvent}
			onSelectSlot={onSelectedSlot}
			components={{ event: EventAppointment }}
			style={{ height: "calc(100vh - 110px)", width: "100%" }}
		/>
	);
}
