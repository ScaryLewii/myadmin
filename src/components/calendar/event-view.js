const EventView = booking => {
	return (
		<div className="p-1">
			<div className="flex justify-between">
				<span>{ booking.timeText }</span>
				<span>{ `${booking.event.extendedProps.service.price} £` }</span>
			</div>
			<div>
				{/* <p>{ booking.event.extendedProps.service.name }</p> */}
				<strong>{ booking.event.title }</strong>
			</div>
		</div>
	)
}

export default EventView