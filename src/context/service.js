import { getCollection } from '@/firebase/utils';
import { db } from '@/firebase/config';
import collectionType from '@/firebase/types';
import { createContext, useContext, useState, useEffect } from 'react';

const ServiceData = createContext(null)

const ServiceContextProvider = ({ children }) => {
	const [serviceList, setServiceList] = useState([])

    useEffect(() => {
        const fetchService = async () => {
            const data = []

            await getCollection( db, collectionType.service, "name" ).then( res => res.forEach( s => {
                data.push({
                    id: s.id,
                    title: s.name,
                    label: s.name,
                    price: s.price,
                    duration: s.duration
                })
            } ) )

            setServiceList(data)
        }
        
        fetchService()
    }, [])

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