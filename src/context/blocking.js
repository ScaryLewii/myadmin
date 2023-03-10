import { createContext, useContext, useState } from 'react';

const BlockingData = createContext(null)

const BlockingContextProvider = ({ children }) => {
	const [blockingList, setBlockingList] = useState([])

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