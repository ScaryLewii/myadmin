import Dialog from '@mui/material/Dialog';

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarksIcon from '@mui/icons-material/Bookmarks';

import { LocalizationProvider } from '@mui/x-date-pickers'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { Button, Box, InputAdornment, TextField, Autocomplete, IconButton } from '@mui/material';
import { TimeSlot } from '@/helpers/time-slot';

import { uuidv4 } from '@firebase/util';
import { updateDocument } from '@/firebase/utils';
import { db } from '@/firebase/config';
import collectionType from '@/firebase/types';
import { useState } from 'react';
import { useBookingContext } from '@/context/booking';
import { useStaffContext } from '@/context/staff';
import { useServiceContext } from '@/context/service';
import { deleteDoc, doc } from 'firebase/firestore';

const EventEditView = ({ calendar, bookingOpen, selectedBooking, setBookingOpen }) => {
// handleLoyaltyPoint,
	const {bookingList, setBookingList} = useBookingContext()
	const {staffList, setStaffList} = useStaffContext()
	const {serviceList, setServiceList} = useServiceContext()

	const [selectedStaff, setSelectedStaff] = useState(staffList.find(s => s.id === selectedBooking.event.extendedProps.staff?.id))
	const [selectedService, setSelectedService] = useState(serviceList.find(s => s.id === selectedBooking.event.extendedProps.service?.id))
	const [selectedDate, setSelectedDate] = useState(dayjs(selectedBooking.event.start).format('MM-DD-YYYY'))
	const [selectedTime, setSelectedTime] = useState(dayjs(selectedBooking.event.start).format('HH:mm'))

	const calendarApi = calendar.current.getApi()

	const handleClose = () => {
		setBookingOpen(false)
	}

	const handleCompleteClick = async () => {
		await updateDocument( db, collectionType.booking, selectedBooking.event.id, {status: 1} )
		selectedBooking.event.setExtendedProp("status", 1)
		const newBookingList = bookingList.map(b => {
			if (b.id === selectedBooking.event.id) {
				return {
					...b, 
					status: 1
				}
			}
		
			return b;
		})

		setBookingList(newBookingList)
		setBookingOpen(false)
	}

	const deleteBooking = async () => {
		await deleteDoc( doc( db, collectionType.booking, selectedBooking.event.id) )
		selectedBooking.event.remove()
		setBookingList(bookingList.filter(b => b.id !== selectedBooking.event.id))
		setBookingOpen(false)
	}

	const updateBooking = async () => {
		const startHour = selectedTime.split(":")[0]
		const startMinute = selectedTime.split(":")[1]
		const startTime = new Date(new Date(selectedDate).setHours(startHour, startMinute, 0, 0)).toISOString()
		const endTime = dayjs(startTime).add(parseFloat(serviceList.find(s => s.id === selectedService.id).duration), "minute").toISOString()

		const data = {
			resourceId: selectedStaff.id,
			service: serviceList.find(s => s.id === selectedService.id),
			staff: staffList.find(s => s.id === selectedStaff.id),
			start: startTime,
			end: endTime
		}

		await updateDocument( db, collectionType.booking, selectedBooking.event.id, {
			staff: doc(db, collectionType.staff, selectedStaff.id),
			service: doc(db, collectionType.service, selectedService.id),
			bookingTime: new Date(new Date(selectedDate).setHours(startHour, startMinute, 0, 0)),
		})

		const newBookingList = bookingList.map(b => {
			if (b.id === selectedBooking.event.id) {
				return {
					...b, 
					resourceId: data.resourceId,
					staff: data.staff,
					start: data.start,
					end: data.end
				}
			}
		
			return b;
		})

		setBookingList(newBookingList)

		selectedBooking.event.setResources( [calendarApi.getResourceById( selectedStaff.id )] )
		selectedBooking.event.setStart( startTime )
		selectedBooking.event.setEnd( endTime )
		selectedBooking.event.setExtendedProp("service", selectedService)
		selectedBooking.event.setExtendedProp("staff", selectedStaff)

		setBookingOpen(false)
	}

	const disabled = selectedBooking.event.extendedProps.status === 1 ? true : false

	return (
		<Dialog open={bookingOpen} onClose={handleClose} className="text-sm">
			<Box>
				<h2 className="px-4 py-4 mb-4 text-base text-white font-semibold bg-primary flex justify-between">
					<span>{selectedBooking.event.title}</span>
					<span>Points: {selectedBooking.event.extendedProps.client.loyalty_point ??= 0}</span>
				</h2>

				<div className="flex justify-between mb-4 px-2 gap-10 border-l-4 border-primary">
					<div>
						<MailOutlineIcon className="mr-1" />
						{selectedBooking.event.extendedProps.client.email}
					</div>
					{
						selectedBooking.event.extendedProps.client.phone &&
						<div>
							<PhoneInTalkIcon className="mr-1" />
							{selectedBooking.event.extendedProps.client.phone}
						</div>
					}
				</div>

				{
					staffList && 
					<div className="flex justify-between my-8 px-2 gap-10 border-l-4 border-primary">
						<Autocomplete
							id="staff-selector"
							options={[...Object.values(staffList)]}
							sx={{ width: "100%" }}
							onChange={(e, v) => setSelectedStaff(v)}
							value={selectedStaff}
							disabled={disabled}
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
							onChange={(e, v) => setSelectedService(v)}
							value={selectedService}
							disabled={disabled}
							renderInput={(params) => <TextField {...params} label="Service" />}
						/>
					</div>
				}

				<div className="flex justify-between mt-8 px-2 gap-10 border-l-4 border-primary">
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker className=" border-r w-1/2"
							displayStaticWrapperAs="desktop"
							openTo="day"
							value={ selectedDate }
							disabled={disabled}
							onChange={ newDate => setSelectedDate(dayjs(newDate).format('MM/DD/YYYY')) }
							inputFormat="MM/DD/YYYY"
							renderInput={ params => <TextField {...params} label="Date - mm/dd/yy" /> }
						/>
					</LocalizationProvider>

					<div className="w-1/2">
						<FormControl fullWidth>
							<InputLabel id="time-select-label">Time</InputLabel>
							<Select
								labelId="time-select-label"
								id="time-select"
								label="Time"
								disabled={disabled}
								value={ selectedTime }
								onChange={e => setSelectedTime(e.target.value)}
							>
								{
									TimeSlot.map(t => <MenuItem key={uuidv4()} value={t}>{t}</MenuItem>)
								}
							</Select>
						</FormControl>
					</div>
				</div>

				<div className="flex justify-between items-center gap-10 mt-8 px-2 border-l-4 border-primary">
					<label className="text-base w-1/2">Points:</label>
					<div className="w-1/2 flex justify-between">
						<TextField 
							sx={{ width: '7ch' }} variant="standard" disabled
							value={selectedBooking.event.extendedProps.service.price}
							InputProps={{
								startAdornment: <InputAdornment position="start">+</InputAdornment>,
							}} />

						<TextField 
							sx={{ width: '7ch' }} variant="standard" type="number"
							InputProps={{
								startAdornment: <InputAdornment position="start">-</InputAdornment>,
							}}
							value="0"
							onChange={ e => setUsePoint(e.target.value) }
							disabled={disabled}
							inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
					</div>
				</div>

				<div className="flex justify-between mt-8 bg-slate-800">
					<div className="px-1 py-1 bg-gray-700">
						<IconButton onClick={deleteBooking} className="text-white w-full hover:bg-gray-800">
							<DeleteIcon />
						</IconButton>
					</div>

					{
						disabled &&
						<Button variant="outline" className="w-full text-white bg-gray-500 hover:bg-gray-500 rounded-none cursor-not-allowed">
							Completed
						</Button>
					}
					
					{
						!disabled &&
						<Button variant="outline" onClick={handleCompleteClick} className="w-full text-white bg-primary rounded-none hover:bg-primary-hover"
							disabled={selectedService == null || selectedStaff == null} 
						>
							Complete
						</Button>
					}

					<div className="px-1 py-1 bg-green-500">
						<IconButton onClick={updateBooking} className="text-white w-full hover:bg-green-600" 
							disabled={selectedService == null || selectedStaff == null} 
						>
							<BookmarksIcon />
						</IconButton>
					</div>
				</div>
			</Box>
		</Dialog>
	)
}

export default EventEditView