import Dialog from '@mui/material/Dialog';

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import DeleteIcon from '@mui/icons-material/Delete';

import { Button, Box, InputAdornment, TextField, Autocomplete } from '@mui/material';
import { useEffect, useState } from 'react';
import { getCollection, getDocById, getDocsByDate } from '@/firebase/utils-common'
import { db } from '@/firebase/config'
import collectionType from '@/firebase/types'

import { getServiceList, getStaffList } from '@/firebase/utils';

const EventModalView = ({ bookingOpen, selectedBooking, handleClose, handleDateChange, handleLoyaltyPoint, deleteBooking, completeBooking }) => {
	const [staffs, setStaffs] = useState(null) // 0
	const [services, setServices] = useState(null) // 0

	
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

	// staffs && console.log(staffs.filter(s => s.id === selectedBooking.event.extendedProps.staff.id))
	// console.log(dayjs(selectedBooking.event.start).format("DD-MM-YYYY"))
	return (
		<Dialog open={bookingOpen} onClose={handleClose} className="text-sm">
			<Box className="pb-2">
				<h2 className="px-4 py-2 mb-4 text-base text-white font-semibold bg-teal-500">
					{selectedBooking.event.title}
				</h2>

				<div className="flex justify-between mb-4 px-2 gap-10 border-l-4 border-teal-400">
					<div>
						<MailOutlineIcon className="mr-1" />
						{selectedBooking.event.extendedProps.client.email}
					</div>
					<div>
						<PhoneInTalkIcon className="mr-1" />
						{selectedBooking.event.extendedProps.client.phone ?? "(unknown)"}
					</div>
				</div>

				{
					staffs && 
					<div className="flex justify-between my-8 px-2 gap-10 border-l-4 border-teal-400">
						<Autocomplete
							disablePortal
							id="staff-selector"
							options={[...Object.values(staffs)]}
							sx={{ width: "100%" }}
							onChange={(e, v) => console.log(v)}
							value={staffs.filter(s => s.id === selectedBooking.event.extendedProps.staff.id)[0]}
							disabled={selectedBooking.event.extendedProps.status}
							renderInput={(params) => <TextField {...params} label="Staff" />}
						/>
					</div>
				}

				{
					services &&
					<div className="flex justify-between my-8 px-2 gap-10 border-l-4 border-teal-400">
						<Autocomplete
							disablePortal
							id="service-selector"
							options={[...Object.values(services)]}
							sx={{ width: "100%" }}
							onChange={(e, v) => console.log(v)}
							value={services.filter(s => s.id === selectedBooking.event.extendedProps.service.id)[0]}
							disabled={selectedBooking.event.extendedProps.status}
							renderInput={(params) => <TextField {...params} label="Service" />}
						/>
					</div>
				}

				<div className="flex justify-between my-8 px-2 gap-10 border-l-4 border-teal-400">
					{/* <DatePicker
						value={dayjs(selectedBooking.event.start).format("YYYY-MM-DD")}
						onChange={v => handleDateChange(v)}
						renderInput={(params) => <TextField {...params} />}
						/> */}
				</div>
			</Box>
		</Dialog>
	)
}

export default EventModalView