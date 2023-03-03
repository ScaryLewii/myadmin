import { db } from "./config"
import collectionType from "./types"
import { getCollection, getDocsByDate, getDocById } from "./utils-common"
import { addMinutes } from '@/ultilities/time'

const getStaffList = async () => {
	const data = []

	await getCollection( db, collectionType.staff ).then( res => res.forEach( s => {
		let staffObj = {}
		staffObj.id = s.id
		staffObj.title = s.name
		staffObj.label = s.name
	
		data.push( staffObj )
	} ) )
	
	return data
}

export { getStaffList }