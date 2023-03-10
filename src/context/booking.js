import { createContext, useContext, useState } from 'react';

const BookingData = createContext(null)

const BookingContextProvider = ({ children }) => {
	const [bookingList, setBookingList] = useState([])

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