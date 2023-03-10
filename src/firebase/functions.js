import { db } from "./config"
import collectionType from "./types"
import { getCollection, getDocsByDate, getDocById, updateDocument, getDocsByMonths } from "./utils"
import { addMinutes } from '@/ultilities/time'
import { addDoc, collection, doc } from "firebase/firestore"
import dayjs from 'dayjs';

const getStaffList = () => {
	getCollection( db, collectionType.staff, "name" ).then( res => res.forEach( s => {
		data.push({
			id: s.id,
			title: s.name,
			label: s.name
		})
	} ) )
}

const getServiceList = () => {
	getCollection( db, collectionType.service, "name" ).then( res => res.forEach( s => {
		data.push({
			id: s.id,
			title: s.name,
			label: s.name,
			price: s.price,
			duration: s.duration
		})
	} ) )
}

const getClientList = () => {
	getCollection( db, collectionType.client, "name" ).then( res => res.forEach( c => {
		data.push({
			id: c.id,
			title: c.name,
			label: c.name,
			email: c.email ?? null,
			phone: c.phone ?? null
		})
	} ))
}

const getBlockingSlot = () => {
	getCollection( db, collectionType.offtime, "staff" ).then( res => res.forEach( offtime => {
		data.push({
			id: offtime.id,
			resourceId: offtime.staff.id,
			daysOfWeek: offtime.days,
			startTime: offtime.start + ":00",
			endTime: offtime.end + ":00",
			display: 'background'
		})
	} ))

}

const getBookingsByDate = async (selectedDate, tempArr, fn) => {
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
				bookingObj.staff.id = r.staff.id
				bookingObj.service = v[2]
				bookingObj.service.id = r.service.id

				bookingObj.title = v[0].name
				bookingObj.end = addMinutes( bookingTime, parseFloat(v[2].duration) ).toISOString();

				tempArr.push( bookingObj )
			} ).then(() => fn(tempArr))
		}))
}

const getBookingsByMonths = () => {
	getDocsByMonths(db, collectionType.booking, "bookingTime")
		.then(res => res.forEach(r => {
			let bookingObj = {}

			bookingObj.id = r.id
			bookingObj.resourceId = r.staff.id
			bookingObj.status = r.status
			
			const bookingTime = r.bookingTime;
			bookingObj.start = new Date( bookingTime.seconds * 1000 ).toISOString();

			const client = getDocById( db, collectionType.client, r.client.id )
			const service = getDocById( db, collectionType.service, r.service.id )
			const staff = getDocById( db, collectionType.staff, r.staff.id )

			Promise.all( [ client, staff, service ] ).then( v => {
				bookingObj.client = v[0]
				bookingObj.staff = v[1]
				bookingObj.staff.id = r.staff.id
				bookingObj.service = v[2]
				bookingObj.service.id = r.service.id

				bookingObj.title = v[0].name
				bookingObj.end = addMinutes( bookingTime, parseFloat(v[2].duration) ).toISOString();

				data.push( JSON.parse(JSON.stringify(bookingObj)) )
			} )
		}))
}

const createBooking = async ( clientId, staffId, serviceId, date, time ) => {
	const startHour = time.split(":")[0]
	const startMinute = time.split(":")[1]

	const docRef = await addDoc( collection( db, collectionType.booking ), {
		client: doc( db, collectionType.client, clientId ),
		staff: doc( db, collectionType.staff, staffId ),
		service: doc( db, collectionType.service, serviceId ),
		bookingTime: new Date(new Date(dayjs(date).format('DD-MM-YYYY')).setHours(startHour, startMinute, 0, 0)),
		status: 0
	} )

	return docRef
}

const completeBooking = async ( bookingId, refreshBookingList, bookingList ) => {
	const data = {
		status: 1
	}

	await updateDocument(db, collectionType.booking, bookingId, data)
}

const createBlocking = async ( staffId, days, startTime, endTime ) => {
	const docRef = await addDoc( collection( db, collectionType.offtime ), {
		staff: doc ( db, collectionType.staff, staffId ),
		days: days,
		start: startTime,
		end: endTime
	} )
}

export { getStaffList, getServiceList, getClientList, getBookingsByDate, getBookingsByMonths, getBlockingSlot, createBooking, createBlocking, completeBooking }