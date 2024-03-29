import { useEffect, useRef, useState } from 'react'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { StaticDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import TextField from '@mui/material/TextField'

import FullCalendar from '@fullcalendar/react'
import resourceDayGridPlugin from "@fullcalendar/resource-daygrid"
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import interactionPlugin from "@fullcalendar/interaction"

import EventView from '@/components/calendar/event-view'
import EventModalView from '@/components/calendar/event-modal-view'
import { getBlockingSlot, getClientList, getServiceList, getStaffList, getBookingsByMonths } from '@/firebase/functions'
import NewEventModalView from '@/components/calendar/new-event-modal-view'

import { useServiceContext } from '@/context/service'
import { useStaffContext } from '@/context/staff'
import { useClientContext } from '@/context/client'
import { useBookingContext } from '@/context/booking'
import { useBlockingContext } from '@/context/blocking'

export default function Home() {
	const {serviceList} = useServiceContext()
	const {staffList} = useStaffContext()
	const {clientList} = useClientContext()
	const {bookingList} = useBookingContext()
	const {blockingList} = useBlockingContext()
	
	const [selectedDate, setSelectedDate] = useState(new Date(new Date().setHours(0, 0, 0, 1))) // 0
	const [events, setEvents] = useState([])

	const [bookingOpen, setBookingOpen] = useState(false)
	const [selectedBooking, setSelectedBooking] = useState(null)

	const [newBookingOpen, setNewBookingOpen] = useState(false)
	const [selectedSlot, setSelectedSlot] = useState(null)

	const calendarRef = useRef(null)

	const handleEventClick = bookingEvent => {
		setBookingOpen(true)
		setSelectedBooking(bookingEvent)
	}

	const handleDateClick = slotInfo => {
		if (slotInfo.jsEvent.target.classList.contains('js-block-event')) {
			return
		}

		setNewBookingOpen(true)
		setSelectedSlot(slotInfo)
	}

	useEffect(() => {
		const updateEvents = () => {
			setEvents([...bookingList, ...blockingList])
			// calendarRef.current.getApi().getEvents()
		}

		updateEvents()
	}, [bookingList, blockingList])

	const handleCalendarDateChange = date => {
		setSelectedDate( date )
		calendarRef.current.getApi().gotoDate( new Date( date ) )
	}

	return (
		<section className="flex">
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<StaticDatePicker className="bg-slate-100 border-r"
					displayStaticWrapperAs="desktop"
					openTo="day"
					value={ selectedDate }
					onChange={ newDate => handleCalendarDateChange(newDate) }
					renderInput={ params => <TextField {...params} /> }
				/>
			</LocalizationProvider>

			<div className="w-full pt-2">
				<FullCalendar
					headerToolbar={{
						left: "",
						center: "title",
						right: ""
					}}
					plugins={[
						resourceDayGridPlugin,
						resourceTimeGridPlugin,
						interactionPlugin
					]}
					allDaySlot={ false }
					slotMinTime={"10:00:00"}
					slotMaxTime={"20:00:00"}
					expandRows={ true }
					initialView="resourceTimeGridDay"
					nowIndicator
					resources={ staffList }
					dayMaxEventRows
					droppable
					ref={calendarRef}
					slotLabelFormat={{
						hour: '2-digit',
						minute: '2-digit',
						meridiem: false,
						hour12: false
					}}
					eventTimeFormat= {{
						hour: '2-digit',
						minute: '2-digit',
						meridiem: false,
						hour12: false
					}}
					events={ events }
					eventContent={ EventView }
					eventMinWidth={40}
					eventBackgroundColor="rgba(0,0,0,0)"
					eventBorderColor="rgba(0,0,0,0)"
					eventTextColor="#000"
					eventClick={ handleEventClick }
					dateClick={ handleDateClick }
					selectMinDistance={1}
				/>
			</div>

			{
				bookingOpen && 
				<EventModalView
					calendar= {calendarRef}
					bookingOpen = {bookingOpen}
					setBookingOpen = {setBookingOpen}
					selectedBooking = {selectedBooking}
				/>
			}

			{
				newBookingOpen &&
				<NewEventModalView
					calendar= {calendarRef}
					newBookingOpen = {newBookingOpen}
					setNewBookingOpen = {setNewBookingOpen}
					selectedSlot = {selectedSlot}
					clients = {clientList}
					staffs = {staffList}
					services = {serviceList}
				/>
			}
		</section>
	)
}