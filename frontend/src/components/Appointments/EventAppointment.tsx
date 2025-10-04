type EventAppointmentProps = {
	event: any;
};

const EventAppointment = ({ event }: EventAppointmentProps) => {
	return (
		<div>
			<small>{event.full_name} </small>
		</div>
	);
};

export default EventAppointment;
