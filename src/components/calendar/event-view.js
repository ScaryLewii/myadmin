import CreateIcon from '@mui/icons-material/Create';

const EventView = booking => {
	if (!booking.event.title) {
		return (
			<div className=" bg-slate-400 w-full h-full text-slate-400 p-1 hover:text-black cursor-pointer js-block-event">
				<CreateIcon fontSize="inherit" className="mr-1" />
				Edit leave
			</div>
		)
	}

	let isComplete = booking.event.extendedProps.status === 1 ? true : false

	return (
		<div className={`h-full p-1 rounded-sm border border-l-4 cursor-pointer
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