import Dialog from '@mui/material/Dialog';

import { LocalizationProvider } from '@mui/x-date-pickers'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { Button, Box, TextField, Autocomplete, Tabs, Tab } from '@mui/material';
import { TimeSlot, DaySlot } from '@/helpers/time-slot';

import { uuidv4 } from '@firebase/util';
import { useState } from 'react';
import TabPanel from '../layout/tab';

import CheckboxGroup from '../layout/checkbox-group';

import { useClientContext } from '@/context/client';
import { useBookingContext } from '@/context/booking';
import { useStaffContext } from '@/context/staff';
import { useServiceContext } from '@/context/service';
import { useBlockingContext } from '@/context/blocking';

import { addDoc, collection, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import collectionType from '@/firebase/types';

const NewEventModalView = ({ calendar, newBookingOpen, selectedSlot, setNewBookingOpen }) => {
	let selectedHour = dayjs(selectedSlot.date).format('HH:00')
	let selectedDate = dayjs(selectedSlot.date).format('MM-DD-YYYY')

	const {bookingList, setBookingList} = useBookingContext()
	const {blockingList, setBlockingList} = useBlockingContext()
	const {staffList, setStaffList} = useStaffContext()
	const {serviceList, setServiceList} = useServiceContext()
	const {clientList, setClientList} = useClientContext()

	const [tabIndex, setTabIndex] = useState(0)
	const [bookingClient, setBookingClient] = useState(null)
	const [bookingService, setBookingService] = useState(null)
	const [bookingStaff, setBookingStaff] = useState(staffList.find(s => s.id === selectedSlot.resource.id))
	const [bookingDate, setBookingDate] = useState(selectedDate)
	const [bookingTime, setBookingTime] = useState(selectedHour)

	const [daySelect, setDaySelect] = useState([])
	const [blockingDate, setBlockingDate] = useState(selectedDate)
	const [blockStartTime, setBlockStartTime] = useState(selectedHour)
	const [blockEndTime, setBlockEndTime] = useState(selectedHour)

	const calendarApi = calendar.current.getApi()

	const handleClose = () => {
		setNewBookingOpen(false)
	}

	const handleTabSwitch = (e, newIndex) => {
		setTabIndex(newIndex)
	}

	const handleDaySelect = e => {
		if (!daySelect.includes(parseInt(e.target.value))) {
			setDaySelect([...daySelect, parseInt(e.target.value)])
		} else {
			setDaySelect( daySelect.filter( d => d !== parseInt(e.target.value) ) )
		}
	}

	const submitBooking = () => {
		const startHour = bookingTime.split(":")[0]
		const startMinute = bookingTime.split(":")[1]
		const startTime = new Date(new Date(bookingDate).setHours(startHour, startMinute, 0, 0)).toISOString()
		const endTime = dayjs(startTime).add(parseFloat(serviceList.find(s => s.id === bookingService).duration), "minute").toISOString()

		const data = {
			resourceId: bookingStaff.id,
			status: 0,
			title: clientList.find(c => c.id === bookingClient).title,
			client: clientList.find(c => c.id === bookingClient),
			service: serviceList.find(s => s.id === bookingService),
			staff: staffList.find(s => s.id === bookingStaff.id),
			start: startTime,
			end: endTime
		}

		addDoc( collection( db, collectionType.booking ), {
			client: doc( db, collectionType.client, bookingClient ),
			staff: doc( db, collectionType.staff, bookingStaff.id ),
			service: doc( db, collectionType.service, bookingService ),
			bookingTime: new Date(new Date(bookingDate).setHours(startHour, startMinute, 0, 0)),
			status: 0
		} ).then( docRef => {
			data.id = docRef.id
			
			setBookingList([...bookingList, data])
			calendarApi.addEvent( data, [ calendarApi.getResourceById( bookingStaff.id ) ] )
			setNewBookingOpen(false)
		} )
	}

	const submitBlocking = async () => {
		const data = {
			resourceId: bookingStaff.id,
			staff: doc ( db, collectionType.staff, bookingStaff.id ),
			display: 'background',
			color: "black"
		}

		if (daySelect.length > 0) {
			data.daysOfWeek = daySelect
			data.start = blockStartTime
			data.end = blockEndTime
		} else {
			data.start = new Date(new Date(bookingDate).setHours(blockStartTime.split(":")[0], blockStartTime.split(":")[1], 0, 0))
			data.end = new Date(new Date(bookingDate).setHours(blockEndTime.split(":")[0], blockEndTime.split(":")[1], 0, 0))
		}

		addDoc( collection( db, collectionType.offtime ), data).then( docRef => {
			data.id = docRef.id

			setBlockingList([...blockingList, data])
			calendarApi.addEvent( data, [ calendarApi.getResourceById( data.resourceId ) ] )
			setNewBookingOpen(false)
		} )
	}

	return (
		<Dialog open={newBookingOpen} onClose={handleClose} className="text-sm">
			<Box className="min-w-400">
				<Tabs variant="fullWidth" value={tabIndex} onChange={handleTabSwitch} centered>
					<Tab label="New Booking" />
					<Tab label="Block Hour" />
				</Tabs>
				<TabPanel value={tabIndex} index={0}>
					{
						clientList && 
						<div className="flex justify-between my-8 px-2 gap-10 border-l-4 border-primary">
							<Autocomplete
								id="staff-selector"
								options={[...Object.values(clientList)]}
								sx={{ width: "100%" }}
								onChange={(e, v) => setBookingClient(v.id)}
								getOptionLabel={(option) => option.title}
								renderOption={(props, option) => (
									<li {...props}>
										<div>
											<h6>{option.title}</h6>
											<span className="text-xs text-gray-400">{option.email}</span>
										</div>
									</li>
								)}
								renderInput={(params) => <TextField {...params} label="Client" />}
							/>
						</div>
					}

					{
						staffList && 
						<div className="flex justify-between my-8 px-2 gap-10 border-l-4 border-primary">
							<Autocomplete
								id="staff-selector"
								options={[...Object.values(staffList)]}
								sx={{ width: "100%" }}
								onChange={(e, v) => setBookingStaff(v)}
								value={bookingStaff}
								renderInput={(params) => <TextField {...params} label="Staff" />}
							/>
						</div>
					}

					{
						serviceList &&
						<div className="flex justify-between my-8 px-2 gap-10 border-l-4 border-primary">
							<Autocomplete
								id="service-selector"
								options={[...Object.values(serviceList)]}
								sx={{ width: "100%" }}
								onChange={(e, v) => setBookingService(v.id)}
								getOptionLabel={(option) => option.title}
								renderOption={(props, option) => (
									<li {...props} >
										<h6>{option.title}</h6>
										<span className="text-xs text-gray-400 ml-3">({option.price} £)</span>
									</li>
								)}
								renderInput={(params) => <TextField {...params} label="Service" />}
							/>
						</div>
					}

					<div className="flex justify-between mt-8 px-2 gap-10 border-l-4 border-primary">
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker className=" border-r w-1/2"
								value={ bookingDate }
								onChange={ newDate => setBookingDate(dayjs(newDate).format('MM-DD-YYYY')) }
								inputFormat="MM/DD/YYYY"
								renderInput={ params => <TextField {...params} label="Date - mm/dd/yyyy" /> }
							/>
						</LocalizationProvider>

						<div className="w-1/2">
							<FormControl fullWidth>
								<InputLabel id="time-select-label">Time</InputLabel>
								<Select
									labelId="time-select-label"
									id="time-select"
									label="Time"
									value={ bookingTime }
									onChange={ e => setBookingTime(e.target.value) }
								>
									{
										TimeSlot.map(t => <MenuItem key={uuidv4()} value={t}>{t}</MenuItem>)
									}
								</Select>
							</FormControl>
						</div>
					</div>

					<div className="flex justify-between mt-8 bg-slate-900">
						<Button variant="outline"
							disabled={bookingService == null || bookingClient == null || bookingStaff == null} 
							onClick={submitBooking} className="text-white bg-primary rounded-none hover:bg-primary-hover w-full p-3">
							Book
						</Button>
					</div>
				</TabPanel>

				<TabPanel value={tabIndex} index={1}>
					{
						staffList && 
						<div className="flex justify-between my-8 px-2 gap-10 border-l-4 border-primary">
							<Autocomplete
								id="staff-blocker"
								options={[...Object.values(staffList)]}
								sx={{ width: "100%" }}
								onChange={(e, v) => setBookingStaff(v)}
								value={bookingStaff}
								renderInput={(params) => <TextField {...params} label="Staff" />}
							/>
						</div>
					}

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
						<Button variant="outline" onClick={submitBlocking} 
						disabled={bookingStaff == null} 
						className="text-white bg-primary rounded-none hover:bg-primary-hover w-full p-3">
							Block
						</Button>
					</div>
				</TabPanel>
			</Box>
		</Dialog>
	)
}

export default NewEventModalView