import { createContext, useContext, useState } from 'react';

const ClientData = createContext(null)

const ClientContextProvider = ({ children }) => {
	const [clientList, setClientList] = useState([])

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