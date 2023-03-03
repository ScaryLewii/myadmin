import { useCallback, useEffect, useRef, useState } from 'react'

import { db } from '@/firebase/config'
import { getCollection, getDocById, getDocsByDate } from '@/firebase/utils-common'
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
import { getStaffList } from '@/firebase/utils'

export default function Home() {
  const [staffs, setStaffs] = useState(null) // 0
  const [selectedDate, setSelectedDate] = useState(new Date(new Date().setHours(0, 0, 0, 1))) // 1
  const [bookings, setBookings] = useState(null) // 2

  const [bookingOpen, setBookingOpen] = useState(false) // 3
  const [loyaltyPoint, setLoyaltyPoint] = useState(0) // 4
  const [selectedBooking, setSelectedBooking] = useState(null) // 5

  const calendarRef = useRef(null)

  const handleEventClick = bookingEvent => {
    setBookingOpen(true)
    setSelectedBooking(bookingEvent)
  }

  const handleDateChange = value => {
		setSelectedDate(value)
	}

  const handleClose = () => {
		setBookingOpen( false )
		// setNewBookingOpen( false )
		// setTimeout(() => {
		// 	setAlert(false)
		// }, 3000);
	}

  const handleLoyaltyPoint = value => {
    setLoyaltyPoint(value)
  }

  const getBookingList = selectedDate => {
    const data = []

    console.log(selectedDate)

    getDocsByDate(db, collectionType.booking, "bookingTime", ">", selectedDate)
      .then(res => res.forEach(r => {
        let bookingObj = {}

        bookingObj.id = r.id
        bookingObj.resourceId = r.staff.id
        bookingObj.status = r.status
        
        const bookingTime = r.bookingTime;
        bookingObj.start = new Date( bookingTime.seconds * 1000 );

        const client = getDocById( db, collectionType.client, r.client.id )
        const service = getDocById( db, collectionType.service, r.service.id )
        const staff = getDocById( db, collectionType.staff, r.staff.id )

        Promise.all( [ client, staff, service ] ).then( v => {
          bookingObj.client = v[0]
          bookingObj.staff = v[1]
          bookingObj.service = v[2]

          bookingObj.title = v[0].name
          bookingObj.end = addMinutes( bookingTime, parseFloat(v[2].duration) ).toISOString();

          data.push( bookingObj )
        } ).then(() => setBookings( data ) )
      }))
  }

  const getStaffs = () => {
    getStaffList().then(data => setStaffs(data))
  }

  useEffect(() => {
    getBookingList(selectedDate)
  }, [selectedDate])

  useEffect(() => {
    getStaffs()
  }, [])

  // console.log(bookings)
  // console.log(staffs)

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
            right: "today"
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
          events={ bookings }
          eventContent={ EventView }
          eventBackgroundColor="rgba(0,0,0,0)"
          eventBorderColor="rgba(0,0,0,0)"
          eventTextColor="#000"
          eventClick={ handleEventClick }
          // dateClick={ newBooking }
        />
      </div>

      {
        selectedBooking && 
        <EventModalView
          bookingOpen = {bookingOpen}
          selectedBooking = {selectedBooking}
          staffs = {staffs}
          handleClose = {handleClose}
          handleDateChange = {handleDateChange}
          handleLoyaltyPoint = {handleLoyaltyPoint}
        />
      }

      {/* {
        bookings && bookings.map( b =>
          <p key={ b.id }>{ b.service.name }</p>
        )
      } */}
    </section>
  )
}
