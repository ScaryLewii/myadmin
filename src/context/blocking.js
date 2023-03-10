import { getCollection } from '@/firebase/utils';
import { db } from '@/firebase/config';
import collectionType from '@/firebase/types';
import { createContext, useContext, useEffect, useState } from 'react';

const BlockingData = createContext(null)

const BlockingContextProvider = ({ children }) => {
	const [blockingList, setBlockingList] = useState([])

    useEffect(() => {
        const fetchBlocking = async () => {
            const data = []
            await getCollection( db, collectionType.offtime, "staff" ).then( res => res.forEach( offtime => {
                data.push({
                    id: offtime.id,
                    resourceId: offtime.staff.id,
                    daysOfWeek: offtime.days,
                    startTime: offtime.start + ":00",
                    endTime: offtime.end + ":00",
                    display: 'background'
                })
            } ))
            
            setBlockingList(data)
        }
        
        fetchBlocking()
    }, [])

    return (
        <BlockingData.Provider value={{ blockingList, setBlockingList }}>
            {children}
        </BlockingData.Provider>
    );
}

const useBlockingContext = () => {
	return useContext(BlockingData);
}

export { BlockingData, BlockingContextProvider, useBlockingContext }