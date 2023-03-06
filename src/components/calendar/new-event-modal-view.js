import Dialog from '@mui/material/Dialog';

import { LocalizationProvider } from '@mui/x-date-pickers'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { Button, Box, TextField, Autocomplete } from '@mui/material';
import TimeSlot from '@/helpers/time-slot';

import { uuidv4 } from '@firebase/util';

const NewEventModalView = ({ newBookingOpen, selectedSlot, setNewBookingOpen, clients, staffs, services }) => {
	const handleClose = () => {
		setNewBookingOpen(false)
	}

	return (
		<Dialog open={newBookingOpen} onClose={handleClose} className="text-sm">
			<Box>
				<h2 className="px-4 py-4 mb-4 text-base text-white font-semibold bg-teal-500">New Booking</h2>

				{
					clients && 
					<div className="flex justify-between my-8 px-2 gap-10 border-l-4 border-teal-400">
						<Autocomplete
							id="staff-selector"
							options={[...Object.values(clients)]}
							sx={{ width: "100%" }}
							onChange={(e, v) => console.log(v)}
							getOptionLabel={(option) => option.title}
							renderOption={(props, option, { selected }) => (
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
					<div className="flex justify-between my-8 px-2 gap-10 border-l-4 border-teal-400">
						<Autocomplete
							id="staff-selector"
							options={[...Object.values(staffs)]}
							sx={{ width: "100%" }}
							onChange={(e, v) => console.log(v)}
							value={staffs.filter(s => s.id === selectedSlot.resource.id)[0]}
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

				<div className="flex justify-between mt-8 px-2 gap-10 border-l-4 border-teal-400">
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker className=" border-r w-1/2"
							displayStaticWrapperAs="desktop"
							openTo="day"
							value={ dayjs(selectedSlot.date).format('DD-MM-YYYY') }
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
								value={ dayjs(selectedSlot.date).format('HH:00') }
							>
								{
									TimeSlot.map(t => <MenuItem key={uuidv4()} value={t}>{t}</MenuItem>)
								}
							</Select>
						</FormControl>
					</div>
				</div>

				<div className="flex justify-between mt-8 bg-slate-900">
					<Button variant="outline" className="text-white bg-teal-500 rounded-none hover:bg-teal-600 w-full">
						Book
					</Button>
				</div>
			</Box>
		</Dialog>
	)
}

export default NewEventModalView