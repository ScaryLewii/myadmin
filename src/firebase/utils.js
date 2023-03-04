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

const getServiceList = async () => {
	const data = []

	await getCollection( db, collectionType.service ).then( res => res.forEach( s => {
		let serviceObj = {}
		serviceObj.id = s.id
		serviceObj.title = s.name
		serviceObj.label = s.name + ' - ' + s.price + '£'
		serviceObj.price = s.price
		serviceObj.duration = s.duration

		data.push( serviceObj )
	} ) )

	return data
}

export { getStaffList, getServiceList }