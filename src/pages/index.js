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

export default function Home() {
  const [bookings, setBookings] = useState(null)
  const [staffs, setStaffs] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const calendarRef = useRef(null)

  const getBookingList = () => {
    const data = []

    getCollection( db, collectionType.booking ).then( res => res.forEach( r => {
      let bookingObj = {}

      bookingObj.id = r.id
      const client = getDocById( db, collectionType.client, r.client.id )
      const service = getDocById( db, collectionType.service, r.service.id )
      const staff = getDocById( db, collectionType.staff, r.staff.id )

      Promise.all( [ client, staff, service ] ).then( v => {
        bookingObj.client = v[0]
        bookingObj.staff = v[1]
        bookingObj.service = v[2]

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
    console.log(calendarApi)
    calendarApi.goToDate('2023-03-01')
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
          // initialEvents={ [
          // 	{"resourceId":"lzYkjcxmp6jWswt59iaU","title":"Repeating Event","start":"2023-01-09T16:00:00+00:00"},
          // ] }
          events={ bookings }
          // eventContent={ Record }
          // eventClick={ handleClickEvent }
          // dateClick={ newBooking }
        />
      </div>
      {/* {
        bookings && bookings.map( b =>
          <p key={ b.id }>{ b.service.name }</p>
        )
      } */}
    </section>
  )
}
