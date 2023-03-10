import { createContext, useContext, useState } from 'react';

const ServiceData = createContext(null)

const ServiceContextProvider = ({ children }) => {
	const [serviceList, setServiceList] = useState([])

    return (
        <ServiceData.Provider value={{ serviceList, setServiceList }}>
            {children}
        </ServiceData.Provider>
    );
}

const useServiceContext = () => {
	return useContext(ServiceData);
}

export { ServiceData, ServiceContextProvider, useServiceContext }