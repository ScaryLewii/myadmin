import BlockingEditView from './blocking-edit-view';
import EventEditView from './event-edit-view';

const EventModalView = ({ calendar, bookingOpen, selectedBooking, setBookingOpen }) => {
// handleLoyaltyPoint,
	if (!selectedBooking.event.extendedProps.staff || !selectedBooking.event.extendedProps.service) {
		return <BlockingEditView calendar={calendar} bookingOpen={bookingOpen} selectedSlot={selectedBooking} setBookingOpen={setBookingOpen} />
	}

	return <EventEditView calendar={calendar} bookingOpen={bookingOpen} selectedBooking={selectedBooking} setBookingOpen={setBookingOpen} />
}

export default EventModalView