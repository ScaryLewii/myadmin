import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import DeleteIcon from '@mui/icons-material/Delete';

import { DatePicker } from '@mui/x-date-pickers';
import { Button, InputAdornment, TextField } from '@mui/material';

const EventModalView = ( bookingOpen, selectedBooking, handleClose, handleDateChange, handleLoyaltyPoint, deleteBooking, completeBooking ) => {
	console.log(selectedBooking)
	return (
		<Dialog open={bookingOpen} onClose={handleClose}>
			<DialogTitle>
				<strong>{ selectedBooking.event.title }</strong>
				<div className='record-client-info'>
					<p><MailOutlineIcon /> { selectedBooking.event.extendedProps.client.userEmail }</p>
					<p><PhoneInTalkIcon /> { selectedBooking.event.extendedProps.client.userPhone }</p>
				</div>
			</DialogTitle>
			<DialogContent>
				<DialogContentText className='record-client-service'>
					<h4 className='record-client-service__name'>{ selectedBooking.event.extendedProps.service.title }</h4>
					<p>{ `${selectedBooking.event.extendedProps.service.price} £` }</p>
				</DialogContentText>

				<DialogContentText className='record-client-date'>
					<h4 className='record-client-date__heading'>Date</h4>
					<DatePicker
						value={selectedBooking.event.start}
						onChange={handleDateChange}
						disabled={selectedBooking.event.extendedProps.booking.status === 1}
						renderInput={(params) => <TextField {...params} />}
						/>
				</DialogContentText>

				<DialogContentText className='record-client-lp'>
					<h4 className='record-client-lp__heading'>{`Points (total: ${selectedBooking.event.extendedProps.client.userLP})`}</h4>
					<div className='record-client-lp__point'>
						<TextField 
							sx={{ width: '15ch' }} variant="standard" disabled
							value={`+ ${selectedBooking.event.extendedProps.service.price} points`} />

						<TextField 
							sx={{ width: '15ch' }} variant="standard" type="number"
							InputProps={{
								startAdornment: <InputAdornment position="start">-</InputAdornment>,
								endAdornment: <InputAdornment position="start">points</InputAdornment>,
							}}
							onChange={ e => handleLoyaltyPoint(e.target.value) }
							disabled={selectedBooking.event.extendedProps.booking.status === 1}
							inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
					</div>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<div className='flex justify-between w-full'>
					<Button aria-label="delete booking" onClick={deleteBooking}>
						<DeleteIcon />
					</Button>
					<div>
						<Button variant="outline" onClick={handleClose}>Cancel</Button>
						<Button variant="contained" onClick={completeBooking}>Complete</Button>
					</div>
				</div>
				{/* <Button onClick={handleClose}>Save</Button> */}
			</DialogActions>
		</Dialog>
	)
}

export default EventModalView