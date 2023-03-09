import { createContext, useContext, useState } from 'react';

const AppContext = createContext({
    clientList: [],
    setClientList: () => {},

    staffList: [],
    setStaffList: () => {},

    serviceList: [],
    setServiceList: () => {},

	bookingList: [],
	setBookingList: () => {},

	blockingList: [],
	setBlockingList: () => {},

	refresh: false,
	doRefresh: () => {}
})

const AppContextProvider = ({ children }) => {
	const [clientList, setClientList] = useState([])
	const [staffList, setStaffList] = useState([])
	const [serviceList, setServiceList] = useState([])
	const [bookingList, setBookingList] = useState([])
	const [blockingList, setBlockingList] = useState([])

	const [refresh, doRefresh] = useState(false)

    return (
        <AppContext.Provider value={{ 
			clientList, setClientList,
			staffList, setStaffList,
			serviceList, setServiceList,
			bookingList, setBookingList,
			blockingList, setBlockingList,
			refresh, doRefresh
		}}>
            {children}
        </AppContext.Provider>
    );
}

const useAppContext = () => {
	return useContext(AppContext);
}

export { AppContext, AppContextProvider, useAppContext }