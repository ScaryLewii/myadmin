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
                const result = {
                    id: offtime.id,
                    resourceId: offtime.staff.id,
                    staff: offtime.staff,
                }

                if (offtime.daysOfWeek?.length > 0) {
                    result.daysOfWeek = offtime.daysOfWeek
                    result.start = offtime.start
                    result.end = offtime.end
                } else {
                    result.start = new Date( offtime.start.seconds * 1000 ).toISOString()
                    result.end = new Date( offtime.end.seconds * 1000 ).toISOString()
                }

                data.push(result)
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