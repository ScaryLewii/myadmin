import Dialog from '@mui/material/Dialog';

import { LocalizationProvider } from '@mui/x-date-pickers'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { Button, Box, TextField, Autocomplete, IconButton, FormControlLabel, Checkbox } from '@mui/material';
import { TimeSlot, DaySlot } from '@/helpers/time-slot';
import DeleteIcon from '@mui/icons-material/Delete';

import { uuidv4 } from '@firebase/util';
import { useEffect, useState } from 'react';

import CheckboxGroup from '../layout/checkbox-group';

import { useBlockingContext } from '@/context/blocking';

import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import collectionType from '@/firebase/types';
import { updateDocument } from '@/firebase/utils';
import { useBookingContext } from '@/context/booking';

const BlockingEditView = ({ calendar, bookingOpen, selectedSlot, setBookingOpen }) => {
	const {blockingList, setBlockingList} = useBlockingContext()
	const {bookingList} = useBookingContext()
	
	const selectedTime = blockingList.find(b => b.id === selectedSlot.event.id).start
	const selectedTimeEnd = blockingList.find(b => b.id === selectedSlot.event.id).end
	const selectedDay = blockingList.find(b => b.id === selectedSlot.event.id).daysOfWeek ??= []

	let selectedTimeFormat = dayjs(new Date(selectedTime)).format('MM-DD-YYYY')
	const selectedDate = selectedTimeFormat == "Invalid Date" ? dayjs(new Date()).format('MM-DD-YYYY') : selectedTimeFormat
	const selectedHourStart = selectedTimeFormat == "Invalid Date" ? selectedTime : dayjs(new Date(selectedTime)).format('HH:mm')
	const selectedHourEnd = selectedTimeFormat == "Invalid Date" ? selectedTimeEnd : dayjs(new Date(selectedTimeEnd)).format('HH:mm')

	const [daySelect, setDaySelect] = useState(selectedDay)
	const [allDayCheck, setAllDayCheck] = useState(selectedSlot.event.allDay)
	const [blockingDate, setBlockingDate] = useState(selectedDate)
	const [blockStartTime, setBlockStartTime] = useState(selectedHourStart)
	const [blockEndTime, setBlockEndTime] = useState(selectedHourEnd)

	const [invalid, setInvalid] = useState(false)

	useEffect(() => {
		const checkValid = () => {
			const events = [...bookingList, ...blockingList].filter(e => e.id !== selectedSlot.event.id)
			events.forEach(e => {
				if (e.resourceId === selectedSlot.event.resourceId && e.id !== selectedSlot.event.id) {
					console.log(e)
				console.log(blockStartTime)
				console.log(blockEndTime)
				console.log(daySelect)
				console.log(allDayCheck)
				}
			})
		}

		checkValid()

	}, [daySelect, blockStartTime, blockEndTime, allDayCheck])

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

	const deleteBlocking = async () => {
		await deleteDoc( doc( db, collectionType.offtime, selectedSlot.event.id || selectedSlot.event.publicId) )
		selectedSlot.event.remove()
		setBlockingList(blockingList.filter(b => b.id !== selectedSlot.event.id))
		setBookingOpen(false)
	}

	const submitBlocking = async () => {
		const data = {
			resourceId: selectedSlot.event.resourceId || selectedSlot.event.getResources()[0].id,
			staff: doc ( db, collectionType.staff, selectedSlot.event.resourceId || selectedSlot.event.getResources()[0].id),
			allDay: allDayCheck
		}

		if (daySelect?.length > 0) {
			data.daysOfWeek = daySelect
			data.start = blockStartTime
			data.end = blockEndTime
		} else {
			data.start = new Date(new Date(blockingDate).setHours(blockStartTime.split(":")[0], blockStartTime.split(":")[1], 0, 0))
			data.end = new Date(new Date(blockingDate).setHours(blockEndTime.split(":")[0], blockEndTime.split(":")[1], 0, 0))
		}

		await updateDocument( db, collectionType.offtime, selectedSlot.event.id, data)

		const newBlockingList = blockingList.map(b => {
			if (b.id === selectedSlot.event.id) {
				return {
					...b,
					daysOfWeek: data.daysOfWeek || [],
					resourceId: data.resourceId,
					staff: data.staff,
					start: data.start,
					end: data.end,
					allDay: data.allDay
				}
			}
		
			return b;
		})

		setBlockingList(newBlockingList)

		selectedSlot.event.setResources( [ calendarApi.getResourceById( data.resourceId ) ] )
		selectedSlot.event.setStart( data.start )
		selectedSlot.event.setEnd( data.end )
		selectedSlot.event.setExtendedProp("staff", data.staff)
		selectedSlot.event.setAllDay( data.allDay )

		setBookingOpen(false)
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
							disabled={ daySelect?.length !== 0 }
							renderInput={ params => <TextField {...params} label="Date - mm/dd/yyyy" /> }
						/>
					</LocalizationProvider>
				</div>

				<div className="flex justify-between mt-8 px-2 gap-10 border-l-4 border-primary">
					<CheckboxGroup group={DaySlot} checkedState={daySelect} handleChange={handleDaySelect} />
				</div>

				<div className="flex justify-between mt-8 px-2 gap-10 border-l-4 border-primary">
					<FormControlLabel control={<Checkbox value={allDayCheck} checked={allDayCheck} onChange={() => setAllDayCheck(!allDayCheck)} />} label="All day" />
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
								disabled={ allDayCheck }
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
								disabled={ allDayCheck }
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
						<IconButton onClick={deleteBlocking} className="text-white w-full hover:bg-gray-800">
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