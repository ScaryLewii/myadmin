import { getCollection } from '@/firebase/utils';
import { db } from '@/firebase/config';
import collectionType from '@/firebase/types';
import { createContext, useContext, useEffect, useState } from 'react';

const StaffData = createContext(null)

const StaffContextProvider = ({ children }) => {
	const [staffList, setStaffList] = useState([])

    useEffect(() => {
        const fetchStaff = async () => {
            const data = []

            await getCollection( db, collectionType.staff, "name" ).then( res => res.forEach( s => {
                data.push({
                    id: s.id,
                    title: s.name,
                    label: s.name
                })
            } ) )

            setStaffList(data)
        }

        fetchStaff()
    }, [])

    return (
        <StaffData.Provider value={{ staffList, setStaffList }}>
            {children}
        </StaffData.Provider>
    );
}

const useStaffContext = () => {
	return useContext(StaffData);
}

export { StaffData, StaffContextProvider, useStaffContext }