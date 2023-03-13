import Dialog from '@mui/material/Dialog';

import { LocalizationProvider } from '@mui/x-date-pickers'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { Button, Box, TextField, Autocomplete, IconButton } from '@mui/material';
import { TimeSlot, DaySlot } from '@/helpers/time-slot';
import DeleteIcon from '@mui/icons-material/Delete';

import { uuidv4 } from '@firebase/util';
import { useState } from 'react';

import CheckboxGroup from '../layout/checkbox-group';

import { useStaffContext } from '@/context/staff';
import { useBlockingContext } from '@/context/blocking';

import { addDoc, collection, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import collectionType from '@/firebase/types';

const BlockingEditView = ({ calendar, bookingOpen, selectedSlot, setBookingOpen }) => {
	const {blockingList, setBlockingList} = useBlockingContext()
	
	const selectedTime = blockingList.find(b => b.id === selectedSlot.event.id).start
	const selectedTimeEnd = blockingList.find(b => b.id === selectedSlot.event.id).end
	const selectedDate = dayjs(new Date(selectedTime)).format('MM-DD-YYYY')
	const selectedHourStart = dayjs(new Date(selectedTime)).format('HH:mm')
	const selectedHourEnd = dayjs(new Date(selectedTimeEnd)).format('HH:mm')

	const [daySelect, setDaySelect] = useState([])
	const [blockingDate, setBlockingDate] = useState(selectedDate)
	const [blockStartTime, setBlockStartTime] = useState(selectedHourStart)
	const [blockEndTime, setBlockEndTime] = useState(selectedHourEnd)

	const calendarApi = calendar.current.getApi()

	const handleClose = () => {
		setBookingOpen(false)
	}

	const handleDaySelect = e => {
		if (!daySelect.includes(parseInt(e.target.value))) {
			setDaySelect([...daySelect, parseInt(e.target.value)])
		} else {
			setDaySelect( daySelect.filter( d => d !== parseInt(e.target.value) ) )
		}
	}

	const submitBlocking = async () => {
		const data = {
			resourceId: selectedSlot.event.resourceId,
			staff: doc ( db, collectionType.staff, selectedSlot.event.resourceId ),
		}

		if (daySelect.length > 0) {
			data.daysOfWeek = daySelect
			data.start = blockStartTime
			data.end = blockEndTime
		} else {
			data.start = new Date(new Date(blockingDate).setHours(blockStartTime.split(":")[0], blockStartTime.split(":")[1], 0, 0))
			data.end = new Date(new Date(blockingDate).setHours(blockEndTime.split(":")[0], blockEndTime.split(":")[1], 0, 0))
		}

		addDoc( collection( db, collectionType.offtime ), data).then( docRef => {
			data.id = docRef.id

			setBlockingList([...blockingList, data])
			calendarApi.addEvent( data, [ calendarApi.getResourceById( data.resourceId ) ] )
			setBookingOpen(false)
		} )
	}

	return (
		<Dialog open={bookingOpen} onClose={handleClose} className="text-sm">
			<Box className="min-w-400">
				<h2 className="text-white bg-primary py-2 text-center text-lg">Edit leave for {selectedSlot.event.getResources()[0].title}</h2>

				<div className="flex justify-between mt-8 px-2 gap-10 border-l-4 border-primary">
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker className=" border-r w-full"
							displayStaticWrapperAs="desktop"
							openTo="day"
							value={ blockingDate }
							onChange={ newDate => setBlockingDate(dayjs(newDate).format('MM-DD-YYYY')) }
							inputFormat="MM/DD/YYYY"
							disabled={ daySelect.length !== 0 }
							renderInput={ params => <TextField {...params} label="Date - mm/dd/yyyy" /> }
						/>
					</LocalizationProvider>
				</div>

				<div className="flex justify-between mt-8 px-2 gap-10 border-l-4 border-primary">
					<CheckboxGroup group={DaySlot} checkedState={daySelect} handleChange={handleDaySelect} />
				</div>

				<div className="flex justify-between mt-8 px-2 gap-10 border-l-4 border-primary">
					<div className="w-1/2">
						<FormControl fullWidth>
							<InputLabel id="time-select-label">From</InputLabel>
							<Select
								labelId="time-select-label"
								id="time-block-start"
								label="From"
								value={ blockStartTime }
								onChange={ e => setBlockStartTime(e.target.value) }
							>
								{
									TimeSlot.map(t => <MenuItem key={uuidv4()} value={t}>{t}</MenuItem>)
								}
							</Select>
						</FormControl>
					</div>

					<div className="w-1/2">
						<FormControl fullWidth>
							<InputLabel id="time-select-label">To</InputLabel>
							<Select
								labelId="time-select-label"
								id="time-block-end"
								label="To"
								value={ blockEndTime }
								onChange={ e => setBlockEndTime(e.target.value) }
							>
								{
									TimeSlot.map(t => <MenuItem key={uuidv4()} value={t}>{t}</MenuItem>)
								}
							</Select>
						</FormControl>
					</div>
				</div>

				<div className="flex justify-between mt-8 bg-slate-900">
					<div className="px-1 py-1 bg-gray-700">
						<IconButton onClick={() => {}} className="text-white w-full hover:bg-gray-800">
							<DeleteIcon />
						</IconButton>
					</div>

					<Button variant="outline" onClick={submitBlocking} 
						className="text-white bg-primary rounded-none hover:bg-primary-hover w-full p-3">
							Save
					</Button>
				</div>
			</Box>
		</Dialog>
	)
}

export default BlockingEditView