import { getDocsByMonths, getDocById } from '@/firebase/utils';
import { db } from '@/firebase/config';
import { addMinutes } from '@/ultilities/time'
import collectionType from '@/firebase/types';
import { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs, query, Timestamp, where } from 'firebase/firestore';
import dayjs from 'dayjs';

const BookingData = createContext(null)

const BookingContextProvider = ({ children }) => {
	const [bookingList, setBookingList] = useState([])

    useEffect(() => {
        const fetchBookings = async () => {
            const dateBefore = Timestamp.fromDate(new Date( dayjs(new Date()).subtract(2, 'month') ))
            const dateAfter = Timestamp.fromDate(new Date( dayjs(new Date()).add(3, 'month')) )
            const q = query(
                            collection(db, collectionType.booking),
                            where("bookingTime", ">", dateBefore),
                            where("bookingTime", "<", dateAfter),
                        )
            const querySnapShot = await getDocs(q)
            const results = querySnapShot.docs.map(doc => ({...doc.data(), id: doc.id}))
            const data = []
            results.forEach(r => {
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

                    data.push(JSON.parse(JSON.stringify(bookingObj)))
                } ).then(() => setBookingList(data))
            })
        }
    
        fetchBookings()
    }, [])

    return (
        <BookingData.Provider value={{ bookingList, setBookingList }}>
            {children}
        </BookingData.Provider>
    );
}

const useBookingContext = () => {
	return useContext(BookingData);
}

export { BookingData, BookingContextProvider, useBookingContext }