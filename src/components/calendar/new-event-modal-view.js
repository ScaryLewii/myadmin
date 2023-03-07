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
import TimeSlot from '@/helpers/time-slot';

import { uuidv4 } from '@firebase/util';
import { useState } from 'react';
import TabPanel from '../layout/tab';

import { createBooking } from '@/firebase/functions';

const NewEventModalView = ({ newBookingOpen, selectedSlot, setNewBookingOpen, clients, staffs, services }) => {
	const [tabIndex, setTabIndex] = useState(0)
	const [bookingClient, setBookingClient] = useState(null)
	const [bookingService, setBookingService] = useState(null)
	const [bookingStaff, setBookingStaff] = useState(staffs.filter(s => s.id === selectedSlot.resource.id)[0].id)
	const [bookingDate, setBookingDate] = useState(dayjs(selectedSlot.date).format('DD-MM-YYYY'))
	const [bookingTime, setBookingTime] = useState(dayjs(selectedSlot.date).format('HH:00'))
	const [blockStartTime, setBlockStartTime] = useState(dayjs(selectedSlot.date).format('HH:00'))
	const [blockEndTime, setBlockEndTime] = useState(dayjs(selectedSlot.date).format('HH:00'))

	const handleClose = () => {
		setNewBookingOpen(false)
	}

	const handleTabSwitch = (e, newIndex) => {
		setTabIndex(newIndex)
	}

	const submitBooking = async () => {
		createBooking( bookingClient, bookingStaff, bookingService, bookingDate, bookingTime )
			.then( () => handleClose() )
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
						clients && 
						<div className="flex justify-between my-8 px-2 gap-10 border-l-4 border-primary">
							<Autocomplete
								id="staff-selector"
								options={[...Object.values(clients)]}
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
						staffs && 
						<div className="flex justify-between my-8 px-2 gap-10 border-l-4 border-primary">
							<Autocomplete
								id="staff-selector"
								options={[...Object.values(staffs)]}
								sx={{ width: "100%" }}
								onChange={(e, v) => setBookingStaff(v.id)}
								value={staffs.filter(s => s.id === selectedSlot.resource.id)[0]}
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
								displayStaticWrapperAs="desktop"
								openTo="day"
								value={ bookingDate }
								onChange={ newDate => setBookingDate(newDate) }
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
									value={ bookingTime }
									onChange={ (e, newTime) => setBookingTime(newTime) }
								>
									{
										TimeSlot.map(t => <MenuItem key={uuidv4()} value={t}>{t}</MenuItem>)
									}
								</Select>
							</FormControl>
						</div>
					</div>

					<div className="flex justify-between mt-8 bg-slate-900">
						<Button variant="outline" onClick={submitBooking} className="text-white bg-primary rounded-none hover:bg-primary-hover w-full p-3">
							Book
						</Button>
					</div>
				</TabPanel>

				<TabPanel value={tabIndex} index={1}>
					{
						staffs && 
						<div className="flex justify-between my-8 px-2 gap-10 border-l-4 border-primary">
							<Autocomplete
								id="staff-blocker"
								options={[...Object.values(staffs)]}
								sx={{ width: "100%" }}
								onChange={(e, v) => setBookingStaff(v.id)}
								value={staffs.filter(s => s.id === selectedSlot.resource.id)[0]}
								renderInput={(params) => <TextField {...params} label="Staff" />}
							/>
						</div>
					}

					<div className="flex justify-between mt-8 px-2 gap-10 border-l-4 border-primary">
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker className=" border-r w-full"
								displayStaticWrapperAs="desktop"
								openTo="day"
								value={ bookingDate }
								onChange={ newDate => setBookingDate(newDate) }
								renderInput={ params => <TextField {...params} label="Date - dd/mm/yy" /> }
							/>
						</LocalizationProvider>
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
									onChange={ (e, v) => setBlockStartTime(v) }
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
									onChange={ (e, v) => setBlockEndTime(v) }
								>
									{
										TimeSlot.map(t => <MenuItem key={uuidv4()} value={t}>{t}</MenuItem>)
									}
								</Select>
							</FormControl>
						</div>
					</div>

					<div className="flex justify-between mt-8 bg-slate-900">
						<Button variant="outline" className="text-white bg-primary rounded-none hover:bg-primary-hover w-full p-3">
							Block
						</Button>
					</div>
				</TabPanel>
			</Box>
		</Dialog>
	)
}

export default NewEventModalView