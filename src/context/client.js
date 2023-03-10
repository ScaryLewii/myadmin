import { createContext, useContext, useEffect, useState } from 'react';
import { getCollection } from '@/firebase/utils';
import { db } from '@/firebase/config';
import collectionType from '@/firebase/types';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const ClientData = createContext(null)

const ClientContextProvider = ({ children }) => {
	const [clientList, setClientList] = useState([])

    useEffect(() => {
        const fetchClient = async () => {
            const q = query(collection(db, collectionType.client), orderBy("name", "asc"))
            const querySnapshot = await getDocs(q);
            
            const results = querySnapshot.docs.map(doc => ({...doc.data(), id:doc.id }));
            const data = []
            results.forEach( c => {
                data.push({
                    id: c.id,
                    title: c.name,
                    label: c.name,
                    email: c.email ?? null,
                    phone: c.phone ?? null
                })
            } )

            setClientList(data)
        }

        fetchClient()
    }, [])

    return (
        <ClientData.Provider value={{ clientList, setClientList }}>
            {children}
        </ClientData.Provider>
    );
}

const useClientContext = () => {
	return useContext(ClientData);
}

export { ClientData, ClientContextProvider, useClientContext }