import { useEffect, useRef, useState } from 'react'

import { db } from '@/firebase/config'
import { getCollection, getDocById } from '@/firebase/utils'
import collectionType from '@/firebase/types'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { StaticDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import TextField from '@mui/material/TextField'
import dayjs from 'dayjs'

import FullCalendar from '@fullcalendar/react'
import resourceDayGridPlugin from "@fullcalendar/resource-daygrid"
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import interactionPlugin from "@fullcalendar/interaction"

import EventView from '@/components/calendar/event-view'
import { addMinutes } from '@/ultilities/time'
import EventModalView from '@/components/calendar/event-modal-view'

export default function Home() {
  const [bookings, setBookings] = useState(null) // 0
  const [staffs, setStaffs] = useState(null) // 1
  const [selectedDate, setSelectedDate] = useState(new Date()) // 2

  const [bookingOpen, setBookingOpen] = useState(false) // 3
  const [loyaltyPoint, setLoyaltyPoint] = useState(0) // 4
  const [selectedBooking, setSelectedBooking] = useState(null) // 5

  const calendarRef = useRef(null)

  const handleEventClick = bookingEvent => {
    // setBookingOpen(true)
    // setSelectedBooking(bookingEvent)
    console.log(bookingEvent.event)
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

  const getBookingList = () => {
    const data = []

    getCollection( db, collectionType.booking ).then( res => res.forEach( r => {
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
      } ).then( () => setBookings( data ) )
    }) )
  }

  const getStaffList = () => {
    const data = []

    getCollection( db, collectionType.staff ).then( res => res.forEach( s => {
      let staffObj = {}
      staffObj.id = s.id
      staffObj.title = s.name

      data.push( staffObj )
    } ) ).then( () => setStaffs( data ) )
  }

  useEffect(() => {
    getBookingList()
    getStaffList()
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
          bookingOpen
          selectedBooking
          handleClose
          handleDateChange
          handleLoyaltyPoint
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
