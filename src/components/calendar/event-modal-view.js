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
import { useAppContext } from "@/context/context"

const EventModalView = ({ bookingOpen, selectedBooking, setBookingOpen, staffs, services }) => {
//handleDateChange, handleLoyaltyPoint, deleteBooking, completeBooking
	const {bookingList, setBookingList, refresh, doRefresh} = useAppContext()

	const [selectedStaff, setSelectedStaff] = useState(staffs.filter(s => s.id === selectedBooking.event.extendedProps.staff.id)[0])
	const [selectedService, setSelectedService] = useState(services.filter(s => s.id === selectedBooking.event.extendedProps.service.id)[0])
	const [selectedDate, setSelectedDate] = useState(dayjs(selectedBooking.event.start).format('DD-MM-YYYY'))
	const [selectedTime, setSelectedTime] = useState(dayjs(selectedBooking.event.start).format('HH:mm'))

	const handleClose = () => {
		setBookingOpen(false)
	}

	const handleCompleteClick = async () => {
		// const data = {
		// 	status: 1
		// }
		// await updateDocument( db, collectionType.booking, selectedBooking.event.id, data )

		const newList = bookingList.map( b => {
			if ( b.id === selectedBooking.event.id ) {
				b.status = 1
			}

			return b
		})
		setBookingList(newList)
		doRefresh(!refresh)
		setBookingOpen(false)
	}

	const updateBooking = async () => {

	}

	const disabled = selectedBooking.event.extendedProps.status === 1 ? true : false

	return (
		<Dialog open={bookingOpen} onClose={handleClose} className="text-sm">
			<Box>
				<h2 className="px-4 py-4 mb-4 text-base text-white font-semibold bg-primary">
					{selectedBooking.event.title}
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
					staffs && 
					<div className="flex justify-between my-8 px-2 gap-10 border-l-4 border-primary">
						<Autocomplete
							id="staff-selector"
							options={[...Object.values(staffs)]}
							sx={{ width: "100%" }}
							onChange={(e, v) => setSelectedStaff(v)}
							value={selectedStaff}
							disabled={disabled}
							renderInput={(params) => <TextField {...params} label="Staff" />}
						/>
					</div>
				}

				{
					services &&
					<div className="flex justify-between my-8 px-2 gap-10 border-l-4 border-primary">
						<Autocomplete
							id="service-selector"
							options={[...Object.values(services)]}
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
							onChange={ newDate => handleDateChange(newDate) }
							renderInput={ params => <TextField {...params} label="Date - dd/mm/yy" /> }
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
								onChange={e => selectedTime(e.target.value)}
							>
								{
									TimeSlot.map(t => <MenuItem key={uuidv4()} value={t}>{t}</MenuItem>)
								}
							</Select>
						</FormControl>
					</div>
				</div>

				<div className="flex justify-between items-center gap-10 mt-8 px-2 border-l-4 border-primary">
					<label className="text-base w-1/2">Loyalty Points:</label>
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
					<div className="px-1 py-1 bg-gray-700 hover:bg-gray-800">
						<IconButton className="text-white w-full">
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
						<Button variant="outline" onClick={handleCompleteClick} className="w-full text-white bg-primary rounded-none hover:bg-primary-hover">
							Complete
						</Button>
					}

					<div className="px-1 py-1 bg-green-500 hover:bg-green-600">
						<IconButton onClick={updateBooking} className="text-white w-full">
							<BookmarksIcon />
						</IconButton>
					</div>
				</div>
			</Box>
		</Dialog>
	)
}

export default EventModalView