const EventView = booking => {
	console.log(booking)
	return (
		<div className="h-full p-1 rounded-sm border border-black border-l-4 border-l-teal-400">
			<div className="flex justify-between">
				<span>{ booking.timeText }</span>
				<span>{ `(${booking.event.extendedProps.service.price} £)` }</span>
			</div>
			<div>
				{/* <p>{ booking.event.extendedProps.service.name }</p> */}
				<strong>{ booking.event.title }</strong>
			</div>
		</div>
	)
}

export default EventView