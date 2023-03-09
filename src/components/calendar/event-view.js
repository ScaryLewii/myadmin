const EventView = booking => {
	if (!booking.event.title) {
		return <div className="bg-gray-900 w-full h-full"><span>{ booking.timeText }</span></div>
	}

	const isComplete = booking.event.extendedProps.status === 1 ? true : false

	return (
		<div className={`h-full p-1 rounded-sm border border-l-4
				${ isComplete ? 'border-black bg-slate-200' : 'border-primary bg-white' }
			`}>
			<div className="flex justify-between">
				<span>{ booking.timeText }</span>

				<strong className={`text-white  rounded-sm border px-1
							${ isComplete ? 'bg-black' : 'bg-primary' }
						`}>
					{ `${booking.event.extendedProps.service.price} £` }
				</strong>
			</div>
			<div>
				{/* <p>{ booking.event.extendedProps.service.name }</p> */}
				<strong>{ booking.event.title }</strong>
			</div>
		</div>
	)
}

export default EventView