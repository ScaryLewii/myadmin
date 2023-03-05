import Dialog from '@mui/material/Dialog';

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import DeleteIcon from '@mui/icons-material/Delete';

import { LocalizationProvider } from '@mui/x-date-pickers'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { Button, Box, InputAdornment, TextField, Autocomplete, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import TimeSlot from '@/helpers/time-slot';

import { getServiceList, getStaffList } from '@/firebase/functions';
import { uuidv4 } from '@firebase/util';

const EventModalView = ({ bookingOpen, selectedBooking, handleClose, handleDateChange, handleLoyaltyPoint, deleteBooking, completeBooking }) => {
	const [staffs, setStaffs] = useState(null) // 0
	const [services, setServices] = useState(null) // 0

	const disabled = selectedBooking.event.extendedProps.status === 1 ? true : false
	
	useEffect(() => {
		const getStaffs = () => {
			getStaffList().then(list => setStaffs(list))
		}

		getStaffs()
	}, [])

	useEffect(() => {
		const getServices = () => {
			getServiceList().then(list => setServices(list))
		}
		
		getServices()
	}, [])

	return (
		<Dialog open={bookingOpen} onClose={handleClose} className="text-sm">
			<Box>
				<h2 className="px-4 py-4 mb-4 text-base text-white font-semibold bg-teal-500">
					{selectedBooking.event.title}
				</h2>

				<div className="flex justify-between mb-4 px-2 gap-10 border-l-4 border-teal-400">
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
					<div className="flex justify-between my-8 px-2 gap-10 border-l-4 border-teal-400">
						<Autocomplete
							id="staff-selector"
							options={[...Object.values(staffs)]}
							sx={{ width: "100%" }}
							onChange={(e, v) => console.log(v)}
							value={staffs.filter(s => s.id === selectedBooking.event.extendedProps.staff.id)[0]}
							disabled={disabled}
							renderInput={(params) => <TextField {...params} label="Staff" />}
						/>
					</div>
				}

				{
					services &&
					<div className="flex justify-between my-8 px-2 gap-10 border-l-4 border-teal-400">
						<Autocomplete
							id="service-selector"
							options={[...Object.values(services)]}
							sx={{ width: "100%" }}
							onChange={(e, v) => console.log(v)}
							value={services.filter(s => s.id === selectedBooking.event.extendedProps.service.id)[0]}
							disabled={disabled}
							renderInput={(params) => <TextField {...params} label="Service" />}
						/>
					</div>
				}

				<div className="flex justify-between mt-8 px-2 gap-10 border-l-4 border-teal-400">
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker className=" border-r w-1/2"
							displayStaticWrapperAs="desktop"
							openTo="day"
							value={ dayjs(selectedBooking.event.start).format('DD-MM-YYYY') }
							disabled={disabled}
							onChange={ newDate => handleDateChange(newDate) }
							renderInput={ params => <TextField {...params} label="Date" /> }
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
								value={ dayjs(selectedBooking.event.start).format('HH:mm') }
							>
								{
									TimeSlot.map(t => <MenuItem key={uuidv4()} value={t}>{t}</MenuItem>)
								}
							</Select>
						</FormControl>
					</div>
				</div>

				<div className="flex justify-between items-center gap-10 mt-8 px-2 border-l-4 border-teal-400">
					<label className="text-base w-1/2">Loyalty Points:</label>
					<di className="w-1/2 flex justify-between">
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
					</di>
				</div>

				<div className="flex justify-between mt-8 bg-slate-900">
					<div className="px-1 py-1 bg-gray-700 hover:bg-gray-800">
						<IconButton className="text-white">
							<DeleteIcon />
						</IconButton>
					</div>

					{
						disabled &&
						<Button variant="outline" className="text-white bg-gray-700 hover:bg-gray-700 rounded-none cursor-not-allowed">
							Completed
						</Button>
					}
					
					{
						!disabled &&
						<Button variant="outline" className="text-white bg-teal-500 rounded-none hover:bg-teal-600">
							Complete
						</Button>
					}
				</div>
			</Box>
		</Dialog>
	)
}

export default EventModalView