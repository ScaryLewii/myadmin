import { createContext, useContext, useState } from 'react';

const StaffData = createContext(null)

const StaffContextProvider = ({ children }) => {
	const [staffList, setStaffList] = useState([])

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