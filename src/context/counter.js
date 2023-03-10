import { createContext, useContext, useState } from 'react';

const CounterData = createContext(null)

const CounterContextProvider = ({children}) => {
	const [counter, setCounter] = useState(0)

	return (
		<CounterData.Provider value={{ counter, setCounter }}>
			{children}
		</CounterData.Provider>
	)
}

const useCounterContext = () => {
	return useContext(CounterData)
}

export { CounterData, useCounterContext, CounterContextProvider }