import Dialog from '@mui/material/Dialog';

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import DeleteIcon from '@mui/icons-material/Delete';

import { DatePicker } from '@mui/x-date-pickers';
import { Button, Box, InputAdornment, TextField, Autocomplete } from '@mui/material';
import { useEffect, useState } from 'react';
import { getCollection, getDocById, getDocsByDate } from '@/firebase/utils-common'
import { db } from '@/firebase/config'
import collectionType from '@/firebase/types'

import { getStaffList } from '@/firebase/utils';

const EventModalView = ({ bookingOpen, selectedBooking, handleClose, handleDateChange, handleLoyaltyPoint, deleteBooking, completeBooking }) => {
	const [staffs, setStaffs] = useState(null) // 0

	const getStaffs = () => {
		getStaffList().then(list => setStaffs(list))
	}
	useEffect(() => {
		getStaffs()
	}, [])

	console.log(selectedBooking.event.extendedProps)
	return (
		<Dialog open={bookingOpen} onClose={handleClose} className="text-sm">
			<Box className="py-2">
				<h2 className="p-2 text-sm font-semibold">
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

				<div className="flex justify-between mb-4 px-2 gap-10 border-l-4 border-teal-400">
					{
						staffs && <Autocomplete
							disablePortal
							id="staff-selector"
							options={[...Object.values(staffs)]}
							sx={{ width: 200 }}
							onChange={(e, v) => console.log(v)}
							renderInput={(params) => <TextField {...params} />}
							/>
					}
				</div>
			</Box>
		</Dialog>
	)
}

export default EventModalView