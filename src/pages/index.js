import { useCallback, useEffect, useRef, useState } from 'react'

import { db } from '@/firebase/config'
import { getCollection, getDocById, getDocsByDate } from '@/firebase/utils'
import collectionType from '@/firebase/types'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { StaticDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import TextField from '@mui/material/TextField'

import FullCalendar from '@fullcalendar/react'
import resourceDayGridPlugin from "@fullcalendar/resource-daygrid"
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import interactionPlugin from "@fullcalendar/interaction"

import EventView from '@/components/calendar/event-view'
import { addMinutes } from '@/ultilities/time'
import EventModalView from '@/components/calendar/event-modal-view'
import { getBookingsByDate, getClientList, getServiceList, getStaffList } from '@/firebase/functions'
import NewEventModalView from '@/components/calendar/new-event-modal-view'

export default function Home({ clients, staffs, services }) {
  const [selectedDate, setSelectedDate] = useState(new Date(new Date().setHours(0, 0, 0, 1))) // 0
  const [bookings, setBookings] = useState(null) // 1

  const [bookingOpen, setBookingOpen] = useState(false) // 2
  const [selectedBooking, setSelectedBooking] = useState(null) // 3

  const [newBookingOpen, setNewBookingOpen] = useState(false) // 4
  const [selectedSlot, setSelectedSlot] = useState(null) // 5

  const calendarRef = useRef(null)

  const handleEventClick = bookingEvent => {
    setBookingOpen(true)
    setSelectedBooking(bookingEvent)
  }

  const handleDateClick = slotInfo => {
    setNewBookingOpen(true)
    setSelectedSlot(slotInfo)
  }

  const handleDateChange = value => {
		// setSelectedDate(value)
	}

  const getBookingList = selectedDate => {
    let data = []
    getBookingsByDate(selectedDate, data, setBookings)
  }

  useEffect(() => {
    getBookingList(selectedDate)
  }, [selectedDate])

  const handleCalendarDateChange = date => {
    setSelectedDate( date )
    const calendarApi = calendarRef.current.getApi()
    // console.log(calendarApi)
    calendarApi.gotoDate( new Date( date ) )
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
          resources={ staffs }
          dayMaxEventRows
          editable
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
          events={ bookings }
          eventContent={ EventView }
          eventBackgroundColor="rgba(0,0,0,0)"
          eventBorderColor="rgba(0,0,0,0)"
          eventTextColor="#000"
          eventClick={ handleEventClick }
          dateClick={ handleDateClick }
        />
      </div>

      {
        selectedBooking && 
        <EventModalView
          bookingOpen = {bookingOpen}
          setBookingOpen = {setBookingOpen}
          selectedBooking = {selectedBooking}
          staffs = {staffs}
          services = {services}
        />
      }

      {
        selectedSlot &&
        <NewEventModalView
          newBookingOpen = {newBookingOpen}
          setNewBookingOpen = {setNewBookingOpen}
          selectedSlot = {selectedSlot}
          clients = {clients}
          staffs = {staffs}
          services = {services}
        />
      }
    </section>
  )
}

export async function getServerSideProps() {
  const clients = await getClientList()
  const staffs = await getStaffList()
  const services = await getServiceList()

  return {
    props: {
      clients,
      staffs,
      services
    }
  }
}